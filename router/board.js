import express from 'express';
import {
  WriteBoard,
  getAllBoard,
  getAllUserBoard,
  getMyAllBoard,
  getOneBoard,
  likedBoardMinus,
  likedBoardPlus,
  removeBoard,
  updateBoard,
  uploadImageFolder,
} from '../controller/board.js';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// 저장 경로 지정 (uploads/images 폴더 없으면 생성)
const uploadPath = 'uploads/images';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// 파일 필터링 (이미지만 허용)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('허용되지 않는 파일 형식입니다. 이미지 파일만 업로드 가능합니다.'), false);
  }
};

// Multer 미들웨어 설정
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  },
});

// 이미지 업로드
router.post('/upload-image-folder', upload.single('file'), uploadImageFolder);
router.post('/write-board', WriteBoard);
router.get('/get-all-board', getAllBoard);
router.get('/get-all-user-board', getAllUserBoard);
router.get('/get-one-board', getOneBoard);
router.patch('/update-board', updateBoard);
router.patch('/remove-board', removeBoard);
router.post('/liked-board-plus', likedBoardPlus);
router.post('/liked-board-minus', likedBoardMinus);
router.get('/get-my-all-board', getMyAllBoard);

export default router;
