import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { user } from '../dao/mongoDB_users.js';
import { hashDehash } from '../utils/pwd_hash.js';
import logger from '../utils/logger.js';

passport.use(
  'register',
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        await user.addUser(req.body, password);
        return done(null, username);
      } catch (err) {
        logger.error(err);
        return done(null, false);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      let foundUser;
      let pwdOk = false;
      try {
        foundUser = await user.findUserByName(username);
        if (foundUser?.pwdHash) {
          pwdOk = await hashDehash({
            pwd: password,
            pwdHash: foundUser.pwdHash,
            op: 'dehash',
          });
        }
      } catch (err) {
        req.session.messages = [];
        return done(null, false, { message: err.message });
      }
      if (pwdOk) {
        return done(null, foundUser);
      } else {
        req.session.messages = [];
        return done(null, false, {
          message: 'Usuario o password incorrectos',
        });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
