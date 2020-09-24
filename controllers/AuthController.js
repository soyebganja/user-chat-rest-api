"use strict";

const UserModel = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      username
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
	// Validate fields.
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
		.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
	body("username").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.custom((value) => {
			return UserModel.findOne({ username: value }).then((user) => {
				if (user) {
					return Promise.reject("Username already in use");
				}
			});
		}),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}

			//hash input password
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) throw err;

				// Create User object with escaped and trimmed data
				const user = new UserModel({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					username: req.body.username,
					password: hash
				});

				// Save user.
				user.save((err) => {
					if (err) throw err;
					let userData = {
						_id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
						username: user.username
					};
					return apiResponse.successResponseWithData(res, "Registration Success.", userData);
				});
			});

		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * User login.
 *
 * @param {string}      username
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	body("username").isLength({ min: 1 }).trim().withMessage("Username must be specified."),
	body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}

			UserModel.findOne({ username: req.body.username }).then(user => {
				if (user) {
					//Compare given password with db"s hash.
					bcrypt.compare(req.body.password, user.password, (err, same) => {
						if (same) {

							// Check User"s account active or not.
							if (user.status) {
								const userData = {
									userContext: {
										_id: user._id,
										firstName: user.firstName,
										lastName: user.lastName,
										username: user.username
									}
								};

								//Prepare JWT token for authentication
								const jwtPayload = userData;
								const jwtData = {
									expiresIn: process.env.JWT_TIMEOUT_DURATION
								};
								const secret = process.env.JWT_SECRET;
								//Generated JWT token with Payload and secret.
								userData.token = jwt.sign(jwtPayload, secret, jwtData);
								return apiResponse.successResponseWithData(res, "Login Success.", userData);
							} else {
								return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
							}
						} else {
							return apiResponse.unauthorizedResponse(res, "Username or Password wrong.");
						}
					});
				} else {
					return apiResponse.unauthorizedResponse(res, "Username or Password wrong.");
				}
			});

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];