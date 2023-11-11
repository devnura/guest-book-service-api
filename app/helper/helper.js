const {v4} = require('uuid');
const crypto = require("crypto")
const CryptoJS = require("crypto-js");
// ENCRYPT TEXT
const encryptText = (text) => {
  try {
    return CryptoJS.AES.encrypt(text, process.env.SECRET_KEY).toString();
  } catch (error) {
    console.log(error.message)
    return error.message;
  }
};

// DECRYPT TEXT
const decryptText = (cipherText) => {
  try {
    return CryptoJS.AES.decrypt(cipherText, process.env.SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
  } catch (error) {
    console.log(error.message)
    return error.message;
  }
};

// RANDOM UNIQUE CODE
function getUniqueCode() {
  return v4();
}

// DECRYPT TEXT
const getRandomStrig = () => {
  try {
    return crypto.randomBytes(4).toString('hex');
  } catch (error) {
    return error.message;
  }
};

const getDomainName = (req) => {
  var result = ""

  if(req.headers["x-forwarded-host"]){                                                                                                        // server
      result = 'https' + '://' + req.headers["x-forwarded-host"].split(',')[0]
  }else{                                                                                                                                      // local
      result = req.protocol + '://' + req.headers.host
  }

  return result
}

const createResponse = (code, status, errors, data) => {
  let error
  if(process.env.NODE_ENV == "production") {
    if (code >= 500) {
      error = [{msg : "Internal server error"}]
    }else {
      error = Array.isArray(errors) ? errors : [{msg : errors}]
    }
  }else {
    error = Array.isArray(errors) ? errors : [{msg : errors}]
  }

  return {
    code: parseInt(code),
    status: status,
    errors: error,
    data: Array.isArray(data) ? data : [data],
  }
}

module.exports = {
  encryptText,
  decryptText,
  getUniqueCode,
  getRandomStrig,
  getDomainName,
  createResponse
};