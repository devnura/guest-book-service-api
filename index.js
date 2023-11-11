require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const winston = require("./app/helper/winston.logger");

// models
var models = require("./app/models");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

//Sync Database
models.sequelize.sync().then(function() {
  console.log('connected to database')
}).catch(function(err) {
  console.log(err)
});

// ============================== ROUTES API ==============================
const authRoute = require("./app/routes/auth.routes");
const guestbookRoute = require("./app/routes/guestbook.routes");

//route v1
app.use('/api/v1/', router);

app.get("/", (req, res) => {
  res.json({
    message: `Welcome to ${process.env.APP_NAME.toUpperCase()}.`,
  });
});

router.use("/auth", authRoute);
router.use("/guestbook", guestbookRoute);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  winston.logger.info(`Server is running on environment: ${process.env.NODE_ENV.toUpperCase()}`);
});