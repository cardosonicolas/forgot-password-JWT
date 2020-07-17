const emailController = {};
const jwt = require("jsonwebtoken");
const User = require("../database/models/User");
const {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate,
} = require("../modules/email");

/* "secret" es una passwordHash concatenado con el createdAt, por lo que si alguien malicioso obtiene el
token todavía necesitan una marca de tiempo para hackearlo:*/
const usePasswordHashToMakeToken = ({ password, id, createdAt }) => {
  const secret = `${password}-${createdAt}`;
  const token = jwt.sign({ id }, secret, {
    expiresIn: 3600, // 1 hora
  });
  return token;
};

//Enviando el correo electrónico
emailController.sendPasswordResetEmail = async (req, res) => {
  let user = {};
  const { email } = req.body;

  User.findOne({ where: { email: email } })
    .then((user) => {
      const token = usePasswordHashToMakeToken(user);
      const url = getPasswordResetURL(user, token);
      const emailTemplate = resetPasswordTemplate(user, url);

      transporter.sendMail(emailTemplate, (err, info) => {
        if (err) {
          console.log(err);
          res.status(500).json("Error al enviar el email");
        } else {
          console.log(`Email enviado`);
        }
      });
    })
    .catch(() => {
      res.status(404).json("No hay un usuario con este email");
    });
};

//Actualización de la contraseña del usuario
emailController.receiveNewPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  User.findOne({ where: { id: id } })
    .then((user) => {
      const secret = `${user.password}-${user.createdAt}`;
      const payload = jwt.decode(token, secret);
      if (payload.id === user.id) {
        User.update({ password: password }, { where: { id: id } })
          .then(() => res.status(202).json("Password actualizada"))
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch(() => {
      res.status(404).json("Usuario no valido");
    });
};

module.exports = emailController;
