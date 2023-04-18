import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import Redis from 'ioredis';

export default () => {
  const maxAge = 30 * 60 * 1000;
  switch (process.env.NODE_ENV) {
    case 'production':
      const redisClient = new Redis();
      redisClient.connect().catch(console.error);
      const RedisStore = connectRedis(session);
      return session({
        store: new RedisStore({ client: redisClient }),
        saveUninitialized: false,
        secret: process.env.REDIS_SECRET,
        resave: false,
        cookie: {
          maxAge,
        },
      });
    default:
      return session({
        secret: 'simple_test_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge,
          secure: false,
        },
      });
  }
};
