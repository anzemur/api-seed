import { ObjectId } from 'bson';

/**
 * Checks if given email string is valid email.
 * @param email Email string.
 */
export function isEmail(email: string): boolean {
  const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return regexp.test(email);
}

/**
 * Checks if request body is empty.
 * @param body Request body.
 */
export function isRequestBodyEmpty(body: any): boolean {
  return (body.constructor === Object && Object.keys(body).length === 0);
}

/**
 * Checks if given JSON string can be parsed into JS object.
 * @param jsonString JSON string to check.
 */
export function isJsonString(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * Checks if given valid is valid MongoDB ObjectId.
 * @param value string | number | ObjectId.
 */
export function isObjectId(value: any): boolean {
  return ObjectId.isValid(value);
}
