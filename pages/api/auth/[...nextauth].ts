import middleware from "@middleware";
import User from "@models/User";
import randomlyGeneratedName from "@util/randomlyGeneratedName";
import verificationRequest from "@util/verificationRequest";
import Axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

handler.use((req: NextApiRequest, res: NextApiResponse) =>
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
            const userFound = await User.findById(user?.id);
            // Generate random name, if none is provided
            if (user?.name) {
              userFound.name = user.name;
            } else {
              userFound.name = randomlyGeneratedName();
            }
            // Generate random avatar, if none is provided
            if (user?.image) {
              userFound.image = user.image;
            } else {
              const response = await Axios.post(
                `${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL}/image/upload`,
                {
                  file: "https://picsum.photos/180", //Random 180x180 photo from picsum.photos
                  upload_preset:
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_AVATARS,
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
      session: async (session, sessionToken) => {
        session.user.id = sessionToken.uid as string;
        session.user.isAdmin = sessionToken.isAdmin as boolean;
        return Promise.resolve(session);
      },
    },
  })
);

export default handler;
