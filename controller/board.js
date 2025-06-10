import db from '../model/index.js';

const { User, Emotion, Board } = db;

export const uploadImageFolder = (req, res) => {
  try {
    const file = req.file;
    // console.log('🚀 ~ uploadImageFolder ~ file:', file);
    if (!file) {
      return res.json({ result: false, message: '파일이 존재하지 않습니다.' });
    }
    // 파일 정보
    // const fileInfo = {
    //   originalName: file.originalname,
    //   filename: file.filename,
    //   size: file.size,
    //   mimetype: file.mimetype,
    //   path: file.path,
    // };
    // 접근 가능한 URL 생성
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    // console.log('🚀 ~ uploadImageFolder ~ baseUrl:', baseUrl);
    const fileUrl = `${baseUrl}/uploads/images/${file.filename}`;
    // console.log('🚀 ~ uploadImageFolder ~ fileUrl:', fileUrl);
    res.json({
      result: true,
      data: {
        url: fileUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const WriteBoard = async (req, res) => {
  try {
    const { visibilityStatus, userEmotion, userId, question, title, content } = req.body;
    const findUser = await User.findOne({ where: { id: userId } });
    if (!findUser) {
      return res.json({ result: false, message: '유저가 존재하지 않습니다.' });
    }
    const emotionResponse = await Emotion.create({
      neutral: userEmotion.neutral,
      happy: userEmotion.happy,
      sad: userEmotion.sad,
      angry: userEmotion.angry,
      fearful: userEmotion.fearful,
      disgusted: userEmotion.disgusted,
      surprised: userEmotion.surprised,
      userId: findUser.id,
    });
    if (!emotionResponse) {
      res.json({ result: false, message: '감정 데이터 저장 실패' });
    }

    const boardResponse = await Board.create({
      question,
      title,
      content,
      visibilityStatus,
      emotionId: emotionResponse.id,
    });
    if (!boardResponse) {
      res.json({ result: false, message: '게시글 저장 실패' });
    }
    res.json({ result: true, message: '감정 데이터 & 게시글 저장 성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const getAllBoard = async (req, res) => {
  try {
    const response = await Board.findAll();
    // console.log("🚀 ~ getAllBoard ~ response:", response)
    res.json({ result: true, data: response });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
