import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import TopListRest from "../components/Ranking/TopListRest";

import { firebaseApp } from "../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      db.collection("restaurants")
        .orderBy("rating", "desc")
        .limit(5)
        .get()
        .then(response => {
          const topArray = [];
          response.forEach(doc => {
            let restaurant = doc.data();
            //el restaurant.id lo coloque xq en el navigation de TopListRest me pedia que le mandara el id del rest
            restaurant.id = doc.id;
            topArray.push(restaurant);
          });
          setRestaurants(topArray);
        })
        .catch(() =>
          toastRef.current.show("Error loading ranking list, try again later")
        );
    })();
  }, []);

  return (
    <View>
      <TopListRest restaurants={restaurants} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.5} />
    </View>
  );
}
