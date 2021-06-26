// Capitalizes the first letter of every word in a string
const capitalizeEachWordOfString = (string: string): string =>
  string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default capitalizeEachWordOfString;
