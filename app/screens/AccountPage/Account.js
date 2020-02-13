import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import Loading from "../../components/Loading";
import GuestUser from "./GuestUser";
import LoggedUser from "./LoggedUser";

export default function Account() {
  const [login, setlogin] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      !user ? setlogin(false) : setlogin(true);
    });
  }, []);

  if (login === null) {
    return <Loading isVisible={true} text="Loading..." />;
  }
  return login ? <LoggedUser /> : <GuestUser />;
}
