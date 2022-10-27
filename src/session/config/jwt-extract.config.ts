import { ExtractJwt } from 'passport-jwt';
import { sessionExtractor } from '../extractor/session.extractor';
import { jwtConstants } from '../constants';

export default () => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret,
      };
    default:
      return {
        jwtFromRequest: sessionExtractor,
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret,
      };
  }
};
