import { ILeaveType } from "../types/leave";

/**
 * Get leave type string from enum val
 * @param { ILeaveType } leaveType leaveType enum value
 * @return { string }
 */
export const getLeaveTypeString = (leaveType: ILeaveType): string => {
  switch (leaveType) {
    case "personal":
      return "Personal";

    case "sick":
      return "Sick";

    case "vacation":
      return "Vacation";

    case "bereavement":
      return "Bereavement";

    default:
      return "Other";
  }
};
