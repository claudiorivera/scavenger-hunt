import { MongoClient } from "mongodb";

declare global {
  var mongoClientPromise: Promise<MongoClient>;
  var mongoose: {
    promise: any;
    conn: any;
  };
}
