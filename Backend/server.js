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

app.use(express.urlencoded({ extended: true }));

// Routes for user API

const authRoute =  require("./routes/authentication")

const dashboardRoute = require("./routes/dashboard");

const teamRoute = require("./routes/teams");

const trashRoute = require("./routes/trash")

const batchRoute = require("./routes/batch")

const scriptRoute = require("./routes/scripts")

const inviteRoute = require("./routes/invites")

const pageRoute = require("./routes/pages")

const publicRoute = require("./routes/publicUrl")

const userRoute = require("./routes/userInfo")

app.use("/",authRoute);

app.use("/",dashboardRoute);

app.use("/",teamRoute);

app.use("/",trashRoute);

app.use("/",batchRoute);

app.use("/",scriptRoute);

app.use("/",inviteRoute);

app.use("/",pageRoute);

app.use("/",publicRoute);

app.use("/",userRoute);
































app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

//listening to server connection

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => console.log(`Serpassportver running server on port ${PORT}`));

