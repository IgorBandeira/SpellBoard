import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import authApi from "../api/authApi";

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText("");
    setPasswordErrText("");
    setConfirmPasswordErrText("");

    const data = new FormData(e.target);
    const username = data.get("username").trim();
    const password = data.get("password").trim();
    const confirmPassword = data.get("confirmPassword").trim();

    let err = false;

    if (username === "") {
      err = true;
      setUsernameErrText("Preencha esse campo");
    }
    if (password === "") {
      err = true;
      setPasswordErrText("Preencha esse campo");
    }
    if (confirmPassword === "") {
      err = true;
      setConfirmPasswordErrText("Preencha esse campo");
    }
    if (password !== confirmPassword) {
      err = true;
      setConfirmPasswordErrText("As senhas não coincidem!");
    }

    if (err) return;

    setLoading(true);

    try {
      const res = await authApi.signup({
        username,
        password,
        confirmPassword,
      });
      setLoading(false);
      localStorage.setItem("token", res.token);
      navigate("/login");
    } catch (err) {
      const errors = err.data.errors;
      errors.forEach((e) => {
        if (e.param === "username") {
          setUsernameErrText(e.msg);
        }
        if (e.param === "password") {
          setPasswordErrText(e.msg);
        }
        if (e.param === "confirmPassword") {
          setConfirmPasswordErrText(e.msg);
        }
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Nome de usuário"
          name="username"
          disabled={loading}
          error={usernameErrText !== ""}
          helperText={usernameErrText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Senha"
          name="password"
          type={showPassword ? "text" : "password"}
          disabled={loading}
          error={passwordErrText !== ""}
          helperText={passwordErrText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          label="Confirmação de Senha"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          disabled={loading}
          error={confirmPasswordErrText !== ""}
          helperText={confirmPasswordErrText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Cadastrar
        </LoadingButton>
      </Box>
      <Button
        component={Link}
        to="/login"
        sx={{ textTransform: "none", marginBottom: "50px" }}
      >
        Possui conta? Entre
      </Button>
    </>
  );
};

export default Signup;
