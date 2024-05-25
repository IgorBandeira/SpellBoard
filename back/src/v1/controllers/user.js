const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jsonwebtoken = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { password, username } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        errors: [
          {
            param: "username",
            msg: "Nome de usuário já está em uso!",
          },
        ],
      });
    }

    req.body.password = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET_KEY
    ).toString();

    const user = await User.create(req.body);

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select("password username");
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: "username",
            msg: "Usuário inválido",
          },
        ],
      });
    }

    const decryptedPass = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPass !== password) {
      return res.status(401).json({
        errors: [
          {
            param: "password",
            msg: "Senha inválida",
          },
        ],
      });
    }

    user.password = undefined;

    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
