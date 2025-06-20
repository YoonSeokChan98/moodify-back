import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../model/index.js';

const { User } = db;

const findOneUser = async (userId) => {
  const user = await User.findOne({ where: { id: userId, userStatus: 'active' } });
  const UserInfo = {
    userId: user.id,
    userName: user.userName,
    userEmail: user.userEmail,
    userRole: user.userRole,
    userMembershipStatus: user.userMembershipStatus,
  };
  return UserInfo;
};

export const signup = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;
    const encryptionPassword = await bcrypt.hash(userPassword, 10);
    await User.create({
      userName,
      userEmail,
      userPassword: encryptionPassword,
    });

    res.json({ result: true, message: '회원가입 성공' });
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
          name: findUser.userName,
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
      res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    }
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

// 유저 정보 1개 가져오기
export const getOneUserInfo = async (req, res) => {
  try {
    const { userId } = req.query;
    const findUser = await findOneUser(userId);
    if (!findUser) return res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    res.json({ result: true, data: findUser, message: '회원 정보 조회 성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

// 유저 정보 수정하기
export const updateUserInfo = async (req, res) => {
  try {
    const { userId, userName, userEmail } = req.body;
    const findUser = await findOneUser(userId);
    if (!findUser) return res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    await User.update({ userName: userName, userEmail: userEmail }, { where: { id: findUser.userId } });
    const reFindUser = await findOneUser(userId);
    const jwtToken = {
      id: reFindUser.id,
      email: reFindUser.userEmail,
    };
    const token = jwt.sign({ user: jwtToken }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_LIFETIME,
    });
    console.log('🚀 ~ updateUserInfo ~ reFindUser:', reFindUser);
    res.json({ result: true, data: reFindUser, token: token, message: '회원정보 수정 성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

// 유저 탈퇴하기
export const removeUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const findUser = await findOneUser(userId);
    if (!findUser) return res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    await User.update({ userStatus: 'inactive' }, { where: { id: findUser.userId } });
    res.json({ result: true, message: '회원 탈퇴에 성공했습니다.' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

// 비밀번호 변경
export const updateUserPassword = async (req, res) => {
  try {
    const { userId, userLegacyPassword, userNewPassword } = req.body;
    const findUser = await User.findOne({ where: { id: userId, userStatus: 'active' } });
    if (findUser) {
      const decryptionPassword = await bcrypt.compare(userLegacyPassword, findUser.userPassword);

      if (decryptionPassword) {
        const encryptionPassword = await bcrypt.hash(userNewPassword, 10);

        /**
         * bcrypt는 기존 비밀번호가 동일한지 확인이 불가능하다.
         * 이유
         * 1. bcrypt는 단방향이다. 그래서 복호화가 불가능하다.
         * 2. 같은 text값이여도 해싱할 때마다 암호화된 값이 다르다.
         */
        // console.log('🚀 ~ updateUserPassword ~  findUser.userPassword:', findUser.userPassword);
        // console.log('🚀 ~ updateUserPassword ~ encryptionPassword:', encryptionPassword);
        // if (findUser.userPassword === encryptionPassword) {
        //   return res.json({ result: false, message: '기존 비밀번호와 동일합니다.' });
        // }

        await User.update({ userPassword: encryptionPassword }, { where: { id: userId } });
        res.json({ result: true, message: '비밀번호 변경에 성공했습니다.' });
      } else {
        res.json({ result: false, message: '비밀번호가 틀립니다.' });
      }
    } else {
      res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    }
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

// 비밀번호 찾기
export const resetUserPassword = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    const findUserEmail = await User.findOne({ where: { userEmail, userStatus: 'active' } });
    if (findUserEmail) {
      const encryptionPassword = await bcrypt.hash(userPassword, 10);
      await User.update({ userPassword: encryptionPassword }, { where: { userEmail } });
      res.json({ result: true, message: '비밀번호 변경에 성공했습니다.' });
    } else {
      res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    }
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
