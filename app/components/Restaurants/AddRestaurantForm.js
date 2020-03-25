import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const WidthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  //console.log(props) me trae un objeto vacio es x eso que en AddRestaurant.js tengo que mandarle props mediante el componente AddRestaurantForm
  const { toastRef, setIsLoading, navigation, setIsReloadRest } = props;
  const [imageSelected, setImageSelected] = useState([]);
  const [restName, setRestName] = useState("");
  const [restAddress, setRestAddress] = useState("");
  const [restDescription, setRestDescription] = useState("");
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [restLocation, setRestLocation] = useState(null);

  const restAdd = () => {
    if (!restName || !restAddress || !restDescription) {
      toastRef.current.show("You need to fill everything");
    } else if (imageSelected.length === 0) {
      toastRef.current.show("You need to have at least one picture");
    } else if (!restLocation) {
      toastRef.current.show("You need to have a location on the map");
    } else {
      setIsLoading(true);
      uploadImgStorage(imageSelected).then(arrayImages => {
        db.collection("restaurants")
          .add({
            name: restName,
            address: restAddress,
            description: restDescription,
            location: restLocation,
            images: arrayImages,
            rating: 0,
            ratingTotal: 0,
            voteQuantity: 0,
            createAt: new Date(),
            createBy: firebaseApp.auth().currentUser.uid
          })
          .then(() => {
            setIsLoading(false);
            setIsReloadRest(true );
            navigation.navigate("Restaurants");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show(
              "There was an error uploading the restaurant"
            );
          });
      });
    }
  };

  //esto es un UUID generator porque no funciona el paquete
  function uuidGenerator() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  const uploadImgStorage = async imageArray => {
    const imgBlob = [];
    await Promise.all(
      imageArray.map(async image => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase
          .storage()
          .ref("restaurant-img")
          .child(uuidGenerator());
        await ref
          .put(blob)
          .then(result => {
            imgBlob.push(result.metadata.name);
          })
          .catch(() => {
            toastRef.current.show("There was an error uploading the file");
          });
      })
    );
    return imgBlob;
  };

  return (
    <ScrollView>
      <ProfileRestaurant profileRestaurant={imageSelected[0]} />
      <AddForm
        setRestName={setRestName}
        setRestAddress={setRestAddress}
        setRestDescription={setRestDescription}
        setIsVisibleMap={setIsVisibleMap}
        restLocation={restLocation}
      />
      <UploadImage
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
        toastRef={toastRef}
      />
      <Button
        title="Add Restaurant"
        onPress={restAdd}
        buttonStyle={styles.restAddBtn}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setRestLocation={setRestLocation}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function ProfileRestaurant(props) {
  const { profileRestaurant } = props;
  return (
    <View style={styles.viewPhoto}>
      {profileRestaurant ? (
        <Image
          source={{ uri: profileRestaurant }}
          style={{ width: WidthScreen, height: 200 }}
        />
      ) : (
        <Image
          source={require("../../../assets/img/original.png")}
          style={{ width: WidthScreen, height: 200 }}
        />
      )}
    </View>
  );
}

function UploadImage(props) {
  const { imageSelected, setImageSelected, toastRef } = props;
  const imageSelect = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;

    if (resultPermissionCamera === "denied") {
      toastRef.current.show("You need to grant permission");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        toastRef.current.show(
          "You have close the gallery without selecting any image "
        );
      } else {
        setImageSelected([...imageSelected, result.uri]);
      }
    }
  };

  const removeImage = image => {
    const arrayImg = imageSelected;

    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete it?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          //si la URL que le estamos pasando es igual a la q esta mostrando el filter la añades y de lo contrario no
          onPress: () =>
            setImageSelected(arrayImg.filter(imageUrl => imageUrl !== image))
        }
      ],
      {
        cancelable: false
      }
    );
  };

  return (
    <View style={styles.viewImg}>
      {imageSelected.length < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}

      {imageSelected.map((imgRestaurant, idx) => (
        <Avatar
          key={idx}
          onPress={() => removeImage(imgRestaurant)}
          style={styles.miniatureStyle}
          source={{ uri: imgRestaurant }}
        />
      ))}
    </View>
  );
}

function AddForm(props) {
  const {
    setRestName,
    setRestAddress,
    setRestDescription,
    setIsVisibleMap,
    restLocation
  } = props;
  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Name of the Restaurant"
        containerStyle={styles.input}
        onChange={elm => setRestName(elm.nativeEvent.text)}
      />
      <Input
        placeholder="Address of the Restaurant"
        containerStyle={styles.input}
        onChange={elm => setRestAddress(elm.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: restLocation ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true)
        }}
      />
      <Input
        placeholder="Description of the Restaurant"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={elm => setRestDescription(elm.nativeEvent.text)}
      />
    </View>
  );
}

function Map(props) {
  const { isVisibleMap, setIsVisibleMap, setRestLocation, toastRef } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermissions = resultPermissions.permissions.location.status;
      if (statusPermissions !== "granted") {
        toastRef.current.show("You need to grant permission");
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setRestLocation(location);
    toastRef.current.show("Restaurant Location saved correctly");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={region => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Save Location"
            onPress={confirmLocation}
            containerStyle={styles.contViewMapBtnSave}
            buttonStyle={styles.viewMapBtnSave}
          />
          <Button
            title="Cancel Location"
            onPress={() => setIsVisibleMap(false)}
            containerStyle={styles.contViewMapBtnCancell}
            buttonStyle={styles.viewMapBtnCancell}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewImg: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3"
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0
  },
  map: {
    width: "100%",
    height: 550
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  contViewMapBtnSave: {
    paddingRight: 5
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680"
  },
  contViewMapBtnCancell: {
    paddingLeft: 5
  },
  viewMapBtnCancell: {
    backgroundColor: "#a60d0d"
  },
  restAddBtn: {
    backgroundColor: "#00a680",
    margin: 20
  }
});
