import { useEffect, useState, useContext, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { GridEventListener } from "@mui/x-data-grid";

import { readAllLeaves } from "../../mockApi";
import { AppContext } from "../../contexts/AppContext";
import { ILeave } from "../../types/leave";
import LeaveFormModal from "./LeaveFormModal";
import LeaveList from "./LeaveList";

const Leaves = () => {
  const [data, setData] = useState<ILeave[]>([]);
  const { getUserById } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [openedLeave, setOpenedLeave] = useState<ILeave | null>(null);
  const [isGroupedByClient, setIsGroupedByClient] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await readAllLeaves();

      const leaveData = (res as ILeave[]).map((leave) => ({
        numberOfDays:
          dayjs(leave.endDate).diff(dayjs(leave.startDate), "day") + 1,
        userName: getUserById(leave.userId)?.name,
        ...leave,
      }));

      setData(leaveData);
    } catch (err) {
      console.error("An error occurred while fetching leaves data: ", err);
    }
    setIsLoading(false);
  }, [getUserById]);

  const handleClickNew = () => {
    setOpenedLeave(null);
    setFormModalOpen(true);
  };
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setOpenedLeave(params.row);
    setFormModalOpen(true);
  };

  const handleFormModalClose = useCallback(() => {
    setOpenedLeave(null);
    setFormModalOpen(false);
  }, []);

  const handleChangeGrouping = () => {
    setIsGroupedByClient((prev) => !prev);
  };

  const renderLeaveTableList = () => {
    if (!isGroupedByClient) {
      return (
        <LeaveList
          key="all-leaves"
          leaves={data}
          isLoading={isLoading}
          handleRowClick={handleRowClick}
        />
      );
    }

    const groupedData: { [type: string]: ILeave[] } = {};
    data.forEach((leave) => {
      groupedData[leave.userId] = (groupedData[leave.userId] || []).concat(
        leave
      );
    });

    return Object.keys(groupedData).map((userId) => {
      return (
        <LeaveList
          key={userId}
          client={getUserById(userId)}
          leaves={groupedData[userId]}
          isLoading={isLoading}
          handleRowClick={handleRowClick}
        />
      );
    });
  };

  const handleFormSaved = useCallback(() => {
    handleFormModalClose();
    fetchData();
  }, [handleFormModalClose, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box className="w-full min-h-screen p-6 flex flex-col bg-white">
      <Box className="flex justify-between mb-5">
        <Typography variant="h5" className="uppercase">
          Latest Leave Applications
        </Typography>
        <Button
          startIcon={<AddIcon />}
          color="primary"
          variant="contained"
          size="small"
          onClick={handleClickNew}
        >
          Create
        </Button>
      </Box>

      <Box className="flex mb-2">
        <FormControlLabel
          control={
            <Switch
              checked={isGroupedByClient}
              onChange={handleChangeGrouping}
              name="gilad"
            />
          }
          label={isGroupedByClient ? "Grouped by client" : "All in one table"}
        />
      </Box>

      {renderLeaveTableList()}

      <LeaveFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        onSave={handleFormSaved}
        leave={openedLeave}
      />
    </Box>
  );
};

export default Leaves;
