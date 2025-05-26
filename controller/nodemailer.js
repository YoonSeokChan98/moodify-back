import db from '../model/index.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();
const { User } = db;

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, //  사용 할 이메일 서비스명 / 예) gmail, naver
  host: process.env.EMAIL_HOST, // SMTP 서버명
  port: process.env.EMAIL_PORT, // SMTP 포트 번호
  secure: false,
  auth: {
    user: process.env.EMAIL_ID, // 사용 할 이메일 아이디
    pass: process.env.EMAIL_PASSWORD, // 발급하여 저장한 비밀번호
  },
  debug: true,
});

// 회원가입 이메일 인증
export const sendAuthNumberEmail = async (req, res) => {
  try {
    const { userEmail } = req.body;

    // 가입된 이메일 중복 체크
    const findUserEmail = await User.findOne({ where: { userEmail: userEmail } });
    if (findUserEmail) {
      return res.json({ result: false, message: '이미 존재하는 회원의 이메일 입니다.' });
    }

    // 이메일 인증용 6자리 난수 생성
    const authNumber = Math.floor(Math.random() * 888888) + 111111;
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: userEmail,
      subject: `
      [moodify] 이메일 확인 인증번호 안내
      `,
      text: ` 
      아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n
      연락처 이메일 👉 ${userEmail}\n
      인증번호 6자리 👉 ${authNumber}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ result: true, authNumber: authNumber, message: `${userEmail}로 인증번호 발송 성공했습니다.` });
  } catch (error) {
    console.log(`${req.body.userEmail}로 전송 실패`);
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

// 비밀번호 변경
export const sendAuthNumberPasswordReset = async (req, res) => {
  try {
    const { userEmail } = req.body;

    // 이메일 인증용 6자리 난수 생성
    const authNumber = Math.floor(Math.random() * 888888) + 111111;
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: userEmail,
      subject: `
      [moodify] 비밀번호 변경 인증번호 안내
      `,
      text: ` 
      아래 인증번호를 확인하여 비밀번호 변경 인증을 완료해 주세요.\n
      연락처 이메일 👉 ${userEmail}\n
      인증번호 6자리 👉 ${authNumber}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ result: true, message: `${userEmail}로 인증번호 발송 성공했습니다.` });
  } catch (error) {
    console.log(`${req.body.userEmail}로 전송 실패`);
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
