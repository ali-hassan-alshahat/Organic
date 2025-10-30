const jwt = require("jsonwebtoken");

module.exports = () => {
  const tokenPayload = {
    email: process.env.ADMIN_EMAIL,
    isAdmin: true,
    role: "admin",
  };
  return jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
