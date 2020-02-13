import {createStackNavigator} from 'react-navigation-stack'
import TopRestaurantScreen from '../screens/TopRestaurants'

const TopListScreenStacks = createStackNavigator({
    TopRestaurants: {
        screen: TopRestaurantScreen,
        navigationOptions: () => ({
            title: 'Top Listed Restaurants'
        })
    }
})

export default TopListScreenStacks