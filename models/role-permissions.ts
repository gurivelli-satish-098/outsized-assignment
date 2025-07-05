"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

/**
 * Factory function to define the RolePermission Sequelize model.
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} dataTypes - The Sequelize DataTypes.
 * @returns {Model} The RolePermission model.
 */
export function RolePermissionFactory(
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
) {
  class RolePermission extends Model {
    public static associate(models: any) {
      // define association here
      RolePermission.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });
      RolePermission.belongsTo(models.Functionality, {
        foreignKey: "functionalityId",
        as: "functionality",
      });
    }
  }
  RolePermission.init(
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      roleId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        field: "role_id",
        references: {
          model: "outsized_roles",
          key: "id",
        },
      },
      functionalityId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        field: "functionality_id",
        references: {
          model: "outsized_functionalities",
          key: "id",
        },
      },
      access: {
        type: dataTypes.ENUM("none", "read", "write", "delete"),
        allowNull: false,
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
      modelName: "RolePermission",
      tableName: "outsized_role_permissions",
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["role_id", "functionality_id"],
        },
        {
          fields: ["functionality_id"],
        },
      ],
    }
  );
  return RolePermission;
}
