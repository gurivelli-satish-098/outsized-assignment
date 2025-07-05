"use strict";

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { UserFactory } from "../models/users";
import { RoleFactory } from "../models/roles";
import { RolePermissionFactory } from "../models/role-permissions";
import { FunctionalityFactory } from "../models/functionalities";
import { UserRoleFactory } from "../models/user-roles";
import { RequestLogFactory } from "../models/request-logs";

const SqlPoolSettings = {
  max: 50,
  min: 0,
  idle: 0,
  acquire: 10000,
  evict: 60000,
};

const baseModelPath = `${__dirname}/../models`;
const Models = fs
  .readdirSync(baseModelPath)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      (file.slice(-3) === ".js" || file.slice(-3) === ".ts")
    );
  })
  .map((file) => require(path.join(baseModelPath, file)));

/**
 * Singleton for managing MySQL (Sequelize) database connection and models.
 */
class DatabaseContext {
  static _sequelize: any;
  static _db: any;

  /**
   * Load and authenticate the Sequelize instance.
   * @returns {Promise<any>} The Sequelize instance.
   */
  static loadSequelize = async () => {
    try {
      this._sequelize = new Sequelize(
        process.env.DB_DATABASE as string,
        "",
        "",
        {
          dialect: process.env.DB_DIALECT as any,
          port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
          replication: {
            read: [
              {
                host: process.env.DB_READ_HOST,
                username: process.env.DB_READ_USER,
                password: process.env.DB_READ_PASSWORD,
              },
            ],
            write: {
              host: process.env.DB_HOST,
              username: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
            },
          },
          pool: SqlPoolSettings,
          dialectOptions: {
            connectTimeout: 60000,
          },
          logging: false,
          retry: {
            match: [
              /Deadlock/i,
              (Sequelize as any).ConnectionError,
              (Sequelize as any).ConnectionRefusedError,
              (Sequelize as any).ConnectionTimedOutError,
              (Sequelize as any).TimeoutError,
            ] as any[],
            max: 2,
            backoffBase: 2000,
            backoffExponent: 2,
          },
        }
      );
      await this._sequelize.authenticate();
      console.log("Connected to Database.");
      return this._sequelize;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Connect to the database and initialize models.
   * @returns {Promise<any>} The database object with models.
   */
  static connect = async () => {
    if (!this._sequelize) {
      this._sequelize = await DatabaseContext.loadSequelize();
    } else {
      this._sequelize.connectionManager.initPools();
      if (
        Object.prototype.hasOwnProperty.call(
          this._sequelize.connectionManager,
          "getConnection"
        )
      ) {
        delete this._sequelize.connectionManager.getConnection;
      }
    }

    const db: any = {};
    db.User = UserFactory(this._sequelize, DataTypes);
    db.Role = RoleFactory(this._sequelize, DataTypes);
    db.RolePermission = RolePermissionFactory(this._sequelize, DataTypes);
    db.Functionality = FunctionalityFactory(this._sequelize, DataTypes);
    db.UserRole = UserRoleFactory(this._sequelize, DataTypes);
    db.RequestLog = RequestLogFactory(this._sequelize, DataTypes);

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = this._sequelize;
    db.Sequelize = Sequelize;
    this._db = db;

    return this._db;
  };

  /**
   * Get the current database object.
   * @returns {any} The database object.
   */
  static get db() {
    return this._db;
  }
}

export default DatabaseContext;
