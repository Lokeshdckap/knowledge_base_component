const express = require("express");

const cors = require("cors");

const app = express();

require("dotenv").config();

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const passport = require("passport");

const session = require("express-session");

app.use(
  session({ secret: "lokesh123", resave: true, saveUninitialized: true })
);

app.use(passport.initialize());
app.use(passport.session());

// Middlewares
const path = require("path");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const whitelist = ['http://localhost:3000', 'http://127.0.0.1:3001']; // Add your allowed origins
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, // enable set cookie
};

app.use(cors(corsOptions));


// Routes for user API

const apiBasePath = "/api"; 

const authRoute = require("./routes/authentication");
const dashboardRoute = require("./routes/dashboard");
const teamRoute = require("./routes/teams");
const trashRoute = require("./routes/trash");
const batchRoute = require("./routes/batch");
const scriptRoute = require("./routes/scripts");
const inviteRoute = require("./routes/invites");
const pageRoute = require("./routes/pages");
const publicRoute = require("./routes/publicUrl");
const userRoute = require("./routes/userInfo");
const tagRoute = require("./routes/tags");

app.use(`${apiBasePath}/auth`, authRoute);
app.use(`${apiBasePath}/dashboard`, dashboardRoute);
app.use(`${apiBasePath}/teams`, teamRoute);
app.use(`${apiBasePath}/trash`, trashRoute);
app.use(`${apiBasePath}/batch`, batchRoute);
app.use(`${apiBasePath}/scripts`, scriptRoute);
app.use(`${apiBasePath}/invites`, inviteRoute);
app.use(`${apiBasePath}/pages`, pageRoute);
app.use(`${apiBasePath}/public`, publicRoute);
app.use(`${apiBasePath}/user`, userRoute);
app.use(`${apiBasePath}/tags`, tagRoute);


app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

//listening to server connection

app.use("/uploads", express.static("uploads"));





app.listen(PORT, () =>
  console.log(`Serpassportver running server on port ${PORT}`)
);
