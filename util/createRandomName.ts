import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const createRandomName = (): string =>
  `${uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    style: "capital",
    separator: " ",
  })}`;

export default createRandomName;
