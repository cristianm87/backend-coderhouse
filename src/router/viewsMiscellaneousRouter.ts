// IMPORTS
import express from 'express';
import vistaInfo from '../controllers/vistaInfoController';
import vistaRandoms from '../controllers/vistaNumerosRandomController';
import vistaTest from '../controllers/vistaTestController';
const viewMiscellaneousRouter = express.Router();
// PATHS
const pathVistaInfo = '/info';
const pathVistaRandom = '/random';
const pathVistaTest = '/test';

// ENDPOINT VISTA TEST (Faker)

viewMiscellaneousRouter.get(pathVistaTest, vistaTest);

// ENDPOINT VISTA INFO

viewMiscellaneousRouter.get(pathVistaInfo, vistaInfo);

// ENDPOINT NUMEROS RANDOM

viewMiscellaneousRouter.get(pathVistaRandom, vistaRandoms);

export default viewMiscellaneousRouter;
