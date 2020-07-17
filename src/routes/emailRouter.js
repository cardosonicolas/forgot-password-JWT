const express = require("express");
const router = express.Router();
const email = require("../controllers/EmailController");

router.post("/user/:email", email.sendPasswordResetEmail);

router.post("/receive_new_password/:id/:token", email.receiveNewPassword);

module.exports = router;
