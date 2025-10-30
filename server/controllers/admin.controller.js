const generateAdminToken = require("../utils/generateAdminToken");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, "Email and password are required", 400);
  }
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = generateAdminToken();

    return successResponse(
      res,
      {
        token,
        user: {
          email: email,
          name: "Administrator",
          isAdmin: true,
        },
      },
      "Admin logged in successfully",
      200,
    );
  } else {
    return errorResponse(res, "Invalid admin credentials", 401);
  }
};
