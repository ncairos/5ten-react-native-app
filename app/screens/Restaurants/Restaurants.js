import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import ActionButton from "react-native-action-button";
import ListRestaurants from "../../components/Restaurants/ListRestaurants";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

// This is to ignore the yellow warning box for componentWillReceiveProps
import { YellowBox } from "react-native";
import _ from "lodash";
YellowBox.ignoreWarnings(["componentWillReceiveProps"]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf("componentWillReceiveProps") <= -1) {
    _console.warn(message);
  }
};

export default function Restaurants(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [startRest, setStartRest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRest, setTotalRest] = useState(0);
  const [isReloadRest, setIsReloadRest] = useState(false);
  const limitRestShow = 8;

  useEffect(() => {
    firebase.auth().onAuthStateChanged(userInfo => {
      setUser(userInfo);
    });
  }, []);

  useEffect(() => {
    db.collection("restaurants")
      .get()
      .then(snap => {
        setTotalRest(snap.size);
      });

    (async () => {
      const resultRest = [];
      const restaurants = db
        .collection("restaurants")
        .orderBy("createAt", "desc")
        .limit(limitRestShow);

      await restaurants.get().then(response => {
        setStartRest(response.docs[response.docs.length - 1]);

        response.forEach(doc => {
          let restaurant = doc.data();
          restaurant.id = doc.id;
          resultRest.push({ restaurant });
        });
        setRestaurants(resultRest);
      });
    })();
    setIsReloadRest(false);
  }, [isReloadRest]);

  const handleLoadMore = async () => {
    const resultRestaurant = [];
    restaurants.length < totalRest && setIsLoading(true);
    const restDB = db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRest.data().createAt)
      .limit(limitRestShow);

    await restDB.get().then(response => {
      if (response.docs.length > 0) {
        setStartRest(response.docs[response.docs.length - 1]);
      } else {
        setIsLoading(false);
      }
      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurant.push({ restaurant });
      });
      setRestaurants([...restaurants, ...resultRestaurant]);
    });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        restaurants={restaurants}
        isLoading={isLoading}
        handleLoadMore={handleLoadMore}
        navigation={navigation}
      />
      {user && (
        <AddRestaurantButton
          navigation={navigation}
          setIsReloadRest={setIsReloadRest}
        />
      )}
    </View>
  );
}

function AddRestaurantButton(props) {
  const { navigation, setIsReloadRest } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() =>
        //para para setIsReloadRest como prop al navigation se lo debo pasar por parametros
        navigation.navigate("AddRestaurant", { setIsReloadRest })
      }
    />
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  }
});
