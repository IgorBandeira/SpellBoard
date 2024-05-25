import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import boardApi from "../../api/boardApi";
import { setBoards } from "../../redux/features/boardSlice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FavouriteList from "./FavouriteList";

const Sidebar = () => {
  const user = useSelector((state) => state.user.value);
  const boards = useSelector((state) => state.board.value);
  const theme = useSelector((state) => state.theme.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:820px)");

  const sidebarWidth = 250;

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll();
        dispatch(setBoards(res));
      } catch (err) {
        console.log(err);
      }
    };
    getBoards();
  }, [dispatch]);

  useEffect(() => {
    const activeItem = boards.findIndex((e) => e.id === boardId);
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`);
    }
    setActiveIndex(activeItem);
  }, [boards, boardId, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex((e) => e.id === boardId);
    setActiveIndex(activeItem);
    dispatch(setBoards(newList));

    try {
      await boardApi.updatePosition({ boards: newList });
    } catch (err) {
      console.log(err);
    }
  };

  const addBoard = async () => {
    try {
      const res = await boardApi.create();
      const newList = [res, ...boards];
      dispatch(setBoards(newList));
      navigate(`/boards/${res.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: "fixed", top: 10, left: 10 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        container={window.document.body}
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isDrawerOpen : true}
        onClose={toggleDrawer}
        sx={{
          width: sidebarWidth,
          height: "100vh",
          "& > div": { borderRight: "none" },
        }}
      >
        <List
          disablePadding
          sx={{
            width: sidebarWidth,
            height: "100vh",
            backgroundColor: theme.palette.background.paper,
            overflowY: "auto",
          }}
        >
          <ListItem>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" fontWeight="700">
                {user.username}
              </Typography>
              <IconButton onClick={logout}>
                <LogoutOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
          <Box sx={{ paddingTop: "10px" }} />
          <FavouriteList />
          <Box sx={{ paddingTop: "10px" }} />
          <ListItem>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" fontWeight="700">
                Meus boards:
              </Typography>
              <IconButton onClick={addBoard}>
                <AddBoxOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              key={"list-board-droppable-key"}
              droppableId={"list-board-droppable"}
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {boards.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ListItemButton
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          selected={index === activeIndex}
                          component={Link}
                          to={`/boards/${item.id}`}
                          sx={{
                            pl: "20px",
                            cursor: snapshot.isDragging
                              ? "grab"
                              : "pointer!important",
                          }}
                          onClick={() => {
                            setActiveIndex(index);
                            if (isMobile) {
                              setIsDrawerOpen(false);
                            }
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.icon} {item.title}
                          </Typography>
                        </ListItemButton>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Box sx={{ textAlign: "center", mt: "auto", pb: "20px" }}>
            <img
              src={theme.images.brand}
              alt="Spell Board"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
