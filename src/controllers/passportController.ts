import bcrypt from 'bcrypt';
import passportLocal from 'passport-local';
import passport from 'passport';
import { modelLogin } from '../models/modelLogin';
import { etherealTransporterInit } from './emailingAndMessagingController';
////////// PASSPORT DBAAS ////////////

const createHash = (password: string) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (
  user: { password: string },
  password: string | Buffer
) => bcrypt.compareSync(password, user.password);

export const loginStrategyName = 'login';
export const signUpStrategyName = 'signup';

passport.use(
  loginStrategyName,
  new passportLocal.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (_request, username, password, done) => {
      modelLogin.findOne(
        {
          email: username,
        },
        (error: any, user: { password: string }) => {
          if (error) {
            return done(error);
          }

          if (!user) {
            console.log(`User Not Found with username ${username}`);

            return done(null, false);
          }

          if (!isValidPassword(user, password)) {
            console.log('Invalid Password');

            return done(null, false);
          }
          return done(null, user);
        }
      );
    }
  )
);

passport.use(
  signUpStrategyName,
  new passportLocal.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (request, username, password, done) => {
      modelLogin.findOne(
        {
          email: username,
        },
        (error: any, user: any) => {
          if (error) {
            console.log(`Error in SignUp: ${error}`);

            return done(error);
          }

          if (user) {
            console.log('User already exists');

            return done(null, false);
          }

          const newUser: any = new modelLogin();
          newUser.email = username;
          newUser.password = createHash(password);
          newUser.nombre = request.body.nombre;
          newUser.direccion = request.body.direccion;
          newUser.edad = request.body.edad;
          newUser.telefono = request.body.telefono;
          newUser.avatar = request.body.avatar;

          return newUser.save((error: any) => {
            if (error) {
              console.log(`Error in Saving user: ${error}`);

              throw error;
            }
            //etherealTransporterInit('New Signup', newUser);
            console.log('User Registration succesful');

            return done(null, newUser);
          });
        }
      );
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  modelLogin.findById(
    id,
    (error: any, user: boolean | Express.User | null | undefined) =>
      done(error, user)
  );
});

export default { loginStrategyName, signUpStrategyName };
