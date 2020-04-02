import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddReviewRest(props) {
  const { navigation } = props;
  const { idRest, setReviewsReload } = navigation.state.params;
  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();

  const addReview = () => {
    if (rating === null) {
      toastRef.current.show("You need to give a score");
    } else if (!title) {
      toastRef.current.show("You need to give a title");
    } else if (!review) {
      toastRef.current.show("You need to give a review");
    } else {
      setIsLoading();
      const user = firebase.auth().currentUser;
      //payload es la informacion q le vamos a mandar a firebase para q la guarde
      const payload = {
        idUser: user.uid,
        avataUser: user.photoURL,
        idRest: idRest,
        title: title,
        review: review,
        rating: rating,
        createAt: new Date()
      };
      db.collection("reviews")
        .add(payload)
        .then(() => {
          updateRest();
        })
        .catch(
          () =>
            toastRef.current.show("Error posting the comment, Try again later"),
          setIsLoading(false)
        );
    }
  };

  const updateRest = () => {
    const restRef = db.collection("restaurants").doc(idRest);

    restRef.get().then(response => {
      const restData = response.data();
      const ratingTotal = restData.ratingTotal + rating;
      const voteQuantity = restData.voteQuantity + 1;
      const ratingResult = ratingTotal / voteQuantity;

      restRef
        .update({ rating: ratingResult, ratingTotal, voteQuantity })
        .then(() => {
          setIsLoading(false);
          setReviewsReload(true)
          navigation.goBack();
        });
    });
  };

  return (
    <View style={styles.viewInfo}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Terrible", "Deficient", "Normal", "Good", "Excelent"]}
          defaultRating={0}
          size={35}
          onFinishRating={value => setRating(value)}
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Title"
          containerStyle={styles.input}
          onChange={e => setTitle(e.nativeEvent.text)}
        />
        <Input
          placeholder="Commentary"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={e => setReview(e.nativeEvent.text)}
        />
        <Button
          title="Post Comment"
          containerStyle={styles.btnCont}
          buttonStyle={styles.btn}
          onPress={addReview}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Posting commentary" />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2"
  },
  formReview: {
    // flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 40
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0
  },
  btnCont: {
    // flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
});
