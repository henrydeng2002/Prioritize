import React, { useEffect, useState } from 'react';
import { View, Text, Button, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import AWSHelper from '../resources/AWSHelper';
import { Card } from '@rneui/themed';

export default function ConfirmTime({route, navigation}) {
    const [tasks, setTasks] = useState([])
    const [taskInfo, setTaskInfo] = useState([])
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    const loadData = async () => {
        var t = await AWSHelper.getSuggestions(route.params.date);
        while (t == undefined) {
            t = await AWSHelper.getSuggestions(route.params.date);
        }
        console.log(t.finalchoice)

        var t_list = [];
        for (var i = 0; i < t.finalchoice.length; i++) {
            var response = await AWSHelper.getTask(t.finalchoice[i].eventID);
            t.finalchoice[i]['title'] = response.title;
            t.finalchoice[i]['description'] = response.description;
            var timeString = "";
            var hr = (parseInt(t.finalchoice[i].times) - (parseInt(t.finalchoice[i].times) % 4)) / 4
            var min = (parseInt(t.finalchoice[i].times) % 4) * 15
            timeString += hr + " hrs " + min + " mins";
            t.finalchoice[i]['time'] = timeString;
        }
        setTaskInfo(t_list);
        setTasks(t);
        console.log(t.finalchoice)
    }

    const accept = async () => {
        console.log("accept suggestions")
        await AWSHelper.acceptSuggestions(tasks);
        Alert.alert('Accepted Suggestions', 'Please remember to finish the task in the tasks screen, or to add more time', [
            { text: 'OK', onPress: () => {navigation.navigate("CalendarScreen")}}
        ]);
        
    }

    const reject = () => {
        navigation.navigate("Reject suggestions")
    }

    return(
        <ScrollView>
            <Text style={styles.header}>Confirm your suggestions:</Text>

            {(tasks == null || tasks.length == 0) ?
            <Text>You have no tasks in the selected category</Text>:
            tasks.finalchoice.map((task) => {
                return (
                    //<Pressable onPress={() => {onTaskSelect(task)}} key={task.eventID}>
                        <Card>
                            <Card.Title key={task.title}>
                                {task.title}
                            </Card.Title>
                            <Text>Time to spend on task:</Text>
                            <Text>{task.time}</Text>
                            <Text>
                                {(task.description != "") ? "Description: " + task.description : ""}
                            </Text>
                        </Card>
                    //</Pressable>
                )
            })}

        {(tasks == null || tasks.length == 0) ? <Button style={styles.button} onPress={() =>{ navigation.navigate("CalendarScreen")}} title="Back" />:
        <View>
            <Button style={styles.button} onPress={accept} title="Accept Suggestions"/>
            <Button style={styles.button} onPress={reject} title="Reject Suggestions"/>
        </View>
        }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        alignSelf: 'center'
    },
    button: {
        margin: 0,
        height: 20,
        backgroundColor: 'blue',
    },
})