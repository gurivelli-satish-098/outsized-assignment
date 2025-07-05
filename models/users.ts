"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

/**
 * Factory function to define the User Sequelize model.
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} dataTypes - The Sequelize DataTypes.
 * @returns {Model} The User model.
 */
export function UserFactory(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  class User extends Model {
    public static associate(models: any) {
      // define association here
      User.hasMany(models.UserRole, { foreignKey: "userId", as: "userRoles" });
      User.hasMany(models.UserRole, {
        foreignKey: "assignedBy",
        as: "assignedByUser",
      });
    }
  }
  User.init(
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: dataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      email: {
        type: dataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      name: {
        type: dataTypes.STRING(100),
        allowNull: true,
      },
      password: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      verified: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      active: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "outsized_users",
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
}
