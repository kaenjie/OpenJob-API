import { sendResponse } from "../utils/response.js";

const validateMiddleware = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true 
  });
  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    return sendResponse(res, {
      status: "failed",
      statusCode: 400,
      message,
    });
  }
  // Update req.body with validated and stripped value
  req.body = value;
  next();
};

export default validateMiddleware;
