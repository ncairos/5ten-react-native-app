import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import Loading from "../components/Loading";
import Toast from "react-native-easy-toast";
import { NavigationEvents } from "react-navigation";

import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const [reloadRest, setReloadRest] = useState(false);
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged(user => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    if (userLogged) {
      const idUser = firebase.auth().currentUser.uid;
      db.collection("favorites")
        .where("idUser", "==", idUser)
        .get()
        .then(response => {
          const idRestArray = [];
          response.forEach(doc => {
            idRestArray.push(doc.data().idRest);
          });
          getDataRest(idRestArray).then(response => {
            const restaurants = [];
            response.forEach(doc => {
              let restaurant = doc.data();
              restaurant.id = doc.id;
              restaurants.push(restaurant);
            });
            setRestaurants(restaurants);
          });
        });
    }
    setReloadRest(false);
  }, [reloadRest]);

  const getDataRest = idRestArray => {
    const arrayRest = [];
    idRestArray.forEach(idRest => {
      const result = db
        .collection("restaurants")
        .doc(idRest)
        .get();
      arrayRest.push(result);
    });
    // return arrayRest;
    //de esta manera permite hacer un then en el useEffect para q termine de ejecutar esa funcion y cuando termines continua con idRestArray
    return Promise.all(arrayRest);
  };

  if (!userLogged) {
    return (
      <UnloggedUser setReloadRest={setReloadRest} navigation={navigation} />
    );
  }

  if (restaurants.length === 0) {
    return <NotFoundRest setReloadRest={setReloadRest} />;
  }

  return (
    <View style={styles.viewBody}>
      <NavigationEvents onWillFocus={() => setReloadRest(true)} />
      {restaurants ? (
        <FlatList
          data={restaurants}
          renderItem={restaurant => (
            <Restaurant
              restaurant={restaurant}
              navigation={navigation}
              toastRef={toastRef}
              setIsVisibleLoading={setIsVisibleLoading}
              setReloadRest={setReloadRest}
            />
          )}
          keyExtractor={(item, idx) => {
            idx.toString();
          }}
        />
      ) : (
        <View style={styles.loaderRest}>
          <ActivityIndicator size="large" />
          <Text>Loading Restaurants</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={1} />
      <Loading text="Removing restaurant" isVisible={isVisibleLoading} />
    </View>
  );
}

function Restaurant(props) {
  const {
    restaurant,
    navigation,
    toastRef,
    setIsVisibleLoading,
    setReloadRest
  } = props;
  const { id, name, images } = restaurant.item;
  const [imgRest, setImgRest] = useState(null);

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

  const confirmRemoveFav = () => {
    Alert.alert(
      "Removing restaurant from favorites",
      "¿Are you sure you want to remove it?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: removeFavorite
        }
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsVisibleLoading(true);
    db.collection("favorites")
      .where("idRest", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then(response => {
        response.forEach(doc => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsVisibleLoading(false);
              setReloadRest(true);
              toastRef.current.show(
                "Restaurant has been remove from favorites"
              );
            })
            .catch(() => {
              toastRef.current.show("Error Removing from favorites");
            });
        });
      });
  };

  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DetailsRestaurant", {
            restaurant: restaurant.item
          })
        }
      >
        <Image
          resizeMode="cover"
          source={{ uri: imgRest }}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Icon
          type="material-community"
          name="heart"
          color="#00a680"
          containerStyle={styles.favorite}
          onPress={confirmRemoveFav}
          size={40}
          underlayColor="transparent"
        />
      </View>
    </View>
  );
}

function NotFoundRest(props) {
  const { setReloadRest } = props;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <NavigationEvents onWillFocus={() => setReloadRest(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        You don't have favorites
      </Text>
    </View>
  );
}

function UnloggedUser(props) {
  const { setReloadRest, navigation } = props;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <NavigationEvents onWillFocus={() => setReloadRest(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        You Need to be logged in
      </Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate("Login")}
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#00a680" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderRest: {
    marginTop: 10,
    marginBottom: 10
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  restaurant: {
    margin: 10
  },
  image: {
    width: "100%",
    height: 180
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff"
  },
  name: {
    fontWeight: "bold",
    fontSize: 20
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100
  }
});
