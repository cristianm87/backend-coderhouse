import { IDao } from './interfaces/daos/IDao';

import { MemoryDao } from './daos/MemoryDao';
import { MongoDbDao } from './daos/MongoDbDao';
import { MongoDbDbaasDao } from './daos/MongoDbDbaasDao';
import { MySqlDao } from './daos/MySqlDao';
import { MySqlSQLite3Dao } from './daos/MySqlSQLite3Dao';
import { FileSystemDao } from './daos/FileSystemDao';
import { FirebaseDao } from './daos/FirebaseDao';

export class DaoFactory {
  getDao(option: number): IDao {
    switch (option) {
      case 0:
        return new MemoryDao();
        break;
      case 1:
        return new MongoDbDao();
        break;
      case 2:
        return new MongoDbDbaasDao();
        break;
      case 3:
        return new MySqlDao();
        break;
      case 4:
        return new MySqlSQLite3Dao();
        break;
      case 5:
        return new FileSystemDao();
        break;
      case 6:
        return new FirebaseDao();
        break;
      default:
        return new MongoDbDao();
        break;
    }
  }
}
