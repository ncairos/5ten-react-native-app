import React from "react";
import { StyleSheet, View, Text } from "react-native";
import ActionButton from "react-native-action-button";

export default function Restaurants(props) {
  const { navigation } = props;
  return (
    <View style={styles.viewBody}>
      <Text>WE ARE IN RESTAURANTS</Text>
      <AddRestaurantButton navigation={navigation} />
    </View>
  );
}

function AddRestaurantButton(props) {
  const { navigation } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate("AddRestaurant")}
    />
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  }
});
