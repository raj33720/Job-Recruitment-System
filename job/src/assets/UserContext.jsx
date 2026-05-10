import React, { createContext, useEffect, useState } from "react";
import { clearAuthToken, getAuthToken, isTokenValid } from "../utils/auth";

// Create the context
export const UserContext = createContext();

const normalizeUserData = (data) => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const fullName = String(data.fullName || data.username || data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();

  return {
    ...data,
    fullName,
    email,
    username: data.username || fullName,
    name: data.name || fullName,
  };
};

const readStoredUserData = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const token = getAuthToken();
    if (!isTokenValid(token)) {
      clearAuthToken();
      localStorage.removeItem("userData");
      return null;
    }

    const storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
      return null;
    }

    return normalizeUserData(JSON.parse(storedUserData));
  } catch (error) {
    console.error("Failed to read stored user data:", error);
    return null;
  }
};

// Create the provider component
export const UserProvider = ({ children }) => {
  const [userDataState, setUserDataState] = useState(readStoredUserData);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (userDataState) {
      localStorage.setItem("userData", JSON.stringify(userDataState));
    } else {
      localStorage.removeItem("userData");
      clearAuthToken();
    }
  }, [userDataState]);

  const setUserData = (nextUserData) => {
    setUserDataState(normalizeUserData(nextUserData));
  };

  return (
    <UserContext.Provider value={{ userData: userDataState, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
