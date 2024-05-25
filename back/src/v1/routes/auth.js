const router = require("express").Router();
const userController = require("../controllers/user");
const { body } = require("express-validator");
const validation = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const User = require("../models/user");

router.post(
  "/signup",
  body("username")
    .isLength({ min: 3 })
    .withMessage("Usuário precisa conter pelo menos 3 caracteres"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Senha precisa conter pelo menos 8 caracteres"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("As senhas não coincidem");
    }
    return true;
  }),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("Nome de usuário já está em uso!");
      }
    });
  }),
  validation.validate,
  userController.register
);

router.post(
  "/login",
  body("username")
    .isLength({ min: 3 })
    .withMessage("Usuário precisa conter pelo menos 3 caracteres"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Senha precisa conter pelo menos 8 caracteres"),
  validation.validate,
  userController.login
);

router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
