import { DataTypes } from 'sequelize';

const ImageModel = (sequelize) => {
  const Image = sequelize.define('images', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
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
  });

  Image.associate = (db) => {
    Image.belongsTo(db.Board, { foreignKey: 'boardId', targetKey: 'id' });
  };

  return Image;
};

export default ImageModel;
