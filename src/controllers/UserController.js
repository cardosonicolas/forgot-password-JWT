const userCtrl = {};
const User = require("../database/models/User");

userCtrl.renderRegister = (req, res) => {
  res.render("index");
};

module.exports = userCtrl;
