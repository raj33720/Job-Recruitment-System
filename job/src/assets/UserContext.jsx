import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  // TEMP: Hardcoded user for testing — replace with real login later
  const [userData, setUserData] = useState({
    email: "pami123@gmail.com",
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
