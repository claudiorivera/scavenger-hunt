import middleware from "@middleware";
import User from "@models/User";
import randomlyGeneratedName from "@util/randomlyGeneratedName";
import verificationRequest from "@util/verificationRequest";
import cloudinary from "cloudinary";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

handler.use((req, res) =>
  NextAuth(req, res, {
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
      Providers.Email({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        sendVerificationRequest: verificationRequest,
      }),
    ],
    database: process.env.MONGODB_URI,
    secret: process.env.SECRET,
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
      verifyRequest: "/auth/verifyrequest",
    },
    session: {
      jwt: true,
    },
    callbacks: {
      jwt: async (token, user, _account, _profile, isNewUser) => {
        if (isNewUser) {
          try {
            const userFound = await User.findById(user.id);
            const randomAvatar = await cloudinary.v2.uploader.upload(
              "https://picsum.photos/460",
              {
                upload_preset: "scavenger-hunt-avatars",
              }
            );
            userFound.name = user.name || randomlyGeneratedName();
            userFound.image = user.image || randomAvatar.url;
            await userFound.save();
          } catch (error) {
            console.log(error);
          }
        }
        if (user) {
          token.uid = user.id;
          try {
            const userFound = await User.findById(user.id);
            token.isAdmin = userFound?.isAdmin;
          } catch (error) {
            console.log(error);
          }
        }
        return Promise.resolve(token);
      },
      session: async (session, token) => {
        session.user.id = token.uid;
        session.user.isAdmin = token.isAdmin;
        return Promise.resolve(session);
      },
    },
  })
);

export default handler;
