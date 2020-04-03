import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text
} from "react-native";
import { Card, Image, Icon, Rating } from "react-native-elements";
import * as firebase from "firebase";

export default function TopListRest(props) {
  const { restaurants, navigation } = props;

  return (
    <FlatList
      data={restaurants}
      renderItem={restaurant => (
        <Restaurant restaurant={restaurant} navigation={navigation} />
      )}
      //   keyExtractor={item => item.id}
      keyExtractor={(item, index) => {
        index.toString();
      }}
    />
  );
}

//componente interno
function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { name, description, images, rating } = restaurant.item;
  const [imgRest, setImgRest] = useState(null);
  const [iconColor, setIconColor] = useState("#000");

  //this line is to fix bug JSON value '<null>' of type NSNull cannot be converted to a valid URL
  const imgUri = imgRest != null ? imgRest : "";

  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`restaurant-img/${image}`)
      .getDownloadURL()
      .then(response => {
        setImgRest(response);
      });
  }, []);

  useEffect(() => {
    if (restaurant.index === 0) {
      setIconColor("#efb810");
    } else if (restaurant.index === 1) {
      setIconColor("#e3e4e5");
    } else if (restaurant.index === 2) {
      setIconColor("#cd7f32");
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DetailsRestaurant", {
          restaurant: restaurant.item
        })
      }
    >
      <Card containerStyle={styles.contCard}>
        <Icon
          type="material-community"
          name="chess-queen"
          color={iconColor}
          size={40}
          containerStyle={styles.contIcon}
        />
        <Image
          style={styles.imgCard}
          resizeMode="cover"
          source={imgUri.length != 0 ? { uri: imgUri } : null}
        />
        <View style={styles.titleRating}>
          <Text style={styles.title}>{name}</Text>
          <Rating
            imageSize={20}
            startingValue={rating}
            readonly
            style={styles.rating}
          />
        </View>
        <Text style={styles.description}>{description}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contCard: {
    marginBottom: 30,
    borderWidth: 0
  },
  imgCard: {
    width: "100%",
    height: 200
  },
  titleRating: {
    flexDirection: "row",
    marginTop: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  rating: {
    position: "absolute",
    right: 0
  },
  description: {
    color: "grey",
    marginTop: 0,
    textAlign: "justify"
  },
  contIcon: {
    position: "absolute",
    top: -30,
    left: -30,
    zIndex: 1
  }
});
