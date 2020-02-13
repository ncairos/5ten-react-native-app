import {createStackNavigator} from 'react-navigation-stack'
import RestaurantScreen from '../screens/Restaurants'

const RestaurantScreenStacks = createStackNavigator({
    Restaurants: {
        screen: RestaurantScreen,
        navigationOptions: () => ({
            title: 'All Restaurants'
        })
    }
})

export default RestaurantScreenStacks