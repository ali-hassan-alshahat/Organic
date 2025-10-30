const jwt = require("jsonwebtoken");

module.exports = async (payload) => {
  const tokenPayload = {
    id: payload.id,
    email: payload.email,
  };
  const token = await jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};
