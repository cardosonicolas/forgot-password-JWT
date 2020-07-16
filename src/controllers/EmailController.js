const jwt = require("jwt");
const bcrypt = require("bcryptjs");
import { User } from "../database/User";
import {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate,
} from "../modules/email";

// `secret` es una passwordHash concatenado con el usuario
// createdAt value, por lo que si alguien malicioso obtiene el
// token todavía necesitan una marca de tiempo para hackearlo:
export const usePasswordHashToMakeToken = ({
  password: passwordHash,
  _id: userId,
  createdAt,
}) => {
  // highlight-start
  const secret = `${passwordHash}-${createdAt}`;
  const token = jwt.sign({ userId }, secret, {
    expiresIn: 300, // 1 hour
  });
  // highlight-end
  return token;
};
