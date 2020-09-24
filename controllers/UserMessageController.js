"use strict";

const UserMessage = require("../models/UserMessageModel");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);


/**
 * UserMessage store.
 * 
 * @param {string}      message
 * 
 * @returns {Object}
 */
exports.userMessageStore = [
	auth,
	body("message", "Message must not be empty.").isLength({ min: 1 }).trim(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}

			const userMessage = new UserMessage({
				message: req.body.message,
				username: req.headers["userContext"]["username"]
			});

			//Save UserMessage.
			userMessage.save((err) => {
				if (err) throw err;
				// const userMessageData = new BookData(userMessage);
				return apiResponse.successResponse(res, "UserMessage add Success.");
			});

		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * UserMessage List.
 * 
 * @returns {Array}
 */
exports.userMessageList = [
	(req, res) => {
		try {
			UserMessage.find({}, "_id message username createdAt").then((books) => {
				if (books.length > 0) {
					return apiResponse.successResponseWithData(res, "Operation success", books);
				} else {
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];