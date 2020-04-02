import { createStackNavigator } from "react-navigation-stack";
import RestaurantScreen from "../screens/Restaurants/Restaurants";
import AddRestaurantScreen from "../screens/Restaurants/AddRestaurant";
import DetailsRestaurantScreen from "../screens/Restaurants/DetailsRestaurant";
import AddReviewRestScreen from "../screens/Restaurants/AddReviewRest";

const RestaurantScreenStacks = createStackNavigator({
  Restaurants: {
    screen: RestaurantScreen,
    navigationOptions: () => ({
      title: "All Restaurants"
    })
  },
  AddRestaurant: {
    screen: AddRestaurantScreen,
    navigationOptions: () => ({
      title: "New Restaurant"
    })
  },
  DetailsRestaurant: {
    screen: DetailsRestaurantScreen,
    navigationOptions: props => ({
      title: props.navigation.state.params.restaurant.name
    })
  },
  AddReviewRest: {
    screen: AddReviewRestScreen,
    navigationOptions: () => ({
      title: "New Comment"
    })
  }
});

export default RestaurantScreenStacks;
