require("dotenv").config();
require("./services/passport");
const bodyParser = require("body-parser");
const passport = require("passport");
const express = require("express");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/authRoutes");
const basicRouter = require("./routes/basicRoutes");
const billingRouter = require("./routes/billingRoutes");
const mongoose = require("mongoose");
require("./services/passport");

const app = express();

//Middleware
app.use(
	cookieSession({
		maxAge: 60 * 60 * 1000,
		keys: [process.env.cookieSecret]
	})
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);
app.use(basicRouter);
app.use(billingRouter);
if (process.env.NODE_ENV === "production") {
	//express will serve up production assets
	app.use(express.static("client/build"));
	// Express will serve up index.html if it doesn't recognize the route
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

module.exports = app;
