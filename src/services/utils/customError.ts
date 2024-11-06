
export function createCustomError(message: string, status: number) {
  const error = new Error(message);
  error.status = status;
  return error;
}

