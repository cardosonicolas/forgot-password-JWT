const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../database/models/User");
import {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate,
} from "../modules/email";

/* `secret` es una passwordHash concatenado con el usuario
createdAt value, por lo que si alguien malicioso obtiene el
token todavía necesitan una marca de tiempo para hackearlo:*/
export const usePasswordHashToMakeToken = ({ password, id, createdAt }) => {
  // highlight-start
  const secret = `${password}-${createdAt}`;
  const token = jwt.sign({ id }, secret, {
    expiresIn: 300, // 1 hour
  });
  // highlight-end
  return token;
};

//Enviando el correo electrónico
export const sendPasswordResetEmail = async (req, res) => {
  const user = {};
  const { email } = req.body;
  try {
    user = await User.findOne({ where: { email: email } });
  } catch (err) {
    res.status(404).json("No hay un usuario con este email");
  }

  const token = usePasswordHashToMakeToken(user);
  const url = getPasswordResetURL(user, token);
  const emailTemplate = resetPasswordTemplate(user, url);

  export const sendEmail = () => {
    transporter.sendMail(emailTemplate, (err, info) => {
      if (err) {
        res.status(500).json("Error al enviar el email");
      }
      console.log(`Email enviado`, info.response);
    });
  };
  sendEmail();
};

//Actualización de la contraseña del usuario
export const receiveNewPassword = async (req, res) => {
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
