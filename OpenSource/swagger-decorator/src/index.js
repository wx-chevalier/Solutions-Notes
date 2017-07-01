// @flow

import {
  apiRequestMapping as _apiRequestMapping,
  apiDescription as _apiDescription,
  bodyParameter as _bodyParameter,
  pathParameter as _pathParameter,
  queryParameter as _queryParameter,
  apiResponse as _apiResponse
} from "./swagger/decorator";
import { entityProperty as _entityProperty } from "./entity/decorator";
import { wrappingKoaRouter as _wrappingKoaRouter } from "./transform/koa_router";
import {
  generateSequelizeModel as _generateSequelizeModel
} from "./transform/sequelize";
import {
  innerAPIObject as _innerAPIObject,
  innerEntityObject as _innerEntityObject
} from "./singleton";

export const innerAPIObject = _innerAPIObject;
export const innerEntityObject = _innerEntityObject;

export const apiRequestMapping = _apiRequestMapping;
export const apiDescription = _apiDescription;
export const bodyParameter = _bodyParameter;
export const pathParameter = _pathParameter;
export const queryParameter = _queryParameter;
export const apiResponse = _apiResponse;

export const entityProperty = _entityProperty;

export const wrappingKoaRouter = _wrappingKoaRouter;

export const generateSequelizeModel = _generateSequelizeModel;
