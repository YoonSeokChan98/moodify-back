import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../model/index.js';

const { User } = db;

export const signup = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    // 비밀번호 암호화
    const encryptionPassword = await bcrypt.hash(userPassword, 10);
    const newUser = await User.create({
      userName,
      userEmail,
      userPassword: encryptionPassword,
    });

    res.json({
      result: true,
      data: newUser, // 회원가입과 동시에 로그인 하는게 필요할까?
      message: '회원가입 성공',
    });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

// 로그인
export const login = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    const findUser = await User.findOne({ where: { userEmail, userStatus: 'active' } });
    if (findUser) {
      const decryptionPassword = await bcrypt.compare(userPassword, findUser.userPassword);
      if (decryptionPassword) {
        // 유저 정보
        const userInfo = {
          id: findUser.id,
          email: findUser.userEmail,
          role: findUser.userRole,
          membershipStatus: findUser.userMembershipStatus,
        };

        // 유저 토큰
        const jwtToken = {
          id: findUser.id,
          email: findUser.userEmail,
        };
        const token = jwt.sign({ user: jwtToken }, process.env.JWT_ACCESS_SECRET, {
          expiresIn: process.env.JWT_ACCESS_LIFETIME,
        });

        res.json({ result: true, data: userInfo, token: token, message: '로그인 성공. 토큰이 발급되었습니다.' });
      } else {
        res.json({ result: false, message: '비밀번호가 틀립니다.' });
      }
    } else {
      res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴된 회원입니다.' });
    }
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

// 내 정보 가져오기
// export const getMyProfile = async(req,res)=>{
//   try {
//     const {token} = req.headers
//     console.log("🚀 ~ getMyProfile ~ token:", token)

//   } catch (error) {
//     res.json({ result: false, message: '서버오류', error: error.message });
//   }
// }