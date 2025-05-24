import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './model/index.js';

import userRouter from './router/user.js';
import nodemailerRouter from './router/nodemailer.js';

dotenv.config();

const app = express();
const PORT = process.env.LOCAL_PORT;

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('서버 연결 성공!');
});

// API 라우터
app.use('/api/user', userRouter);
app.use('/api/nodemailer', nodemailerRouter);

db.sequelize
  // alter: true -> 컬럼 변경만 적용 // 예) 실서비스 환경
  // force: true -> 테이블 전체 삭제 후 새로 생성 // 개발 환경
  .sync({ force: true })
  .then(() => {
    console.log('데이터베이스 연결 성공');
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`데이터베이스 연결 실패: ${err}`);
  });
