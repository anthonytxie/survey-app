const express = require("express");
const passport = require("passport");
const authRouter = express();
const { requireLogin } = require("../middlewares/requireLogin.js");

authRouter.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"]
	})
);

authRouter.get(
	"/auth/google/callback",
	passport.authenticate("google"),
	(req, res) => {
		res.redirect("/surveys");
	}
);

authRouter.get("/api/current_user", (req, res) => {
	res.send(req.user);
});

authRouter.get("/api/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

module.exports = authRouter;
