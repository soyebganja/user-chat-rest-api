"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserMessageSchema = new Schema({
	message: { type: String, required: true },
	username: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("UserMessage", UserMessageSchema);