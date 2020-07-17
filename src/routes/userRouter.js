const express = require("express");
const router = express.Router();
const user = require("../controllers/UserController");

router.get("/login", user.renderLogin);

router.get("/forgot", user.renderForgot);

router.get("/password/reset/:id/:token", user.renderNewpassword);

module.exports = router;
