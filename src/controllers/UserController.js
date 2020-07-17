const userCtrl = {};

userCtrl.renderLogin = (req, res) => {
  res.render("login");
};

userCtrl.renderForgot = (req, res) => {
  res.render("recoverPassword");
};

userCtrl.renderNewpassword = (req, res) => {
  const { id, token } = req.params;
  res.render("newPassword", { id, token });
};
module.exports = userCtrl;
