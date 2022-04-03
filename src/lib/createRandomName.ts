import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

export const createRandomName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    style: "capital",
    separator: " ",
  });
