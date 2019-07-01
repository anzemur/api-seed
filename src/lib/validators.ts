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
