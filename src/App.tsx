import { useEffect, useState, useMemo } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";

import Leaves from "./screens/leaves";
import { AppContext } from "./contexts/AppContext";
import { readAllUsers } from "./mockApi";
import { IUser } from "./types/leave";

const App = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [notification, setNotification] = useState<string>("");

  const getUserById = useMemo(() => {
    return (id: string) => {
      return users.find((val) => String(val.id) === String(id));
    };
  }, [users]);

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const handleCloseNotification = () => {
    setNotification("");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await readAllUsers();
        setUsers(res as IUser[]);
      } catch (err) {
        console.error("An error occurred while fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AppContext.Provider value={{ users, getUserById, showNotification }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />

        <Leaves />

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={!!notification}
          onClose={handleCloseNotification}
          message={notification}
          autoHideDuration={3000}
        />
      </LocalizationProvider>
    </AppContext.Provider>
  );
};

export default App;
