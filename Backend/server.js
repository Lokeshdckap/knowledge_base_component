const express = require("express");

const app = express();

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

//listening to server connection

app.listen(PORT, () => console.log(`Serpassportver running on port ${PORT}`));
