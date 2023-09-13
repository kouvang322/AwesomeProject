import { Button, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import * as SQLite from "expo-sqlite";


export default function Enemy({ navigation }) {
  const [enemyAliveData, setEnemyAliveData] = useState([]);
  const [enemyDefeatedData, setEnemyDefeatedData] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    let db = SQLite.openDatabase("StepApp.db")
    setDb(db);
  
  }, []);

  useEffect(() => {
    const reRenderPage = setInterval(() => {
      if(db != null){
        readEnemyAliveData();
        readEnemyDefeatedData();
      }
    }, 1000);
    // return function cleanUp() {
    //   clearInterval(reRenderPage);
    // };
  }, []);


  useEffect(() => {
    if (db != null) {
      readEnemyAliveData();
      readEnemyDefeatedData();
    }
  }, [db]);


  const readEnemyAliveData = () => {
    //if there is no table, create it

    db.transaction((tx) => {
      tx.executeSql("select * from Monsters where Defeated = 0", [], (_, { rows: { _array } }) =>
        // console.log(JSON.stringify(_array)),
        setEnemyAliveData(_array),
      );
    });
  };

  const readEnemyDefeatedData = () => {
    //if there is no table, create it

    db.transaction((tx) => {
      tx.executeSql("select * from Monsters where Defeated = 1", [], (_, { rows: { _array } }) =>
        // console.log(JSON.stringify(_array)),
        setEnemyDefeatedData(_array),
      );
    });
  };

  const navigate = (id, MonsterImg) => {
    navigation.navigate("Fight", { id, MonsterImg });
  }

  function DisplayEnemyAliveList() {
    if (enemyAliveData.length === 0) {
      return (
        <View>
          <Text>Enemies Alive:</Text>
        </View>
      )
    }
    return (
      <View>
        <Text>Enemies Alive:</Text>
        {enemyAliveData.map(({ id, MonsterName, MonsterImg, MonsterHealth }) => (
          <TouchableOpacity
            style={styles.buttonBackground1}
            key={id}
            onPress={() => navigate(id, MonsterImg)}
          >
            <Text>
              {MonsterName}{"\n"}
              Health: {MonsterHealth}{"\n"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  function DisplayEnemyDefeatedList() {
    if (enemyDefeatedData.length === 0) {
      return (
        <View>
          <Text>Enemies Defeated:</Text>
        </View>
      )
    }
    return (
      <View>
        <Text>Enemies Defeated:</Text>
        {enemyDefeatedData.map(({ id, MonsterName, MonsterImg, MonsterHealth }) => (
          <TouchableOpacity
            style={styles.buttonBackground1}
            key={id}
            onPress={() => navigation.navigate("Fight", { id, MonsterImg })
            }
            disabled={true}
          >
            <Text>
              {MonsterName}{"\n"}
              Health: {MonsterHealth}{"\n"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  // function insertData() {
  //     db.transaction((x) => {
  //         x.executeSql("UPDATE Monsters SET MonsterHealth = 200, Defeated = 0  Where id = 1");
  //     });
  // }

  // function testBtn() {
    
  // }

  return (
    <View style={styles.infoContainer}>
      <StatusBar style="auto" />
      <View style={styles.infoContainer}>
        <DisplayEnemyAliveList />
      </View>

      <View style={styles.infoContainer}>
        <DisplayEnemyDefeatedList />
      </View>

      {/* <TouchableOpacity
        onPress={readEnemyAliveData}
      >
        <Text>
          test
        </Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        onPress={insertData}
      >
        <Text>
          insertData
        </Text>
      </TouchableOpacity> */}

    </View>

  );
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
