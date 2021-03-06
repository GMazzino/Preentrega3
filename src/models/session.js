import session from 'express-session';
import MongoStore from 'connect-mongo';
import appConfig from '../../app_config.js';

export default session({
  store: MongoStore.create({
    mongoUrl: appConfig.mongoRemote.url,
    mongoOptions: appConfig.mongoRemote.advancedOptions,
  }),
  secret: appConfig.sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  name: 'gmazzinoEcommerce',
  cookie: {
    maxAge: 10 * 60 * 1000,
    secure: false,
  },
});
