import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Dimensions } from "react-native";
import { Rating, ListItem, Icon } from "react-native-elements";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import ListReview from "../../components/Restaurants/ListReviews";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const screenWidth = Dimensions.get("window").width;

//----------I NEED TO FIX THIS----------//
// This is to ignore the yellow warning box for componentWillMount and VirtualizedLists
import { YellowBox } from "react-native";
import _ from "lodash";
YellowBox.ignoreWarnings(["componentWillMount"]);
YellowBox.ignoreWarnings(["VirtualizedLists"]);
YellowBox.ignoreWarnings(["VirtualizedList"]);

const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf("componentWillMount") <= -1) {
    _console.warn(message);
  } else if (message.indexOf("VirtualizedLists") <= -1) {
    _console.warn(message);
  } else if (message.indexOf("VirtualizedList") <= -1) {
    _console.warn(message);
  }
};

export default function DetailsRestaurant(props) {
  const { navigation } = props;
  const { restaurant } = navigation.state.params;
  const [imgRest, setImgRest] = useState([]);
  const [rating, setRating] = useState(restaurant.rating);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged(user => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  //el array sirve para añadir las variables que cuando se actualizen hagan q el useEffect se vuelva a ejecutar
  useEffect(() => {
    const arrayUrl = [];
    //()() sirve para hacer una funcion asyncrona
    (async () => {
      await Promise.all(
        restaurant.images.map(async idImage => {
          await firebase
            .storage()
            .ref(`restaurant-img/${idImage}`)
            .getDownloadURL()
            .then(imageUrl => {
              arrayUrl.push(imageUrl);
            });
        })
      );
      setImgRest(arrayUrl);
    })();
  }, []);

  useEffect(() => {
    if (userLogged) {
      db.collection("favorites")
        .where("idRest", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then(response => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
  }, []);

  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show("You need to be logged in");
    } else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idRest: restaurant.id
      };
      db.collection("favorites")
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show("Restaurant has been added to favorites");
        })
        .catch(() => {
          toastRef.current.show("Error adding the restaurant to favorites");
        });
    }
  };

  const removeFavorite = () => {
    db.collection("favorites")
      .where("idRest", "==", restaurant.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then(response => {
        response.forEach(doc => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show(
                "Restaurant has been deleted from favorites"
              );
            })
            .catch(() =>
              toastRef.current.show(
                "Error deleting the restaurant from favorites"
              )
            );
        });
      });
  };

  return (
    <ScrollView style={StyleSheet.viewBody}>
      <View style={styles.viewFav}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#006a80" : "#000"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <Carousel arrayImg={imgRest} width={screenWidth} height={200} />
      <TitleRest
        name={restaurant.name}
        description={restaurant.description}
        rating={rating}
      />
      <RestInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      />
      <ListReview
        navigation={navigation}
        idRest={restaurant.id}
        setRating={setRating}
      />
      <Toast ref={toastRef} position="center" opacity={0.5} />
    </ScrollView>
  );
}

function TitleRest(props) {
  const { name, description, rating } = props;
  return (
    <View style={styles.viewRestTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRest}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        ></Rating>
      </View>
      <Text style={styles.descriptionRest}>{description}</Text>
    </View>
  );
}

function RestInfo(props) {
  const { location, name, address } = props;
  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null
    },
    {
      text: "111 222 333",
      iconName: "phone",
      iconType: "material-community",
      action: null
    },
    {
      text: "popino20@popino.com",
      iconName: "at",
      iconType: "material-community",
      action: null
    }
  ];
  return (
    <View style={styles.viewRestInfo}>
      <Text style={styles.restInfo}>RESTAURANT INFORMATION</Text>
      <Map location={location} name={name} height={100} />
      {listInfo.map((item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680"
          }}
          containerStyle={styles.contListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewRestTitle: {
    margin: 15
  },
  nameRest: {
    fontSize: 20,
    fontWeight: "bold"
  },
  rating: {
    position: "absolute",
    right: 0
  },
  descriptionRest: {
    marginTop: 5,
    color: "grey"
  },
  viewRestInfo: {
    margin: 15,
    marginTop: 25
  },
  restInfo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  contListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1
  },
  viewFav: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 5
  }
});
