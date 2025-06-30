import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
    host: process.env.LOCAL_DB_HOST,
    username: process.env.LOCAL_DB_USERNAME,
    password: process.env.LOCAL_DB_PASSWORD,
    port: process.env.LOCAL_DB_PORT,
    database: process.env.LOCAL_DB_DATABASE,
    dialect: 'mysql',
    serverHost: process.env.LOCAL_HOST,
    serverPort: process.env.LOCAL_PORT,
  },
  production: {
    host: process.env.SERVER_DB_HOST,
    username: process.env.SERVER_DB_USERNAME,
    password: process.env.SERVER_DB_PASSWORD,
    port: process.env.SERVER_DB_PORT,
    database: process.env.SERVER_DB_DATABASE,
    dialect: 'mysql',
    serverHost: process.env.SERVER_HOST,
    serverPort: process.env.SERVER_PORT,
  },
};

export default config;
