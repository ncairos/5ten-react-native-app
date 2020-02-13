import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../utils/Validation";
import * as firebase from "firebase";
import Loading from "../components/Loading";
import { withNavigation } from "react-navigation";

function SignupForm(props) {
  const { toastRef, navigation } = props;


  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepPassword, setHideRepPassword] = useState(true);

  const [LoadingIsVisible, setLoadingIsVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  const signup = async () => {
    setLoadingIsVisible(true);

    if (!email || !password || !repPassword) {
      toastRef.current.show("You need to fill in everything");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("The email is not correct");
      } else {
        if (password !== repPassword) {
          toastRef.current.show("The passwords do not match");
        } else {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              navigation.navigate('Account')
            })
            .catch(() => {
              toastRef.current.show("Error Creating User, Try Again!");
            });
        }
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
        password={true}
        secureTextEntry={hidePassword}
        containerStyle={styles.inputForm}
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
      <Input
        placeholder="Repeat Password"
        password={true}
        secureTextEntry={hideRepPassword}
        containerStyle={styles.inputForm}
        onChange={elm => setRepPassword(elm.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hideRepPassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHideRepPassword(!hideRepPassword)}
          />
        }
      />
      <Button
        title="Join"
        containerStyle={styles.btnCont}
        buttonStyle={styles.btnSignup}
        onPress={signup}
      />
      <Loading text="Creating Account" isVisible={LoadingIsVisible} />
    </View>
  );
}

export default withNavigation(SignupForm)

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
    width: "100%"
  },
  btnSignup: {
    backgroundColor: "#00a680"
  }
});
