import { DataTypes } from 'sequelize';

const LikedBoardModel = (sequelize) => {
  const LikedBoard = sequelize.define(
    'liked_boards',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'boards',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    // {
    //   indexes: [
    //     {
    //       unique: true, // 복합 유니크 제약 조건 추가
    //       fields: ['userId', 'boardId'], // userId + boardId 조합 고유
    //     },
    //   ],
    // }
  );

  LikedBoard.associate = (db) => {
    LikedBoard.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    LikedBoard.belongsTo(db.Board, { foreignKey: 'boardId', targetKey: 'id' });
  };

  return LikedBoard;
};

export default LikedBoardModel;
