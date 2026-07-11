import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables");
}

const ENV = {
  PORT: process.env.PORT,
};

export default ENV;
