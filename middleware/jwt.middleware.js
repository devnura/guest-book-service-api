const jwt = require("jsonwebtoken");
const helper = require("../helper/helper");

const generateRefreshToken = (req) => {
  let expiresIn = process.env.JWT_REFRESH_EXPIRATION ? process.env.JWT_REFRESH_EXPIRATION : "7d";
  let signOptions = {
    issuer: 'DEVNURA',
    expiresIn: expiresIn,
  }
  return jwt.sign(req, process.env.REFRESH_TOKEN_SECRET, signOptions);
};

const authenticateRefreshToken = (req, res, next) => {

  let { refresh_token } = req.headers

  if(!refresh_token){
    return res.json({
      code: "400",
      message: "Refresh Token is required !",
      data: {},
    });
  }

  let verifyOptions = {
    issuer: 'DEVNURA',
  }

  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, verifyOptions, (err, data) => {
    console.log(err)
    if (err) {
      return res.json({
        code: "400",
        message: "Refresh Token is invalid. Please login!",
        data: {},
      });
    }
    req.code = helper.decryptText(data.code)

    next();

  });
};

const generateAccessToken = (req) => {
  let expiresIn = process.env.JWT_EXPIRATION ? process.env.JWT_EXPIRATION : "1h";
  let signOptions = {
    issuer: 'DEVNURA',
    expiresIn: expiresIn,
  }
  return jwt.sign(req, process.env.TOKEN_SECRET, signOptions);
};

const authenticateToken = (req, res, next) => {
  let authHeader = req.headers["authorization"];
  let result
  if (authHeader) {
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      result = helper.createResponse(401, "BAD REQUEST", "Token is required.", []);
      return res.status(401).json(result);
    }

    let verifyOptions = {
      issuer: 'DEVNURA',
    }

    jwt.verify(token, process.env.TOKEN_SECRET, verifyOptions, (err, data) => {
      if (err) {
        result = helper.createResponse(402, "BAD REQUEST", "Token is invalid.", []);
        return res.status(402).json(result);
      }

      req.code =  helper.decryptText(data.code);
      req.group = helper.decryptText(data.group);
      req.name = helper.decryptText(data.name);

      next();
    });
  } else {
    result = helper.createResponse(401, "BAD REQUEST", "Token is required.", []);
    return res.status(401).json(result);
  }
};

module.exports = {
  generateRefreshToken,
  authenticateRefreshToken,
  generateAccessToken,
  authenticateToken,
};