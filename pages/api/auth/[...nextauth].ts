import middleware from "@middleware";
import User from "@models/User";
import randomlyGeneratedName from "@util/randomlyGeneratedName";
import verificationRequest from "@util/verificationRequest";
import Axios from "axios";
import NextAuth from "next-auth";
import { Session } from "next-auth/client";
import Providers from "next-auth/providers";
import { GenericObject } from "next-auth/_utils";
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
        // TODO: Find the correct way to do this
        sendVerificationRequest: verificationRequest as any,
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
            // Generate random name, if none is provided
            if (user.name) {
              userFound.name = user.name;
            } else {
              userFound.name = randomlyGeneratedName();
            }
            // Generate random avatar, if none is provided
            if (user.image) {
              userFound.image = user.image;
            } else {
              const response = await Axios.post(
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
      session: async (session: Session, sessionToken: GenericObject) => {
        session.user.id = sessionToken.uid;
        session.user.isAdmin = sessionToken.isAdmin;
        return Promise.resolve(session);
      },
    },
  })
);

export default handler;
