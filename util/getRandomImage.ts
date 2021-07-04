import axios from "axios";

const getRandomImage = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL}`,
      {
        file: "https://picsum.photos/180", //Random 180x180 photo from picsum.photos
        upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_AVATARS,
      }
    );
    return response.data.secure_url as string;
  } catch (error) {
    console.error(error);
  }
};

export default getRandomImage;
