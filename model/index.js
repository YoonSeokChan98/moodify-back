import Sequelize from 'sequelize';
import configFile from '../config/config.js';

import UserModel from './user.js';
import EmotionModel from './emotion.js';
import ImageModel from './image.js';
import BoardModel from './board.js';
import LikedBoardModel from './likedBoard.js';

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 유저 모델
db.User = UserModel(sequelize);
// 게시글 모델
db.Board = BoardModel(sequelize);
// 좋아요 모델
db.LikedBoard = LikedBoardModel(sequelize);
// 감정 모델
db.Emotion = EmotionModel(sequelize);
// 이미지 모델
db.Image = ImageModel(sequelize);

// 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
