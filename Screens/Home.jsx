import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StepPage from './Steps';
import { StyleSheet } from 'react-native-web';
import * as SQLite from "expo-sqlite";
import Achievements from './Achievements';
import Enemy from './Enemy';



export default function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen styles={styles.infoText} name="Steps" component={StepPage} />
      <Tab.Screen name="Achievements" component={Achievements} />
      <Tab.Screen name="Fight!" component={Enemy} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 250,
    height: 250,
    backgroundColor: '#0553',
    borderRadius: 25,
  },

  imageContainer: {
    paddingBottom: 15,
  },

  infoContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: 'silver',
     
  },

  // buttonBackground1: {
  //   backgroundColor: "green",
  // },
  // buttonBackground2: {
  //   backgroundColor: "orange",
  // },
 
  buttonBackground3: {
    backgroundColor: "green",
    borderRadius: 25,
    padding: 10,
  },

  textBackground: {
    fontSize: 30,
  },

  infoText: {
    fontSize: 15,
  }
});