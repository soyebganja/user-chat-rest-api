"use strict";

const express = require("express");
const UserMessageController = require("../controllers/UserMessageController");

const router = express.Router();

router.post("/", UserMessageController.userMessageStore);
router.get("/", UserMessageController.userMessageList);

module.exports = router;