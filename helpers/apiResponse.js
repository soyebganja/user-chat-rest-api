"use strict";

exports.successResponse = (res, msg) => {
	return res.status(200).json({
		status: 1,
		message: msg
	});
};

exports.successResponseWithData = (res, msg, data) => {
	return res.status(200).json({
		status: 1,
		message: msg,
		data: data
	});
};

exports.ErrorResponse = (res, msg) => {
	return res.status(500).json({
		status: 0,
		message: process.env.NODE_ENV == "production" ? "Internal Server Error" : msg,
	});
};

exports.notFoundResponse = (res, msg) => {
	return res.status(404).json({
		status: 0,
		message: msg,
	});
};

exports.validationErrorWithData = (res, msg, data) => {
	return res.status(400).json({
		status: 0,
		message: msg,
		data: data
	});
};

exports.unauthorizedResponse = (res, msg) => {
	return res.status(401).json({
		status: 0,
		message: msg,
	});
};