import { DataTypes } from 'sequelize';
// import { PaymentStatuses } from '../config/enum.js';

const MembershipModel = (sequelize) => {
  const Membership = sequelize.define('memberships', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // 멤버십 이름
    membershipName: {
      type: DataTypes.ENUM('basic', 'premium'),
      defaultValue: 'basic',
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'CANCELLED', 'EXPIRED'),
      defaultValue: 'ACTIVE',
    },
    // 유저 ID
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
    // 결제 ID
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'payments',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  // 관계 설정
  Membership.associate = (db) => {
    Membership.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    Membership.belongsTo(db.Payment, { foreignKey: 'paymentId', targetKey: 'id' });
  };

  return Membership;
};

export default MembershipModel;
