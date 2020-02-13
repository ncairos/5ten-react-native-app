import { createStackNavigator } from "react-navigation-stack";
import AccountScreen from "../screens/AccountPage/Account";
import LoginScreen from '../screens/AccountPage/Login'
import SignupScreen from '../screens/AccountPage/Signup'

const AccountScreenStack = createStackNavigator({
  Account: {
    screen: AccountScreen,
    navigationOptions: () => ({
      title: "My Account"
    })
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: () => ({
      title: "Login"
    })
  },
  Signup: {
    screen: SignupScreen,
    navigationOptions: () => ({
      title: "Signup"
    })
  }
});


export default AccountScreenStack;
