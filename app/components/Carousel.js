import React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "react-native-elements";
import Carousel from "react-native-banner-carousel";

export default function CarouselImg(props) {
  const { arrayImg, height, width } = props;

  return (
    <Carousel
      autoplay
      autoplayTimeout={5000}
      loop
      index={0}
      pageSize={width}
      pageIndicatorStyle={styles.indicator}
      activePageIndicatorStyle={styles.activeIndicator}
    >
      {arrayImg.map(imageUrl => (
        <View key={imageUrl}>
          <Image style={{ width, height }} source={{ uri: imageUrl }} />
        </View>
      ))}
    </Carousel>
  );
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: "#00a680"
  },
  activeIndicator: {
    backgroundColor: "#00ffc5"
  }
});
