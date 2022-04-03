export const getResizedCloudinaryUrls = (publicId: string) => {
  const baseUrl =
    "https://res.cloudinary.com/" +
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const fullSizeParams = "/w_512,h_512,c_fill,g_center,q_auto:best/";
  const thumbnailParams = "/w_80,h_80,c_fill,g_center,q_auto:best/";

  return {
    imageUrl: baseUrl + fullSizeParams + publicId,
    thumbnailUrl: baseUrl + thumbnailParams + publicId,
  };
};
