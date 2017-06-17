// @flow

import {
  apiRequestMapping as _apiRequestMapping,
  apiDescription as _apiDescription,
  bodyParameter as _bodyParameter,
  pathParameter as _pathParameter,
  queryParameter as _queryParameter,
  apiResponse as _apiResponse
} from "./decorator/api_decorator";
import {
  entityProperty as _entityProperty
} from "./decorator/entity_decorators";
import {
  wrappingKoaRouter as _wrappingKoaRouter
} from "./decorator/router_wrapper";

export const apiRequestMapping = _apiRequestMapping;
export const apiDescription = _apiDescription;
export const bodyParameter = _bodyParameter;
export const pathParameter = _pathParameter;
export const queryParameter = _queryParameter;
export const apiResponse = _apiResponse;

export const entityProperty = _entityProperty;

export const wrappingKoaRouter = _wrappingKoaRouter;
