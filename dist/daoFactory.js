"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoFactory = void 0;
var MemoryDao_1 = require("./daos/MemoryDao");
var MongoDbDao_1 = require("./daos/MongoDbDao");
var MongoDbDbaasDao_1 = require("./daos/MongoDbDbaasDao");
var MySqlDao_1 = require("./daos/MySqlDao");
var MySqlSQLite3Dao_1 = require("./daos/MySqlSQLite3Dao");
var FileSystemDao_1 = require("./daos/FileSystemDao");
var FirebaseDao_1 = require("./daos/FirebaseDao");
var DaoFactory = /** @class */ (function () {
    function DaoFactory() {
    }
    DaoFactory.prototype.getDao = function (option) {
        switch (option) {
            case 0:
                return new MemoryDao_1.MemoryDao();
                break;
            case 1:
                return new MongoDbDao_1.MongoDbDao();
                break;
            case 2:
                return new MongoDbDbaasDao_1.MongoDbDbaasDao();
                break;
            case 3:
                return new MySqlDao_1.MySqlDao();
                break;
            case 4:
                return new MySqlSQLite3Dao_1.MySqlSQLite3Dao();
                break;
            case 5:
                return new FileSystemDao_1.FileSystemDao();
                break;
            case 6:
                return new FirebaseDao_1.FirebaseDao();
                break;
            default:
                return new MemoryDao_1.MemoryDao();
                break;
        }
    };
    return DaoFactory;
}());
exports.DaoFactory = DaoFactory;
