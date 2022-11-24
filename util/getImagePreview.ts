export const getImagePreview = (file: File): Promise<HTMLImageElement> =>
  new Promise((res) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      res(image);
    };
  });
