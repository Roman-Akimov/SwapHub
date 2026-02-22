import { type Express } from 'express';
import { Passport } from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { type AppContext } from './ctx';
import { env } from './env';

export const applyPassportToExpressApp = (expressApp: Express, ctx: AppContext): void => {
  const passport = new Passport();

  passport.use(
    new JWTStrategy(
      {
        secretOrKey: env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      },
      (jwtPayload: { userId: string }, done) => {
        ctx.prisma.user
          .findUnique({
            where: { id: jwtPayload.userId },
          })
          .then((user) => {
            if (!user) {
              done(null, false);
              return;
            }
            done(null, user);
          })
          .catch((error) => {
            done(error, false);
          });
      }
    )
  );

  expressApp.use(passport.initialize());

  expressApp.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      passport.authenticate('jwt', { session: false }, (err: any, user: Express.User | undefined) => {
        if (user) {
          req.user = user;
        }
        next();
      })(req, res, next);
    } else {
      next();
    }
  });
};
