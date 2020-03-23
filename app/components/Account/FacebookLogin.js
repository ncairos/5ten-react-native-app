import React, { useState, useRef } from "react";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

export default function FacebookLogin(props) {
  const { toastRef, navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const login = async () => {
    const {
      type,
      token
    } = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.application_id,
      { permissions: FacebookApi.permissions }
    );

    if (type === "success") {
      setIsLoading(true);
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      await firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => navigation.navigate("Account"))
        .catch(() =>
          toastRef.current.show("Error with Facebook Login, Try again later")
        );
    } else if (type === "cancel") {
      toastRef.current.show("Cancel Login");
    } else {
      toastRef.current.show("Unknown Error");
    }
    setIsLoading(false);
  };
  return (
    <>
      <SocialIcon
        title="Sign in With Facebook"
        button
        type="facebook"
        onPress={login}
      />
      <Loading isVisible={isLoading} text="Session Initialization" />
    </>
  );
}
