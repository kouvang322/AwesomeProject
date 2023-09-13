import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';


export default function StepPage() {
  const [stepsData, setStepsData] = useState([]);
  const [db, setDb] = useState(null);
  const [earnedSteps, setEarnedSteps] = useState(0);

  useEffect(() => {
    let db = SQLite.openDatabase("StepApp.db")
    setDb(db);

  }, []);

  useEffect(() => {
    const reRenderPage = setInterval(() => {
      if (db != null) {
        readData();
      }
    }, 1000);
    // return function cleanUp() {
    //   clearInterval(reRenderPage);
    // };
  }, []);

  useEffect(() => {
  
    if (db != null) {
      readData();
    }

  }, [db]);


  function EarningSteps() {
    useEffect(() => {
      const earningSteps = setInterval(() => {
        setEarnedSteps((oldCount) => oldCount + 1);
      }, 2000);

      return function cleanUp() {
        clearInterval(earningSteps);
      };
    });

    return <Text style={styles.infoText}>Steps earned: {earnedSteps}</Text>
  }

  const readData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists Steps (id integer primary key not null, totalSteps int, currentSteps int);"
      );
    });

    db.transaction((tx) => {
      tx.executeSql("select * from Steps", [], (_, { rows: { _array } }) =>
        // console.log(JSON.stringify(_array)),
        setStepsData(_array),
      );
    });
  }

  const DisplaySteps = () => {
    if (stepsData.length === 0) {
      return <Text></Text>
    }

    return (
      <View>
        <Text style={styles.infoText}>Current Stored Steps: {stepsData[0].currentSteps}</Text>
        <Text style={styles.infoText}>Lifetime Steps: {stepsData[0].totalSteps}</Text>
      </View>
    )
  }

  // const insertData = () => {
  //     // db.transaction((tx) => {
  //     //     tx.executeSql(
  //     //         "create table if not exists Monsters (id integer primary key not null, MonsterName text, MonsterImg text, Defeated int, MonsterHealth int);"
  //     //     );

  //     //     tx.executeSql(
  //     //         "create table if not exists Achievements (id integer primary key not null, EnemyDefeated text, Completed int);"
  //     //     );
  //     // })

  //     // db.transaction((tx) => {
  //     //     tx.executeSql("insert into Monsters (MonsterName, MonsterImg, Defeated, MonsterHealth) values ('Orc Wizard', 'Orc-Wizard.png', 0, 200)");
  //     // }, null);

  //     // db.transaction((tx) => {
  //     //     tx.executeSql("insert into Monsters (MonsterName, MonsterImg, Defeated, MonsterHealth) values ('Green Dragon', 'green-dragon.png', 0, 5000)");
  //     // }, null);

  //     // db.transaction((tx) => {
  //     //     tx.executeSql("insert into Achievements (EnemyDefeated, Completed) values ('Green Dragon Defeated', 0)");

  //     //     tx.executeSql("insert into Achievements (EnemyDefeated, Completed) values ('Orc Wizard Defeated', 0)");
  //     // }, null);

  //     // db.transaction((tx) => {
  //     //     tx.executeSql("Update Monsters set MonsterHealth = 200 where id = 1;");
  //     // }, null);

  //     // db.transaction((tx) => {
  //     //     tx.executeSql("Update Monsters set Defeated = 0 where id = 1;");
  //     // }, null);


  // };


  // const Testbtn = () => {
  //     console.log(db);
  //     console.log(stepsData[0]);
  // }

  const storeSteps = () => {
    let addingToStore = earnedSteps + stepsData[0].currentSteps;
    let addingToTotal = earnedSteps + stepsData[0].totalSteps;

    db.transaction((x) => {
      x.executeSql("UPDATE Steps SET currentSteps = ?, totalSteps = ? where id = 1", [addingToStore, addingToTotal], (_, { rows: { _array } }) =>
        // console.log(JSON.stringify(_array)),
        setStepsData(_array));
    }, null);

    readData();
    setEarnedSteps(0);
  }

  const getKnightImg = require("../data/knight-running.gif");

  return (

    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* <TouchableOpacity
                style={styles.buttonBackground3}
                onPress={() => readData()}
            >
                <Text style={styles.textBackground}>READ DATA </Text>
            </TouchableOpacity> */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={getKnightImg}
          contentFit="cover"
        />

      </View>
      <View>
        <TouchableOpacity
          style={styles.buttonBackground3}
          onPress={() => storeSteps()}
        >
          <Text style={styles.textBackground}>Store Steps </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <EarningSteps />
      
        <DisplaySteps />
      </View>


      {/* <TouchableOpacity
                style={styles.buttonBackground2}
                onPress={() => insertData()}
            >
                <Text style={styles.textBackground}>insert </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonBackground2}
                onPress={() => Testbtn()}
            >
                <Text style={styles.textBackground}>Test data </Text>
            </TouchableOpacity> */}

    </View>
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