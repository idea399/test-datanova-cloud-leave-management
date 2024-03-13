import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";

import { ILeave, ILeaveType } from "../../types/leave";
import { AppContext } from "../../contexts/AppContext";
import { createLeave, updateLeave } from "../../mockApi";

interface ILeaveFormModal {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  leave: ILeave | null;
}

const emptyFormInitialValues: ILeave = {
  id: "",
  startDate: "",
  endDate: "",
  type: ILeaveType.Personal,
  reason: "",
  userId: "",
};

const LeaveFormModal = ({ open, onClose, onSave, leave }: ILeaveFormModal) => {
  const { users, showNotification } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<ILeave>(
    emptyFormInitialValues
  );
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    if (leave) {
      setIsEditing(false);
      setInitialValues(leave);
    } else {
      setIsEditing(true);
      setInitialValues(emptyFormInitialValues);
    }
  }, [open, leave]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formSchema = Yup.object().shape({
    id: Yup.string(),
    startDate: Yup.date()
      .min(today, "Start date cannot be in the past")
      .required("Start date is required"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date must be after the start date")
      .required("End date is required"),
    type: Yup.string().oneOf(Object.values(ILeaveType), "Invalid type"),
    reason: Yup.string()
      .max(50, "Reason cannot be longer than 50 characters")
      .required("Reason is required"),
    userId: Yup.string().required("User is required"),
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (values.id) {
          await updateLeave(values);
          showNotification("Successfully updated a leave.");
        } else {
          await createLeave(values);
          showNotification("Successfully created a leave.");
        }
        clearForm();
        onSave();
      } catch (err: any) {
        setFormError(err);
      }
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const clearForm = () => {
    resetForm();
    setFormError("");
    setIsEditing(false);
    setInitialValues(emptyFormInitialValues);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        {isEditing ? (leave ? "Edit Leave" : "Create Leave") : "View Leave"}
      </DialogTitle>
      <DialogContent>
        {formError && (
          <FormHelperText error className="!text-lg !mb-8">
            {formError}
          </FormHelperText>
        )}

        {/* Start date-range */}
        <Box className="mt-4 mb-2 flex gap-x-2">
          <DatePicker
            label="Start Date *"
            value={dayjs(values.startDate)}
            onChange={(val: Dayjs | null) => {
              setFieldValue("startDate", val?.format("YYYY-MM-DD") || "");
            }}
            disablePast
            slotProps={{
              textField: {
                error: Boolean(touched.startDate && errors.startDate),
                helperText: touched.startDate && errors.startDate,
                disabled: !isEditing,
              },
            }}
          />

          <DatePicker
            label="End Date *"
            value={dayjs(values.endDate)}
            onChange={(val: Dayjs | null) => {
              setFieldValue("endDate", val?.format("YYYY-MM-DD") || "");
            }}
            slotProps={{
              textField: {
                error: Boolean(touched.endDate && errors.endDate),
                helperText: touched.endDate && errors.endDate,
                disabled: !isEditing,
              },
            }}
            minDate={dayjs(values.startDate)}
          />

          <Box className="flex justify-center items-center ml-2">
            <Typography className="whitespace-nowrap">
              <span className="text-4xl">
                {values.startDate && values.endDate
                  ? dayjs(values.endDate).diff(dayjs(values.startDate), "day") +
                    1
                  : 0}
              </span>{" "}
              days
            </Typography>
          </Box>
        </Box>
        {/* End date-range */}

        {/* Start TYPE */}
        <TextField
          id="type"
          name="type"
          label="Type *"
          margin="normal"
          select
          fullWidth
          multiline
          minRows={3}
          value={values.type}
          onChange={handleChange}
          error={Boolean(touched.type && errors.type)}
          helperText={touched.type && errors.type}
          disabled={!isEditing}
        >
          <MenuItem value={ILeaveType.Personal}>Personal</MenuItem>
          <MenuItem value={ILeaveType.Sick}>Sick</MenuItem>
          <MenuItem value={ILeaveType.Vacation}>Vacation</MenuItem>
          <MenuItem value={ILeaveType.Bereavement}>Bereavement</MenuItem>
        </TextField>
        {/* End TYPE */}

        {/* Start reason */}
        <TextField
          id="reason"
          name="reason"
          label="Reason *"
          type="text"
          margin="normal"
          fullWidth
          multiline
          minRows={3}
          value={values.reason}
          onChange={handleChange}
          error={Boolean(touched.reason && errors.reason)}
          helperText={touched.reason && errors.reason}
          disabled={!isEditing}
        />
        {/* End reason */}

        {/* Start User */}
        <TextField
          id="userId"
          name="userId"
          label="User *"
          margin="normal"
          select
          fullWidth
          multiline
          minRows={3}
          value={values.userId}
          onChange={handleChange}
          error={Boolean(touched.userId && errors.userId)}
          helperText={touched.userId && errors.userId}
          disabled={!isEditing}
        >
          {users.map((user) => (
            <MenuItem value={user.id} key={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>
        {/* End User */}
      </DialogContent>

      <DialogActions className="!px-6 !pb-4 flex !justify-between">
        <Box>
          {!isEditing && values.id && (
            <Button onClick={handleEdit}>Edit</Button>
          )}
        </Box>

        <Box>
          <Button className="!mr-4" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={isSubmitting || !isEditing}
          >
            Save
          </LoadingButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(LeaveFormModal);
