export const isObject = (value: any): value is object => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof RegExp) &&
    !(value instanceof Date) &&
    !(value instanceof Set) &&
    !(value instanceof Map)
  );
};

export const catchError = async <ResponseType, ErrorType = Error>(
  promise: Promise<ResponseType>
): Promise<[ErrorType, null] | [null, ResponseType]> => {
  try {
    return [null, await promise];
  } catch (error) {
    return [error as ErrorType, null];
  }
};
