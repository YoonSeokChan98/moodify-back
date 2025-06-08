import db from '../model/index.js';

const { User, Emotion } = db;

export const uploadImageFolder = (req, res) => {
  try {
    const file = req.file;
    // console.log('🚀 ~ uploadImageFolder ~ file:', file);
    if (!file) {
      return res.json({ result: false, message: '파일이 존재하지 않습니다.' });
    }
    // 파일 정보
    const fileInfo = {
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path,
    };
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
    const { userId, question, subject, content } = req.body;
    console.log('🚀 ~ WriteBoard ~ req.body:', req.body);

    const findUser = await User.findOne({ where: { id: userId } });
    // console.log('🚀 ~ WriteBoard ~ findUser:', findUser);
    if (!findUser) {
      return res.json({ result: false, message: '유저가 존재하지 않습니다.' });
    }
    res.json({ result: true });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
