export const base64FromFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const htmlImageElementFromFile = (
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
