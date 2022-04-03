import axios from "axios";

type CloudinaryUploadResponse = {
  secure_url: string;
};
export const getRandomImage = async () => {
  try {
    const { data } = await axios.post<CloudinaryUploadResponse>(
      `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL}`,
      {
        file: "https://picsum.photos/180", //Random 180x180 photo from picsum.photos
        upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_AVATARS,
      }
    );
    return data.secure_url;
  } catch (error) {
    console.error(error);
    return "";
  }
};
