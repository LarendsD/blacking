export const validationParser = (errs: any) => {
  const req = {};
  errs.message.forEach((err) => {
    const [property, message] = err.split(':');
    if (!req[property]) {
      req[property] = [];
    }
    req[property].push(message);
  });
  return req;
};
