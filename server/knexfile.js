import dotenv from "dotenv";
dotenv.config();

export default {
  client: "pg",
  connection: process.env.DB_URL || {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: ".knex/migrations",
  },
  seeds: {
    directory: ".knex/seeds",
  },
};