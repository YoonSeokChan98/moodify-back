import db from '../model/index.js';
import dotenv from 'dotenv';

dotenv.config();

const { User, Membership } = db;

export const addMembership = async (req, res) => {
  try {
    const { membershipName, userId, paymentId } = req.body;
    const findUser = await User.findOne({ where: { id: userId } });
    if (!findUser) return res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);
    console.log('📅 시작일:', startDate.toISOString());
    console.log('📅 종료일:', endDate.toISOString());
    const response = await Membership.create({ membershipName, startDate, endDate, userId, paymentId });
    console.log('🚀 ~ userMembershipChange ~ response:', response);

    res.json({ result: true, data: response, message: '멤버십 등록 성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
// destroy
export const removeMembership = async (req, res) => {
  try {
    const { userId } = req.query;
    const findUser = await User.findOne({ where: { id: userId } });
    console.log('🚀 ~ removeMembership ~ userId:', userId);
    if (!findUser) return res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    await Membership.destroy({ where: { userId: findUser.id } });
    res.json({ result: true, message: '멤버십 삭제 성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
