"use strict";

const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
	const decoded = jwt.verify(req.headers["authorization"].split(" ")[1], process.env.JWT_SECRET);
	req.headers["userContext"] = decoded["userContext"];
	next();
};

module.exports = authenticate;