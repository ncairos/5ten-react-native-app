import { createStackNavigator } from "react-navigation-stack";
import RestaurantScreen from "../screens/Restaurants/Restaurants";
import AddRestaurantScreen from "../screens/Restaurants/AddRestaurant";

const RestaurantScreenStacks = createStackNavigator({
  Restaurants: {
    screen: RestaurantScreen,
    navigationOptions: () => ({
      title: "All Restaurants"
    })
  },
  AddRestaurantScreen: {
    screen: AddRestaurantScreen,
    navigationOptions: () => ({
      title: "New Restaurant"
    })
  }
});

export default RestaurantScreenStacks;
