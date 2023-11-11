const jwt = require("../../middleware/jwt.middleware");
const bcrypt = require("bcrypt");
const helper = require("../../helper/helper");
const winston = require("../../helper/winston.logger");
const moment = require("moment");
moment.locale("id");
const {
  User,
  RefreshToken,
  // 
} = require("../../models");
var result = {};
var uniqueCode;

// LOGIN USER
const loginUser = async (req, res) => {
  try {

    // generate unique code
    uniqueCode = req.requestId;

    let {
      email,
      password
    } = req.body;

    let refreshToken = ""
    let accessToken = ""

    // log debug
    winston.logger.debug(`${uniqueCode} checking data login...`);

    // check data login
    // let checkUser = await user.checkUser(email);
    let checkUser = await User.findOne({where : { email : email}});
    if (!checkUser) {

      result = helper.createResponse(403, "UNAUTHORIZED", ["Invalid email or password"], []);

      // log warn
      winston.logger.info(
        `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
      );

      return res.status(401).json(result);
    }

    // log debug
    winston.logger.debug(`${uniqueCode} checking password...`);
    // check password
    let checkPassword = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!checkPassword) {

      result = helper.createResponse(403, "UNAUTHORIZED", "Invalid email or password", []);

      // log warn
      winston.logger.info(
        `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
      );

      return res.status(401).json(result);
    }

    winston.logger.debug(`${req.requestId} ${req.requestUrl} generating access token...`);

    accessToken = jwt.generateAccessToken({
      code:  helper.encryptText(checkUser.uid),
      group:  helper.encryptText(checkUser.level),
      name:  helper.encryptText(checkUser.name),
    });

    // cek apakah user sudah melakukan login atau belum
    let checkUserLogin = await RefreshToken.findOne({whete:{ user_id : checkUser.uid}})
    if (!checkUserLogin) {
    
      // log debug
      winston.logger.debug(`${req.requestId} ${req.requestUrl} generating refresh token...`);

      // generate refresh token
      refreshToken = jwt.generateRefreshToken({
        code: helper.encryptText(checkUser.uid),
      });

      // log debug
      winston.logger.debug(`${req.requestId} ${req.requestUrl} inserting refresh token...`);

      await RefreshToken.create({user_id : checkUser.uid, token: refreshToken})

    }else {
      refreshToken = checkUserLogin.token

    }

    let data = {
      name: checkUser.name,
      email: checkUser.email,
      level: checkUser.level,
      access_token: accessToken,
      refresh_token: refreshToken,
    }

    result = helper.createResponse(200, "OK", [], data);
   
    // log info
    winston.logger.info(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(200).json(result);
  } catch (error) {
    // create log
    result = helper.createResponse(500, "Internal Server Error", error.message, []);

    winston.logger.error(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(500).json(result);
  }
};

const refreshToken = async (req, res) => {
  try {

    // generate unique code
    uniqueCode = req.requestId;

    const code = req.code;

    let { refresh_token } = req.headers;

    // log debug
    winston.logger.debug(`${uniqueCode} ${req.requestUrl} authenticating refresh token...`);

    // verify
    jwt.authenticateRefreshToken;

    // log debug
    winston.logger.debug(`${uniqueCode} ${req.requestUrl} checking refresh token... `);

    let checkRefreshToken = await RefreshToken.findOne({where: {user_id : code, token : refresh_token}});

    if (!checkRefreshToken) {
      result = helper.createResponse(401, "Unauthorized", "Refresh Token is invalid.", [code]);

      // log warn
      winston.logger.warn(
        `${uniqueCode} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
      );

      return res.status(401).json(result);
    }

    // log debug
    winston.logger.debug(`${uniqueCode} ${req.requestUrl} generating access token...`);

    let accessToken;
    let refreshToken;

    // check data login
    let checkDataLoginUser = await User.findOne({where : { uid : code}});
    if (!checkDataLoginUser) {
      result = helper.createResponse(402, "Unauthorized", "Refresh Token is invalid.", []);

      // log warn
      winston.logger.warn(
        `${uniqueCode} ${req.requestUrl}RESPONSE : ${JSON.stringify(result)}`
      );

      return res.status(401).json(result);
    }

    // generate new access token
    accessToken = jwt.generateAccessToken({
      code:  helper.encryptText(checkDataLoginUser.uid),
      group:  helper.encryptText(checkDataLoginUser.level),
      name:  helper.encryptText(checkDataLoginUser.name),
    });

    // log debug
    winston.logger.debug(`${uniqueCode} ${req.requestUrl} generating refresh token...`);

    // generate new refresh token
    refreshToken = jwt.generateRefreshToken({
      code: checkDataLoginUser.uid
    });

    // log debug
    winston.logger.debug(`${uniqueCode} ${req.requestUrl} updating refresh token...`);

    // update insert refresh token
    await RefreshToken.update({
      token : refreshToken
     },{
      where :{
        user_id : code
      }
     })

    const data = {
      access_token: accessToken,
      refresh_token: refreshToken,
    }

    result = helper.createResponse(200, "OK", [], data);

    // log info
    winston.logger.info(
      `${uniqueCode} ${req.requestUrl} RESPONSE refresh token: ${JSON.stringify(result)}`
    );

    return res.status(200).json(result);
  } catch (error) {
    // create log
    result = helper.createResponse(500, "Internal Server Error", error.message, []);

    winston.logger.error(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );
    
    return res.status(500).json(result);
  }
};

// LOGOUT
const logoutUser = async (req, res) => {
  try {
    // generate unique code
    uniqueCode = helper.getUniqueCode()

    const code = req.code;

    const deleteRefreshToken = await RefreshToken.destroy({
      where: {
        user_id: code,
      }})

    if (deleteRefreshToken < 1) {
      result = helper.createResponse(401, "Unauthorized", "Invalid session", []);

      // log warn
      winston.logger.info(
        `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
      );

      return res.status(401).json(result);

    }


    result = helper.createResponse(200, "OK", [], []);

    winston.logger.info(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(200).json(result);

  } catch (error) {
    // create log
    result = helper.createResponse(500, "Internal Server Error", error.message, []);

    winston.logger.error(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );
    
    return res.status(500).json(result);
  }
}

module.exports = {
  loginUser,
  refreshToken,
  logoutUser
};