import { Navigation } from "react-native-navigation";
import Login from "./Login";


export function registerScreens() {
  Navigation.registerComponent("LoginScreen", () => Login);
 
}
