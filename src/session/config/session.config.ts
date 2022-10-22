import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import Redis from 'ioredis';

export default () => {
  const redisClient = new Redis();
  redisClient.connect().catch(console.error);
  const RedisStore = connectRedis(session);
  return session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.REDIS_SERCET ?? 'simple local secret!',
    resave: false,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  });
};
