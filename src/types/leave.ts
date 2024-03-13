export interface IUser {
  id: string;
  name: string;
}

export enum ILeaveType {
  Personal = 'personal',
  Sick ='sick',
  Vacation = 'vacation',
  Bereavement = 'bereavement'
}

export interface ILeave {
  id: string;
  startDate: string;
  endDate: string;
  type: ILeaveType;
  reason: string;
  userId: string;
  index?: number;
  numberOfDays?: number;
  userName?: string;
}