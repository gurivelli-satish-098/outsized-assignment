"use strict";
import { Model, DataTypes, Sequelize } from "sequelize";

/**
 * Factory function to define the RequestLog Sequelize model.
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @param {typeof DataTypes} dataTypes - The Sequelize DataTypes.
 * @returns {Model} The RequestLog model.
 */
export function RequestLogFactory(
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
) {
  class RequestLog extends Model {
    public static associate(models: any) {
      // No associations needed for request logs
    }
  }

  RequestLog.init(
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ipAddress: {
        type: dataTypes.STRING(45),
        allowNull: false,
        field: "ip_address",
      },
      path: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
      method: {
        type: dataTypes.STRING(10),
        allowNull: false,
      },
      timestamp: {
        type: dataTypes.DATE,
        allowNull: false,
      },
      extra: {
        type: dataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RequestLog",
      tableName: "outsized_request_logs",
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: false, // No updated_at field in the table
    }
  );

  return RequestLog;
}
