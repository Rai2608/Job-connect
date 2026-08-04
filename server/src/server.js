const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');

// Connect to Database
connectDB().then(() => {
  // Start server
  app.listen(env.PORT, () => {
    logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`API Documentation available at http://localhost:${env.PORT}/api/docs`);
  });
}).catch((err) => {
  logger.error(`Database connection failed: ${err.message}`);
  process.exit(1);
});
