import db from '../model/index.js';

const { User, Emotion } = db;

export const addEmotion = async (req, res) => {
  try {
    const { userId, emotions } = req.body;
    // 존재한다면 분석된 감정 db에 저장
    const newEmotion = await Emotion.create({
      neutral: emotions.neutral,
      happy: emotions.happy,
      sad: emotions.sad,
      angry: emotions.angry,
      fearful: emotions.fearful,
      disgusted: emotions.disgusted,
      surprised: emotions.surprised,
      userId: userId,
    });
    if (newEmotion) {
      res.json({ result: true, message: '감정 DB저장에 성공' });
    }
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const getAllUserEmotion = async (req, res) => {
  try {
    const { userId } = req.query;
    const findUser = await User.findOne({ where: { id: userId } });
    if (!findUser) return res.json({ result: false, message: '유저가 존재하지 않습니다.' });
    const findAllEmotion = await Emotion.findAll({ where: { userId: findUser.id } });
    res.json({ result: true, data: findAllEmotion, message: '유저가 분석한 감정데이터 전체를 불러왔습니다.' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
