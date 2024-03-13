import React from "react";
import { useContext, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  GridEventListener,
} from "@mui/x-data-grid";

import { AppContext } from "../../contexts/AppContext";
import { getLeaveTypeString } from "../../utils/utils";
import { ILeave, ILeaveType, IUser } from "../../types/leave";

interface ILeaveList {
  client?: IUser | null;
  leaves: ILeave[];
  isLoading: boolean;
  handleRowClick: GridEventListener<"rowClick">;
}

const LeaveList = ({
  client,
  leaves,
  isLoading,
  handleRowClick,
}: ILeaveList) => {
  const { users } = useContext(AppContext);

  const getRowId = useCallback((row: ILeave) => row.id, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "#",
      width: 70,
      filterable: false,
      sortable: false,
      type: "number",
      valueGetter: (params: GridValueGetterParams) =>
        params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1,
    },
    {
      field: "userId",
      headerName: "Employee Name",
      width: 200,
      type: "singleSelect",
      valueOptions: users,
      getOptionValue: (value: any) => value?.id,
      getOptionLabel: (value: any) => value?.name,
    },
    {
      field: "type",
      headerName: "Leave Type",
      width: 150,
      type: "singleSelect",
      valueOptions: [
        {
          value: ILeaveType.Personal,
          label: "Personal",
        },
        {
          value: ILeaveType.Sick,
          label: "Sick",
        },
        {
          value: ILeaveType.Vacation,
          label: "Vacation",
        },
        {
          value: ILeaveType.Bereavement,
          label: "Bereavement",
        },
      ],
      valueFormatter: ({ value }: any) => value?.label,
      valueGetter: ({ row }: GridValueGetterParams) =>
        getLeaveTypeString(row.type),
      filterable: false,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "date",
      width: 150,
      valueGetter: ({ row }: GridValueGetterParams) => new Date(row.startDate),
    },
    {
      field: "endDate",
      headerName: "End Date",
      type: "date",
      width: 150,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.endDate),
    },
    {
      field: "numberOfDays",
      headerName: "Number of Days",
      type: "number",
      width: 150,
      filterable: false,
    },
    {
      field: "reason",
      headerName: "Reason",
      sortable: false,
      filterable: false,
      flex: 1,
    },
  ];

  return (
    <Box className="mb-10 flex flex-col">
      {client && (
        <Typography variant="h6" component="h6" className="!mb-1">
          <span className="text-base">Client</span>: {client.name}
        </Typography>
      )}

      <DataGrid
        rows={leaves}
        columns={columns}
        localeText={{ noRowsLabel: "There are no leaves added yet :)" }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        getRowId={getRowId}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

export default React.memo(LeaveList);
