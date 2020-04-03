import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { useDebouncedCallback } from "use-debounce";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Seach(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    onSearch();
  }, [search]);

  const [onSearch] = useDebouncedCallback(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
        .then(response => {
          setRestaurants(response);
        });
    }
  }, 300);

  return (
    <View>
      <SearchBar
        placeholder="Find a Restaurant"
        onChangeText={e => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      />
      {restaurants.length === 0 ? (
        <NotFoundRest />
      ) : (
        <FlatList
          data={restaurants}
          renderItem={restaurant => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { name, images } = restaurant.item;
  const [imgRest, setImgRest] = useState(null);

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

  return (
    <ListItem
      title={name}
      leftAvatar={{ source: imgUri.length != 0 ? { uri: imgUri } : null }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("DetailsRestaurant", {
          restaurant: restaurant.item
        })
      }
    />
  );
}

function NotFoundRest() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20
  }
});
