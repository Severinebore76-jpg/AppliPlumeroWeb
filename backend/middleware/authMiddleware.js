import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    const auth = req.headers.authorization;

    if (auth && auth.startsWith("Bearer ")) token = auth.split(" ")[1];

    if (!token) {
      const err = new Error(ERROR_MESSAGES.TOKEN_MISSING);
      err.statusCode = STATUS_CODES.UNAUTHORIZED;
      throw err;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      const err = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      err.statusCode = STATUS_CODES.UNAUTHORIZED;
      throw err;
    }

    req.user = user;
    next();
  } catch (err) {
    err.statusCode = err.statusCode || STATUS_CODES.UNAUTHORIZED;
    next(err);
  }
};

export const requireRole =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const err = new Error(ERROR_MESSAGES.UNAUTHORIZED);
      err.statusCode = STATUS_CODES.FORBIDDEN;
      throw err;
    }
    next();
  };
