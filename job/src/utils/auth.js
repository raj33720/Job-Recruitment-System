const AUTH_TOKEN_KEY = "authToken";

const decodeJwtPayload = (token = "") => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );
    return JSON.parse(window.atob(paddedPayload));
  } catch (error) {
    return null;
  }
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(AUTH_TOKEN_KEY) || "";
};

export const setAuthToken = (token = "") => {
  if (typeof window === "undefined") return;
  if (token) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isTokenValid = (token = "") => {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 > Date.now();
};
