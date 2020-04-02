import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native-elements";
import * as firebase from "firebase";

export default function ListRestaurants(props) {
  const { restaurants, isLoading, handleLoadMore, navigation } = props;

  return (
    <View>
      {restaurants ? (
        <FlatList
          data={restaurants}
          renderItem={restaurant => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, idx) => idx.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loadingRest}>
          <ActivityIndicator size="large" />
          <Text>Loading Restaurants</Text>
        </View>
      )}
    </View>
  );
}

function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { name, address, description, images } = restaurant.item.restaurant;
  //tenia un error de JSON value '<null>' es por eso q use JSON.stringify
  const [imageRest, setImageRest] = useState(JSON.stringify(null));

  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`restaurant-img/${image}`)
      .getDownloadURL()
      .then(result => {
        setImageRest(result);
      });
  });

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("DetailsRestaurant", { restaurant: restaurant.item.restaurant })}
    >
      <View style={styles.viewRest}>
        <View style={styles.viewImg}>
          <Image
            resizeMode="cover"
            source={{ uri: imageRest }}
            style={styles.imgRest}
            PlaceholderContent={<ActivityIndicator color="fff" />}
          />
        </View>
        <View>
          <Text style={styles.restName}>{name}</Text>
          <Text style={styles.restAddress}>{address}</Text>
          <Text style={styles.restDescription}>
            {description.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loadingRest}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFound}>
        <Text>No more restaurants to load</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingRest: {
    marginTop: 20,
    alignItems: "center"
  },
  viewRest: {
    flexDirection: "row",
    margin: 10
    // width: 325
  },
  viewImg: {
    marginRight: 15
  },
  imgRest: {
    width: 80,
    height: 80
  },
  restName: {
    fontWeight: "bold"
  },
  restAddress: {
    paddingTop: 2,
    color: "grey"
  },
  restDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300
  },
  loadingRest: {
    marginTop: 10,
    marginBottom: 10
  },
  notFound: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center"
  }
});
