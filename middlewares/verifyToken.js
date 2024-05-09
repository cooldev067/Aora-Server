const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userData = decoded;
    next();
  });
};

module.exports = verifyToken;
