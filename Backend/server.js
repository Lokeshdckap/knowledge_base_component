const express = require("express");

const app = express();
const multer = require('multer');
const cors = require("cors");

const fs = require("fs");

require("dotenv").config();

const corsOptions = require("./config/corsOptions");

const PORT = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");

const passport = require("passport");

const session = require("express-session");

const { google } = require("./controllers/Authentication/googleLogin");
google();

//Third party middleware
app.use(cors());

app.use(
  session({ secret: "lokesh123", resave: true, saveUninitialized: true })
);

app.use(passport.initialize());

app.use(passport.session());

// Middlewares
const path = require("path");
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Routes for user API

app.use("/", require("./routes/authentication"));

app.use("/", require("./routes/dashboard"));

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

//listening to server connection

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});


const upload = multer({ storage });


app.listen(PORT, () => console.log(`Serpassportver running server on port ${PORT}`));
