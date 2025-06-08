import { DataTypes } from 'sequelize';

const EmotionModel = (sequelize) => {
  const Emotion = sequelize.define('emotions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // 중립적
    neutral: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // 행복
    happy: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // 슬픔
    sad: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // 분노
    angry: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // 두려움
    fearful: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // 혐오
    disgusted: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // 놀람
    surprised: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  });

  // 관계 설정
  Emotion.associate = (db) => {
    Emotion.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    Emotion.hasOne(db.Board, { foreignKey: 'emotionId', sourceKey: 'id' });
  };
  return Emotion;
};

export default EmotionModel;
