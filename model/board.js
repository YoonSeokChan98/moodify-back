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
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    visibilityStatus: {
      type: DataTypes.ENUM('public', 'private'),
      allowNull: false,
    },
    removeStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });


  Board.associate = (db) => {
    // 1대1
    Board.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    // 1대1
    Board.hasOne(db.Emotion, { foreignKey: 'boardId', sourceKey: 'id' });
    // 1대다
    Board.hasMany(db.Image, { foreignKey: 'boardId', sourceKey: 'id' });
    // 1대다
    Board.hasMany (db.LikedBoard, { foreignKey: 'boardId', sourceKey: 'id' });
  };

  return Board;
};

export default BoardModel;
