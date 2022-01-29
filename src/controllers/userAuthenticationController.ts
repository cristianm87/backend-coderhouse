import { etherealTransporterInit } from './emailingAndMessagingController';

const pathMain = '/';

export const signUpController = (request: any, response: any) => {
  if (request.user == undefined) {
    response.render('signup');
  } else {
    response.redirect(pathMain);
  }
};

export const signUpError = (request: any, response: any) => {
  response.render('user-error-signup');
};

export const logInController = (request: any, response: any) => {
  if (request.user == undefined) {
    response.render('login');
  } else {
    response.redirect(pathMain);
  }
};

export const logInErrorController = (request: any, response: any) => {
  response.render('user-error-login');
};

export const logOutController = (request: any, response: any) => {
  const userData: any = request.user;
  request.session.destroy(function (err: any) {
    etherealTransporterInit('logout', userData.email);
    response.render('logout', { nombre: userData.nombre });
  });
};

export default {
  signUpController,
  logInController,
  logInErrorController,
  logOutController,
};
