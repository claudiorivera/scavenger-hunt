import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import nextConnect from "next-connect";
import middleware from "../../../middleware";
import verificationRequest from "../../../util/verificationRequest";
import User from "../../../models/User";

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
            // Find the user and save, so that missing values populate with defaults
            const userFound = await User.findById(user.id);
            await userFound.save();
          } catch (error) {
            console.log(error);
          }
        }
        if (user) {
          token.uid = user.id;
        }
        return Promise.resolve(token);
      },
      session: async (session, token) => {
        session.user.id = token.uid;
        return Promise.resolve(session);
      },
    },
  })
);

export default handler;
