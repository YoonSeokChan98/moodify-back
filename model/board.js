import { DataTypes } from 'sequelize';

const BoardModel = (sequelize) => {
  const Board = sequelize.define('boards', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visibilityStatus: {
      type: DataTypes.ENUM('public', 'private'),
      allowNull: false,
    },
    emotionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'emotions',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  Board.associate = (db) => {
    Board.belongsTo(db.Emotion, { foreignKey: 'emotionId', targetKey: 'id' });
    Board.hasMany(db.Image, { foreignKey: 'boardId', sourceKey: 'id' });
  };

  return Board;
};

export default BoardModel;
