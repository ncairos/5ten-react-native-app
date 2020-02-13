import React from "react";
import { StyleSheet, ScrollView, Image, View, Text } from "react-native";
import { Button } from "react-native-elements";
import { withNavigation } from "react-navigation";

function GuestUser(props) {
  const { navigation } = props;
  return (
    <ScrollView style={styles.viewBody} centerContent={true}>
      <Image
        source={require("../../../assets/img/user-guest.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Manage your Profile</Text>
      <Text style={styles.description}>
        ¿How would you describe your best restaurant? Search and Find in the
        easiest way the best restaurants in town
      </Text>
      <View style={styles.viewBtn}>
        <Button
          buttonStyle={styles.btnStyle}
          containerStyle={styles.btnCont}
          title="Go to your Profile"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </ScrollView>
  );
}

export default withNavigation(GuestUser);

const styles = StyleSheet.create({
  viewBody: {
    marginLeft: 30,
    marginRight: 30
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 40
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center"
  },
  description: {
    textAlign: "center",
    marginBottom: 20
  },
  viewBtn: {
    flex: 1,
    alignItems: "center"
  },
  btnStyle: {
    backgroundColor: "#00a680"
  },
  btnCont: {
    width: "70%"
  }
});
