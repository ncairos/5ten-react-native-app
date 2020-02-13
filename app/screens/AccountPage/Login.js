import React, { useRef } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { Divider } from "react-native-elements";
// si por alguna razon el log viene un objeto vacio usamos el withNavigation como hemos hecho en account.js
import { withNavigation } from "react-navigation";
import LoginForm from "../../components/LoginForm";
import Toast from "react-native-easy-toast";

export default function Login(props) {
  const { navigation } = props;
  const toastRef = useRef();

  return (
    <ScrollView>
      <Image
        source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.viewCont}>
        <LoginForm toastRef={toastRef} />
        <CreateAccount navigation={navigation} />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.viewCont}>
        <Text>FACEBOOK LOGIN</Text>
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5} />
    </ScrollView>
  );
}

//---COMPONENTE INTERNO---//
function CreateAccount(props) {
  const { navigation } = props;
  return (
    <Text style={StyleSheet.textSignup}>
      ¿No Account Yet?{" "}
      <Text
        style={styles.btnSignup}
        onPress={() => navigation.navigate("Signup")}
      >
        SIGN UP
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20
  },
  viewCont: {
    marginRight: 40,
    marginLeft: 40
  },
  divider: {
    backgroundColor: "#00a680",
    margin: 40
  },
  textSignup: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  btnSignup: {
    color: "#00a680",
    fontWeight: "bold"
  }
});
