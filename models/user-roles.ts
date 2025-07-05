"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

/**
 * Factory function to define the UserRole Sequelize model.
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} dataTypes - The Sequelize DataTypes.
 * @returns {Model} The UserRole model.
 */
export function UserRoleFactory(
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
) {
  class UserRole extends Model {
    public static associate(models: any) {
      // define association here
      UserRole.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      UserRole.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
      UserRole.belongsTo(models.User, {
        foreignKey: "assignedBy",
        as: "assignedByUser",
      });
    }
  }
  UserRole.init(
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      roleId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        field: "role_id",
      },
      assignedBy: {
        type: dataTypes.INTEGER,
        allowNull: true,
        field: "assigned_by",
      },
      active: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: dataTypes.DATE,
        allowNull: true,
        defaultValue: (sequelize as any).literal("CURRENT_TIMESTAMP"),
        field: "created_at",
      },
      updatedAt: {
        type: dataTypes.DATE,
        allowNull: true,
        defaultValue: (sequelize as any).literal("CURRENT_TIMESTAMP"),
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "UserRole",
      tableName: "outsized_user_roles",
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["user_id", "role_id"],
        },
        {
          fields: ["role_id"],
        },
        {
          fields: ["assigned_by"],
        },
      ],
    }
  );
  return UserRole;
}
