import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    dialect: 'mysql',
  },
};

export default config