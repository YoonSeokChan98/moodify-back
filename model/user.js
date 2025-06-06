import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // 유저 이름
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 유저 이메일
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 유저 비밀번호
    userPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 유저 상태(가입상태, 탈퇴상태)
    userStatus: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false,
    },
    // 유저 권한
    userRole: {
      type: DataTypes.ENUM('guest', 'admin'),
      defaultValue: 'guest',
      allowNull: false,
    },
    // 유료 구독 가입 상태
    userMembershipStatus: {
      type: DataTypes.ENUM('basic', 'premium'),
      defaultValue: 'basic',
      allowNull: false,
    },
  });

    // 관계 설정
    User.associate = (db) => {
      // User : Emotion (1:N)
      User.hasMany(db.Emotion, { foreignKey: 'emotionId', sourceKey: 'id' });
    };
  return User;
};

export default UserModel;
