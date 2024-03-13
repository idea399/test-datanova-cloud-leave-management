/**
 * @dev Mock api
 */
import { v4 as uuidv4 } from "uuid";

import { ILeave } from "./types/leave";
import { LOCAL_STORAGE_KEY } from "./utils/constants";

/**
 * @dev Get local storage data
 */
const getLeavesData = () => {
  return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
};

/**
 * @dev Return user list
 */
export const readAllUsers = async () => {
  return new Promise((resolve, reject) => {
    try {
      fetch("/jsons/users.json").then((res) => {
        return resolve(res.json());
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @dev Read and return all leave data from local storage
 */
export const readAllLeaves = async () => {
  return new Promise((resolve, reject) => {
    try {
      const storedData = getLeavesData();
      setTimeout(() => {
        resolve(storedData);
      }, 100);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @dev Create a leave
 */
export const createLeave = async (leaveData: ILeave) => {
  return new Promise((resolve, reject) => {
    try {
      const storedData = getLeavesData();
      storedData.push({
        ...leaveData,
        id: uuidv4(),
      });
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(storedData)
      );

      setTimeout(() => {
        resolve(storedData);
      }, 200);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @dev Update a leave
 */
export const updateLeave = async (leaveData: ILeave) => {
  return new Promise((resolve, reject) => {
    try {
      const storedData = getLeavesData();
      const oldLeaveIndex = storedData.findIndex(
        (v: ILeave) => v.id === leaveData.id
      );
      if (oldLeaveIndex < 0) reject("Leave not found");

      storedData[oldLeaveIndex] = leaveData;
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(storedData)
      );

      setTimeout(() => {
        resolve(storedData);
      }, 200);
    } catch (err) {
      reject(err);
    }
  });
};
