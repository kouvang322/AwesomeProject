import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from "expo-sqlite";
import { Image } from 'expo-image';
import { MonsterImage } from '../MonsterImages';


export default function FightEnemy() {
    const [db, setDb] = useState(null);
    const [enemyData, setEnemyData] = useState([]);
    const [stepsData, setStepsData] = useState([]);
    const [achievementsData, setAchievementsData] = useState([]);

    const route = useRoute();
    const id = route.params?.id
    const enemyImg = route.params?.MonsterImg

    const getImage = () => {
        let imgSource = null;
        if (enemyImg === 'green-dragon.png') {
            imgSource = MonsterImage.greenDragon.uri;
            return imgSource;
        }
        if (enemyImg === 'Orc-Wizard.png') {
            imgSource = MonsterImage.orcWizard.uri;
            return imgSource;
        }
    }

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


    const readData = () => {
        //if there is no table, create it

        db.transaction((tx) => {
            tx.executeSql("select * from Monsters where id = ?", [id], (_, { rows: { _array } }) =>
                // console.log(JSON.stringify(_array)),
                setEnemyData(_array),
            );
        });

        db.transaction((tx) => {
            tx.executeSql("select * from Steps", [], (_, { rows: { _array } }) =>
                // console.log(JSON.stringify(_array)),
                setStepsData(_array),
            );
        });

        db.transaction((tx) => {
            tx.executeSql("select * from Achievements Where id = ?", [id], (_, { rows: { _array } }) =>
                // console.log(JSON.stringify(_array)),
                setAchievementsData(_array),
            );
        });
    };

    function AttackEnemy() {
        let remainingHealth = enemyData[0].MonsterHealth - stepsData[0].currentSteps;

        if (remainingHealth <= 0) {
            db.transaction((x) => {
                x.executeSql("Update Monsters set Defeated = 1, MonsterHealth = 0 where id = ?", [id]);
            });

            db.transaction((x) => {
                x.executeSql("UPDATE Steps SET currentSteps = 0");
            });

            db.transaction((x) => {
                x.executeSql("UPDATE Achievements SET Completed = 1 Where id = ?", [id]);
            });

            readData();

        } else {
            db.transaction((x) => {
                x.executeSql("Update Monsters set MonsterHealth = ? where id = ?", [remainingHealth, id]);
            });

            db.transaction((tx) => {
                tx.executeSql("update Steps set currentSteps = 0");
            });

            readData();
        }
    }

    function DisplayEnemyFight() {
        if (enemyData.length === 0) {
            return <Text></Text>
        }

        return (
            <View>
                <View>
                    <Text>{enemyData[0].MonsterName}</Text>
                    <Image
                        style={styles.image}
                        source={getImage()}
                        contentFit="cover"
                    />
                </View>
                <Text>Enemy Health: {"\n"}
                    {enemyData[0].MonsterHealth}</Text>

            </View>
        )
    }

    function DisplayStepsData() {
        if (stepsData.length === 0) {
            return <Text></Text>
        }
        return (
            <View>
                <Text>Current Stored Steps: {stepsData[0].currentSteps}</Text>
                <Text>Lifetime Steps: {stepsData[0].totalSteps}</Text>
            </View>
        )
    }

    // function testBtn() {
    //     console.log(achievementsData[0]);
    //     console.log(enemyData[0]);
    // }

    return (
        <View style={styles.container}>
            <View>
                <StatusBar style="auto" />

                <DisplayEnemyFight />

                <TouchableOpacity 
                    style={styles.buttonBackground1}
                    onPress={AttackEnemy}
                >
                    <Text style={styles.textSize}>Attack!</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                onPress={testBtn}
                >
                    <Text>
                        test 
                    </Text>
                </TouchableOpacity> */}

                {/* <TouchableOpacity
                    onPress={insertData}
                >
                    <Text>
                        insert data
                    </Text>
                </TouchableOpacity> */}


            </View>

            <View>
                <Text>*Attacking uses up all stored steps</Text>

                <DisplayStepsData />
            </View>
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

    image: {
        width: 300,
        height: 300,
        backgroundColor: '#0553',
    },

    textSize: {
        fontSize: 15,
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
});