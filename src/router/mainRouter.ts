import express from 'express';
export const mainRouter = express.Router();
import passport from 'passport';
import {
  loginStrategyName,
  signUpStrategyName,
} from '../controllers/passportController';
import {
  logInController,
  logInErrorController,
  logOutController,
  signUpController,
  signUpError,
} from '../controllers/userAuthenticationController';
import {
  mainFilterByNameController,
  mainFilterByPriceController,
  vistaMain,
} from '../controllers/vistaMainController';

const pathLogin = '/login';
const pathLogout = '/logout';
const pathSignUp = '/signup';
const pathSignUpError = '/failsignup';
const pathLoginError = '/faillogin';

const pathBuscarNombre = '/filtrar-nombre';
const pathBuscarPrecio = '/filtrar-precio';

const pathMain = '/';
// ENDPOINTS USER AUTHENTICATION

//signup

mainRouter.get(pathSignUp, signUpController);

mainRouter.post(
  pathSignUp,
  passport.authenticate(signUpStrategyName, {
    failureRedirect: '/failsignup',
  }),
  (_request: any, response: any) => {
    return response.redirect(pathMain);
  }
);

mainRouter.get(pathSignUpError, signUpError);

//login

mainRouter.get(pathLogin, logInController);

mainRouter.post(
  pathLogin,
  passport.authenticate(loginStrategyName, {
    failureRedirect: '/faillogin',
  }),
  (_request: any, response: any) => {
    return response.redirect(pathMain);
  }
);

mainRouter.get(pathLoginError, logInErrorController);

mainRouter.get(pathLogout, logOutController);

// ENDPOINTS MAIN

mainRouter.post(pathBuscarNombre, mainFilterByNameController);

mainRouter.post(pathBuscarPrecio, mainFilterByPriceController);

mainRouter.get(pathMain, vistaMain);

export default mainRouter;
