import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../utils/Validation";
import Loading from "../components/Loading";

export default function LoginForm(props) {
  const { toastRef } = props;
  const [hidePassword, setHidePassword] = useState(true);

  const [LoadingIsVisible, setLoadingIsVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    setLoadingIsVisible(true);

    if (!email || !password) {
      toastRef.current.show("You need to fill in everything");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("The email is not correct");
      } else {
        console.log("Login Correct");
      }
    }
    setLoadingIsVisible(false);
  };

  return (
    <View style={styles.formCont}>
      <Input
        placeholder="Email"
        containerStyle={styles.inputForm}
        onChange={elm => setEmail(elm.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Password"
        containerStyle={styles.inputForm}
        password={true}
        secureTextEntry={hidePassword}
        onChange={elm => setPassword(elm.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />
      <Button
        title="Login"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnLogin}
        onPress={login}
      />
      <Loading text="Login Account" isVisible={LoadingIsVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  formCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  inputForm: {
    width: "100%",
    marginTop: 20
  },
  iconRight: {
    color: "#c1c1c1"
  },
  btnCont: {
    marginTop: 20,
    width: "95%"
  },
  btnLogin: {
    backgroundColor: "#00a680"
  }
});
