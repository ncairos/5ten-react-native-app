import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from 'firebase'

export default function LoggedUser() {
  return (
    <View>
      <Text>LoggedUser...</Text>
      <Button title='Logout' onPress={() => firebase.auth().signOut()} />
    </View>
  );
}
