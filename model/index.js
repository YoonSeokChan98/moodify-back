import Sequelize from 'sequelize';
import configFile from '../config/config.js';

import UserModel from './user.js';
import EmotionModel from './emotion.js';

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 유저 모델
db.User = UserModel(sequelize);
// 감정 모델
db.Emotion = EmotionModel(sequelize);

// 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
