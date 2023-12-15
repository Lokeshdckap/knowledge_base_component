const express = require("express");

const cors = require("cors");

const app = express();

require("dotenv").config();

const passport = require("passport");

const session = require("express-session");

app.use(
  session({ secret: "lokesh123", resave: true, saveUninitialized: true })
);

app.use(passport.initialize());
app.use(passport.session());

// Middlewares

const path = require("path");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const { googleLogin } = require("./controllers/Authentication/googleLogin");
googleLogin();

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

app.set("views", path.join(__dirname, "views"));

//listening to server connection

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Serpassportver running server on port ${PORT}`)
);
