import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../utils/Api";

export default function ChangePasswordFunction(props) {
  const { setIsVisibleModal, toastRef } = props;
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRep, setNewPasswordRep] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideNewPasswordRep, setHideNewPasswordRep] = useState(true);

  const updatePassword = () => {
    setError({});
    if (!password || !newPassword || !newPasswordRep) {
      let objError = {};
      !password && (objError.password = "It can be empty");
      !newPassword && (objError.newPassword = "It can be empty");
      !newPasswordRep && (objError.newPasswordRep = "It can be empty");
      setError(objError);
    } else {
      if (newPassword !== newPasswordRep) {
        setError({
          newPassword: "The password do not match",
          newPasswordRep: "The password do not match"
        });
      } else {
        setIsLoading(true);
        //primero hay q reautenticar el usuario para luego cambiar la contraseña
        reauthenticate(password)
          .then(() => {
            firebase
              .auth()
              .currentUser.updatePassword(newPassword)
              .then(() => {
                setIsLoading(false);
                toastRef.current.show("Password has been updated");
                setIsVisibleModal(false);
                //una vez que cambia la contraseña vamos hacer logout
                firebase.auth().signOut();
              })
              .catch(() => {
                setError({ general: "Error updating the password" });
                setIsLoading(false);
              });
          })
          .catch(() => {
            setError({ password: "wrong password" });
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Actual Password"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hidePassword}
        onChange={elm => setPassword(elm.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword)
        }}
        errorMessage={error.password}
      />
      <Input
        placeholder="New Password"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hideNewPassword}
        onChange={elm => setNewPassword(elm.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPassword(!hideNewPassword)
        }}
        errorMessage={error.newPassword}
      />
      <Input
        placeholder="Repeat New Password"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hideNewPasswordRep}
        onChange={elm => setNewPasswordRep(elm.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPasswordRep ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPasswordRep(!hideNewPasswordRep)
        }}
        errorMessage={error.newPasswordRep}
      />
      <Button
        title="Password Change"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btn}
        onPress={updatePassword}
        loading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  input: {
    marginBottom: 10,
    marginTop: 10
  },
  btnCont: {
    marginTop: 20,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
});
