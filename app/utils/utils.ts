/**
 * Utils
 */

export const notMyAction = (expectedTypes, actualType) =>
  !Object.values(expectedTypes).includes(actualType);
