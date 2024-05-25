import { Container, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { toggleTheme } from "../../redux/features/themeSlice";
import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";

const AuthLayout = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:700x)");
  const [loading, setLoading] = useState(true);
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated();
      if (!isAuth) {
        setLoading(false);
      } else {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? (
        <Loading fullHeight />
      ) : (
        <>
          <Container
            component="main"
            maxWidth="xs"
            sx={{ position: "relative" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img
                src={theme.images.logo}
                style={{ height: "300px", padding: "0", margin: "0" }}
                alt="app logo"
              />
              <Outlet />
            </Box>
          </Container>
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
            }}
          >
            <AutoFixHighIcon
              sx={{
                cursor: "pointer",
                fontSize: isMobile ? 50 : 35,
              }}
              onClick={() => dispatch(toggleTheme())}
            />{" "}
          </Box>
        </>
      )}
    </ThemeProvider>
  );
};

export default AuthLayout;
