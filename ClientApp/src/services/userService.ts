import User from "../models/user";

const API_BASE_URL = "https://localhost:7113";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (response.status === 204) {
    console.log("no data");
    return [];
  } else {
    const data = await response.json();
    return data;
  }
};

