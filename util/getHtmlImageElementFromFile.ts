export const getHtmlImageElementFromFile = (
  file: File
): Promise<HTMLImageElement> =>
  new Promise((res, rej) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      res(image);
    };
    image.onerror = () => {
      rej("Error in getImagePreview");
    };
  });
