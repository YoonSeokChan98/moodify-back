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
