const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("NO TOKEN PROVIDED");
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN VALID");
    console.log(decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("TOKEN INVALID");
    console.log(error.message);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;