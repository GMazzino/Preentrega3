import { mongoose, userModel } from '../models/mongoDB_schemas.js';
import appConfig from '../../app_config.js';
import logger from '../utils/logger.js';
import { hashDehash } from '../utils/pwd_hash.js';
import sendMail from '../utils/mailer.js';

class User {
  async #dbConnection() {
    try {
      await mongoose.connect(appConfig.mongoRemote.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      mongoose.connection.on('error', (err) => {
        logger.error(`${err}`);
        throw Error(err.message);
      });
      return mongoose.connection;
    } catch (err) {
      logger.error(`${err}`);
      throw Error(err.message);
    }
  }

  //---------------------------------------------------------------------------
  // findUserByName: Verifies if user exists in db.
  // Param user: username to be searched
  // Returns foundUser: user object in case it exists in db or null otherwise
  //---------------------------------------------------------------------------
  async findUserByName(userName) {
    if (userName) {
      const db = await this.#dbConnection();
      try {
        const foundUser = await userModel.findOne({ user: userName });
        await db.close();
        return foundUser;
      } catch (err) {
        logger.error(`${err}`);
        throw Error(err.message);
      }
    } else {
      throw new Error('Error en la petición. Se requiere usuario');
    }
  }

  //---------------------------------------------------------------------------
  // addUser: Adds a new user to db.
  // Params user: user object according to mongo DB user Schema
  //        pwd: plain password
  //---------------------------------------------------------------------------
  async addUser(user, pwd) {
    if (user.username && pwd) {
      try {
        let newUser = await this.findUserByName(user.username);
        if (!newUser) {
          const pwdHash = await hashDehash({ pwd: pwd, op: 'hash' });
          const db = await this.#dbConnection();
          newUser = await userModel.create({
            user: user.username,
            pwdHash: pwdHash,
            name: user.name,
            age: user.age,
            address: user.address,
            phoneNmbr: user.phone,
          });
          logger.info('Closing DB connection');
          sendMail(newUser);
          await db.close();
          return newUser;
        } else {
          throw new Error('El usuario ingresado ya existe');
        }
      } catch (err) {
        logger.error(`${err}`);
        throw Error(err.message);
      }
    } else {
      throw new Error('Error en la petición. Se requiere usuario y contraseña');
    }
  }
}

export const user = new User();
