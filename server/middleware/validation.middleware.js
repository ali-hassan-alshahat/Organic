// server/middleware/validation.middleware.js
const { z } = require("zod");

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors
          ? error.errors.map((err) => ({
              field: err.path ? err.path.join(".") : "unknown",
              message: err.message || "Validation error",
            }))
          : [];
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors,
        });
      }
      console.error("Validation middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Validation error",
      });
    }
  };
};

module.exports = { validateRequest };
