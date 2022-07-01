import app from './server.js';
import appConfig from '../app_config.js';
import logger from './utils/logger.js';
import twilioClient from './utils/twilio.js';

app
  .listen(appConfig.PORT, () => {
    logger.info(`Server running and listening on port ${appConfig.PORT}`);
  })
  .on('error', (error) => logger.error(error.message));
