import { useState } from "react";

/**
 *
 * @returns Defines custom hook to manage user token.
 */
export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    if (userToken) {
      sessionStorage.setItem("token", JSON.stringify(userToken));
      setToken(userToken.token);
    } else {
      sessionStorage.removeItem("token");
      setToken(null);
    }
  };

  return {
    setToken: saveToken,
    token,
  };
}