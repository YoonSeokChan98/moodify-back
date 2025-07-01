import express from 'express';
import db from './model/index.js';
import dotenv from 'dotenv';
import cors from 'cors';
import config from './config/config.js';

import userRouter from './router/user.js';
import nodemailerRouter from './router/nodemailer.js';
import emotionRouter from './router/emotion.js';
import boardRouter from './router/board.js';
import paymentRouter from './router/payment.js';
import membershipRouter from './router/membership.js';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env]; // 환경에 맞는 설정 사용

const app = express();
const HOST = currentConfig.serverHost;
const PORT = currentConfig.serverPort;

const corsOptions = {
  origin: ['https://moodify-front.vercel.app','http://moodify-front.vercel.app'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('서버 연결 성공!');
});

app.use('/uploads', express.static('uploads'));

// API 라우터
app.use('/api/user', userRouter);
app.use('/api/nodemailer', nodemailerRouter);
app.use('/api/emotion', emotionRouter);
app.use('/api/board', boardRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/membership', membershipRouter);

db.sequelize
  // alter: true -> 컬럼 변경만 적용 // 예) 실서비스 환경
  // force: true -> 테이블 전체 삭제 후 새로 생성 // 개발 환경
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
    app.listen(PORT, () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`개발 환경 / 서버 실행: http://${HOST}:${PORT}`);
      } else if (process.env.NODE_ENV === 'production') {
        console.log(`서버 배포 환경 / 서버 실행: http://${HOST}:${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error(`데이터베이스 연결 실패: ${err}`);
  });
