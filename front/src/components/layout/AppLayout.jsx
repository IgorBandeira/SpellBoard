import { Box } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import Sidebar from "../common/Sidebar";
import { setUser } from "../../redux/features/userSlice";
import { toggleTheme } from "../../redux/features/themeSlice";
import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:700x)");
  const [loading, setLoading] = useState(true);
  const theme = useSelector((state) => state.theme.value);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated();
      if (!user) {
        navigate("/login");
      } else {
        dispatch(setUser(user));
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? (
        <Loading fullHeight />
      ) : (
        <>
          <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, p: 1, width: "max-content" }}>
              <Outlet />
            </Box>
          </Box>
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
            />
          </Box>
        </>
      )}
    </ThemeProvider>
  );
};

export default AppLayout;
