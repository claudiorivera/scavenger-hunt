import middleware from "@middleware";
import User from "@models/User";
import randomlyGeneratedName from "@util/randomlyGeneratedName";
import verificationRequest from "@util/verificationRequest";
import axios from "axios";
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
            user.name
              ? (userFound.name = user.name)
              : // Generate random name, if none is provided
                (userFound.name = randomlyGeneratedName());
            if (user.image) {
              userFound.image = user.image;
            } else {
              // Generate random avatar, if none is provided
              const response = await axios.post(
                `${process.env.CLOUDINARY_BASE_URL}/image/upload`,
                {
                  file: "https://picsum.photos/180", //Random 180x180 photo from picsum.photos
                  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET_AVATARS,
                }
              );
              userFound.image = response.data.secure_url;
            }
            await userFound.save();
          } catch (error) {
            console.error(error);
          }
        }
        if (user) {
          token.uid = user.id;
          try {
            const userFound = await User.findById(user.id);
            token.isAdmin = userFound?.isAdmin;
          } catch (error) {
            console.error(error);
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
