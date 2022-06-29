import 'dotenv/config';
import parseArgs from 'minimist';

const options = {
  alias: {
    p: 'port',
    m: 'mode',
  },
  default: {
    port: 8080,
    mode: 'FORK',
  },
};
const args = parseArgs(process.argv.slice(2), options);

export default {
  PORT: process.env.PORT || args.port,
  APP_MODE: process.env.MODE || args.mode,
  PERSISTENCE: process.env.PERSISTENCE,
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  BCRYPT_SECRET: process.env.BCRYPT_SECRET || 'BCryPt_S3cR3t.',
  mongoRemote: {
    client: 'mongodb',
    url: process.env.MONGO_URL,
    advancedOptions: { useNewUrlParser: true, useUnifiedTopology: true },
  },
  sessionSecret: '535510n S3cr3T.',
};
