import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGO_URI', 'CLIENT_ORIGIN', 'JWT_SECRET','GEMINI_API_KEY'];

function validateEnv() {
  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

validateEnv();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  clientOrigin: process.env.CLIENT_ORIGIN,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d', //kam chalau
  geminiApiKey: process.env.GEMINI_API_KEY
};

export default config;