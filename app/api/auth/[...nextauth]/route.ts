// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      session.user.id = user.id;
      session.user.role = user.role || 'student';
      return session;
    },
    async signIn({ user, account, profile }: any) {
      try {
        await connectDB();
        
        // Check if user already exists in our custom User model
        const existingUser = await User.findOne({ email: user.email });
        
        if (existingUser) {
          // Update Google ID if not present
          if (!existingUser.googleId && account?.provider === 'google') {
            existingUser.googleId = account.providerAccountId;
            existingUser.provider = 'google';
            existingUser.emailVerified = true;
            existingUser.avatar = user.image || existingUser.avatar;
            await existingUser.save();
          }
          return true;
        }
        
        // Create new user in our custom User model
        await User.create({
          name: user.name,
          email: user.email,
          googleId: account?.providerAccountId,
          provider: 'google',
          emailVerified: true,
          avatar: user.image || '',
          role: 'student',
        });
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };