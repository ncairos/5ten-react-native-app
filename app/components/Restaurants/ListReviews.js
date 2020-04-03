import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
  const { navigation, idRest, setRating } = props;
  const [reviews, setReviews] = useState([]);
  const [reviewsReload, setReviewsReload] = useState(false);
  //validar que solo usuarios loggeados puedan hacer comentarios
  const [userLogged, setUserLogged] = useState(false);

  firebase.auth().onAuthStateChanged(user => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  //dentro de los corchetes van las variables q queremos q cuando se actualizen esas variables se ejecute de vuelta el useEffect()
  useEffect(() => {
    //()() funcion asyncrona anonima
    (async () => {
      const resultReview = [];
      const arrayRating = [];

      db.collection("reviews")
        .where("idRest", "==", idRest)
        .get()
        .then(response => {
          response.forEach(doc => {
            resultReview.push(doc.data());
            arrayRating.push(doc.data().rating);
          });
          let numSum = 0;
          arrayRating.map(value => {
            numSum = numSum + value;
          });
          const countRating = arrayRating.length;
          const resultRating = numSum / countRating;
          const resultRatingFinish = resultRating ? resultRating : 0;

          setReviews(resultReview);
          setRating(resultRatingFinish);
        });

      setReviewsReload(false);
    })();
  }, [reviewsReload]);

  return (
    <View>
      {userLogged ? (
        <Button
          buttonStyle={styles.btnAdd}
          titleStyle={styles.btnTitle}
          title="Add a Review"
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00a680"
          }}
          onPress={() =>
            navigation.navigate("AddReviewRest", {
              idRest: idRest,
              setReviewsReload: setReviewsReload
            })
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            style={{ textAlign: "center", color: "#00a680", padding: 20 }}
            onPress={() => navigation.navigate("Login")}
          >
            You need to be logged in to leave a comment {"\n"}
            <Text style={{ fontWeight: "bold" }}>Press here to login</Text>
          </Text>
        </View>
      )}

      <FlatList
        data={reviews}
        renderItem={review => (
          <Review
            review={review}
            // keyExtractor={item => item.id}
            keyExtractor={(item, index) => {
              index.toString();
            }}
          />
        )}
      />
    </View>
  );
}

function Review(props) {
  const { title, review, rating, createAt, avatarUser } = props.review.item;
  const reviewDate = new Date(createAt.seconds * 1000);

  return (
    <View style={styles.viewReview}>
      <View style={styles.viewImgAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imgAvatar}
          source={{
            url: avatarUser
              ? avatarUser
              : "https://api.adorable.io/avatars/285/abott@adorable.png"
          }}
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.viewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {reviewDate.getDate()}/{reviewDate.getMonth() + 1}/
          {reviewDate.getFullYear()} - {reviewDate.getHours()}:
          {reviewDate.getMinutes() < 10 ? "0" : ""}
          {reviewDate.getMinutes()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAdd: {
    backgroundColor: "transparent"
  },
  btnTitle: {
    color: "#00a680"
  },
  viewReview: {
    flexDirection: "row",
    margin: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1
  },
  viewImgAvatar: {
    marginRight: 15
  },
  imgAvatar: {
    width: 50,
    height: 50
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start"
  },
  viewTitle: {
    fontWeight: "bold"
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0
  }
});
