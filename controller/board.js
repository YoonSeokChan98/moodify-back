import db from '../model/index.js';
import { findOneUser } from './user.js';

const { User, Emotion, Board, LikedBoard } = db;

export const uploadImageFolder = (req, res) => {
  try {
    const file = req.file;
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
    const fileUrl = `${baseUrl}/uploads/images/${file.filename}`;

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

    const boardResponse = await Board.create({
      question,
      title,
      content,
      visibilityStatus,
      userId: findUser.id,
    });
    if (!boardResponse) return res.json({ result: false, message: '게시글 저장 실패' });

    const emotionResponse = await Emotion.create({
      neutral: userEmotion.neutral,
      happy: userEmotion.happy,
      sad: userEmotion.sad,
      angry: userEmotion.angry,
      fearful: userEmotion.fearful,
      disgusted: userEmotion.disgusted,
      surprised: userEmotion.surprised,
      boardId: boardResponse.id,
    });
    if (!emotionResponse) return res.json({ result: false, message: '감정 데이터 저장 실패' });

    res.json({ result: true, message: '감정 데이터 & 게시글 저장 성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const getAllBoard = async (req, res) => {
  try {
    const response = await Board.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User }, { model: LikedBoard }, { model: Emotion }],
    });
    res.json({ result: true, data: response, message: '게시글을 최신순으로 가져왔습니다.' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const getAllUserBoard = async (req, res) => {
  try {
    const { userId } = req.query;
    const findUser = await findOneUser(userId);
    if (!findUser) return res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    const findAllBoards = await Board.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User }, { model: Emotion }],
      where: { userId: findUser.userId },
    });
    res.json({ result: true, data: findAllBoards, message: `${userId}의 사용자가 작성한 게시글을 전체 조회했습니다.` });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const getOneBoard = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.json({ result: false, message: '게시글 id가 없습니다.' });
    }
    const findOneBoard = await Board.findOne({
      where: { id },
      include: [{ model: User }, { model: Emotion }, { model: LikedBoard }],
    });
    if (!findOneBoard) {
      return res.json({ result: false, message: '게시글이 존재하지 않습니다.' });
    }
    res.json({ result: true, data: findOneBoard, message: '게시글 1개를 찾았습니다.' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const updateBoard = async (req, res) => {
  try {
    const { boardId, visibilityStatus, title, content } = req.body;
    const findBoard = await Board.findOne({ where: { id: boardId } });
    if (!findBoard) {
      return res.json({ result: false, message: '수정할 게시글이 존재하지 않습니다.' });
    }
    await Board.update(
      {
        title: title,
        content: content,
        visibilityStatus: visibilityStatus,
      },
      { where: { id: findBoard.id } }
    );
    res.json({ result: true, message: '수정에 성공했습니다.' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const removeBoard = async (req, res) => {
  try {
    const { id } = req.body;
    const findBoard = await Board.findOne({ where: { id } });
    if (!findBoard) {
      return res.json({ result: false, message: '삭제 요청한 게시글이 존재하지 않습니다.' });
    }
    await Board.update({ removeStatus: true }, { where: { id } });
    res.json({ result: true, message: '게시글 삭제 성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const likedBoardPlus = async (req, res) => {
  try {
    const { idData } = req.body;
    const findBoard = await Board.findOne({ where: { id: idData.boardId } });

    const findUser = await User.findOne({ where: { id: idData.userId } });

    const response = await LikedBoard.create({
      userId: findUser.id,
      boardId: findBoard.id,
    });
    res.json({ result: true, data: response, message: '성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
export const likedBoardMinus = async (req, res) => {
  try {
    const { idData } = req.body;
    const findBoard = await Board.findOne({ where: { id: idData.boardId } });

    const findUser = await User.findOne({ where: { id: idData.userId } });

    const response = await LikedBoard.destroy({ where: { userId: findUser.id, boardId: findBoard.id } });
    res.json({ result: true, data: response, message: '성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

export const getMyAllBoard = async (req, res) => {
  try {
    const { userId } = req.query;
    const findUser = await findOneUser(userId);
    if (!findUser) return res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });
    const findUserAllBoard = await Board.findAll({
      where: { userId: findUser.userId },
      order: [['createdAt', 'DESC']],
      include: [{ model: User }, { model: Emotion }, { model: LikedBoard }],
    });
    res.json({ result: true, data: findUserAllBoard, message: '성공' });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
