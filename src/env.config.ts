export const CONFIG = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB || 'mongodb://localhost:27017/nest-pokemon',
  port: process.env.PORT || 3000
});