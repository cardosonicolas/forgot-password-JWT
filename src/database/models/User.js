const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");
const bcrypt = require("bcryptjs");

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: {
        args: true,
        msg: "El Email ya esta en uso",
      },
      validate: {
        notNull: {
          msg: "No puede contener valores nulos",
        },
        isEmail: {
          args: true,
          msg: "El campo tiene que ser un correo valido",
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(valor) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(valor, salt);
        this.setDataValue("password", hash);
      },
    },
  },
  {
    sequelize,
    modelName: "users",
  }
);

module.exports = User;
