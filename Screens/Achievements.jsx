import { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import * as SQLite from "expo-sqlite";

export default function Achievements() {
  const [achievementsCompletedData, setAchievementsCompletedData] = useState([]);
  const [achievementsIncompleteData, setAchievementsIncompleteData] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    let db = SQLite.openDatabase("StepApp.db")
    setDb(db);

  }, []);

  useEffect(() => {
    const reRenderPage = setInterval(() => {
      if (db != null) {
        readAchievementsCompletedData();
        readAchievementsIncompletedData();
      }
    }, 1000);
    // return function cleanUp() {
    //   clearInterval(reRenderPage);
    // };
  }, []);

  useEffect(() => {
    if (db != null) {
      readAchievementsCompletedData();
      readAchievementsIncompletedData();
    }
  }, [db]);

  const readAchievementsCompletedData = () => {

    db.transaction((x) => {
      x.executeSql("select * from Achievements where Completed = 1", [], (_, { rows: { _array } }) =>
        // console.log(JSON.stringify(_array)),
        setAchievementsCompletedData(_array),
      );
    });
  };

  const readAchievementsIncompletedData = () => {

    db.transaction((x) => {
      x.executeSql("select * from Achievements where Completed = 0", [], (_, { rows: { _array } }) =>
        // console.log(JSON.stringify(_array)),
        setAchievementsIncompleteData(_array),
      );
    });
  };

  function DisplayCompletedAchievements() {
    if (achievementsCompletedData.length === 0) {
      return (
        <View>
          <Text>Completed Achievements:</Text>
        </View>
      )
    }
    return (
      <View>
        <Text>Completed Achievements:</Text>

        {achievementsCompletedData.map(({ id, EnemyDefeated }) => (
          <Text
            style={styles.buttonBackground1}
            key={id}
          >{EnemyDefeated}</Text>
        ))}

      </View>
    )
  }

  function DisplayIncompletedAchievements() {
    if (achievementsIncompleteData.length === 0) {
      return (
        <View>
          <Text>Incomplete Achievements:</Text>
        </View>
      )
    }
    return (
      <View>
        <Text>Incomplete Achievements:</Text>
        {achievementsIncompleteData.map(({ id, EnemyDefeated }) => (
          <Text
            style={styles.buttonBackground1}
            key={id}
          >{EnemyDefeated}</Text>
        ))}
      </View>
    )
  }

  // const insertData = () => {
  //     db.transaction((tx) => {
  //         tx.executeSql("UPDATE Achievements SET Completed = 0 where id = 1");

  //     }, null);

  //     readAchievementsIncompletedData();
  // }

  // const testBtn = () => {
  //     console.log(db);
  //     // console.log(achievementsCompletedData[0]);
  //     console.log(achievementsIncompleteData[0]);
  // };

  return (
    <View style={styles.infoContainer}>
      <StatusBar style="auto" />
      <View style={styles.infoContainer}>
        <DisplayIncompletedAchievements />
      </View>


      <View style={styles.infoContainer}>
        <DisplayCompletedAchievements />
      </View>

      {/* <TouchableOpacity
                style={styles.buttonBackground3}
                onPress={() => readAchievementsIncompletedData()}
            >
                <Text style={styles.textBackground}>READ DATA </Text>
            </TouchableOpacity> */}

      {/* <TouchableOpacity
                style={styles.buttonBackground2}
                onPress={() => insertData()}
            >
                <Text style={styles.textBackground}>insertData </Text>
            </TouchableOpacity> */}

      {/* <TouchableOpacity
                style={styles.buttonBackground2}
                onPress={() => testBtn()}
            >
                <Text style={styles.textBackground}>TEST BUTTON </Text>
            </TouchableOpacity> */}


    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },


  imageContainer: {
    backgroundColor: "green",
  },

  infoContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: 'gray',

  },

  buttonBackground1: {
    padding: 10,
    margin: 10,
    backgroundColor: "green",
  },
  buttonBackground2: {
    backgroundColor: "orange",
  },
  buttonBackground3: {
    backgroundColor: "purple",
  },

  textBackground: {
    fontSize: 50,
  },
});