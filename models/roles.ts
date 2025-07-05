"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

/**
 * Factory function to define the Role Sequelize model.
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} dataTypes - The Sequelize DataTypes.
 * @returns {Model} The Role model.
 */
export function RoleFactory(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  class Role extends Model {
    public static associate(models: any) {
      // define association here
      Role.hasMany(models.UserRole, { foreignKey: "roleId", as: "userRoles" });
      Role.hasMany(models.RolePermission, {
        foreignKey: "roleId",
        as: "rolePermissions",
      });
    }
  }
  Role.init(
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: dataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      active: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "outsized_roles",
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Role;
}
