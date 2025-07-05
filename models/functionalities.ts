"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

/**
 * Factory function to define the Functionality Sequelize model.
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} dataTypes - The Sequelize DataTypes.
 * @returns {Model} The Functionality model.
 */
export function FunctionalityFactory(
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
) {
  class Functionality extends Model {
    public static associate(models: any) {
      Functionality.hasMany(models.RolePermission, {
        foreignKey: "functionalityId",
        as: "rolePermissions",
      });
    }
  }
  Functionality.init(
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
        unique: true,
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
      modelName: "Functionality",
      tableName: "outsized_functionalities",
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Functionality;
}
