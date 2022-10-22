export const sessionExtractor = (req) => {
  let token = null;
  if (req && req.session) {
    token = req.session.token;
  }
  return token;
};
