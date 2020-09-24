"use strict";

const express = require("express");
const authRouter = require("./auth");
const userMessageRouter = require("./userMessage");

const app = express();

app.use("/auth/", authRouter);
app.use("/userMessage/", userMessageRouter);

module.exports = app;