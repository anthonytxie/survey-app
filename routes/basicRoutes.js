const express = require("express");
const passport = require("passport");
const basicRouter = express();

basicRouter.get("/", (req, res) => {
	res.send("hello");
});

module.exports = basicRouter;
