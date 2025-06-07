import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from '../../../utils/db'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Lưu user vào MongoDB khi đăng nhập lần đầu
      if (account.provider === 'google') {
        try {
          const client = await clientPromise;
          const db = client.db();
          
          // Kiểm tra xem user đã tồn tại chưa
          const existingUser = await db.collection('users').findOne({ email: user.email });
          
          if (!existingUser) {
            // Tạo user mới
            await db.collection('users').insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: 'google',
              googleId: profile.sub,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          } else {
            // Cập nhật thông tin user
            await db.collection('users').updateOne(
              { email: user.email },
              { 
                $set: {
                  name: user.name,
                  image: user.image,
                  updatedAt: new Date()
                }
              }
            );
          }
          return true;
        } catch (error) {
          console.error('Error saving user to database:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Thêm thông tin user vào JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      if (account && profile) {
        token.googleId = profile.sub;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Gửi thông tin từ token đến client
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.image;
      session.user.googleId = token.googleId;
      
      return session;
    },
  },
  pages: {
    signIn: '/', // Redirect về trang chủ thay vì trang sign-in mặc định
  },
  session: {
    strategy: 'jwt', // Sử dụng JWT thay vì database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})