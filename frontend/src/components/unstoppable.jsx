import React, { useState } from "react";
import UAuth from "@uauth/js";
import styles from "../../styles/Home.module.css";

const uauth = new UAuth({
  clientID: "9aaea778-f1a6-433f-b216-1b7a0a1cc087",
  redirectUri: "http://localhost:3000",
});

function UnstoppableDomain() {
  const [auth, setAuth] = useState();

  async function Connect() {
    try {
      const authorization = await uauth.loginWithPopup();
      setAuth(JSON.parse(JSON.stringify(authorization))["idToken"]);

      await authenticate();
    } catch (error) {
      console.error(error);
    }
  }

  async function logOut() {
    uauth.logout();
    logout();
  }

  function login() {
    if (auth === null || auth === undefined) {
      Connect();
    } else {
      logOut();
    }
  }

  return (
    <>
      <button onClick={login} className={styles.explore_btn}>
        {auth != null ? auth["sub"] : "Login with Unstoppable"}
      </button>
    </>
  );
}

export default UnstoppableDomain;
