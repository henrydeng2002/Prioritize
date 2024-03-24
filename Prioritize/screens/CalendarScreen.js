import React, { useEffect, useState } from 'react';
import { Card } from '@rneui/themed';
import { View, Text, Button, Pressable, ScrollView, StyleSheet } from 'react-native';
import AWSHelper from '../resources/AWSHelper';

export default function CalendarScreen({navigation}) {
    const [tasks, setTasks] = useState([])
    const [taskInfo, setTaskInfo] = useState([])
    const [threeDays, setThreeDays] = useState()
    const [week, setWeek] = useState()
    
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    const loadData = async () => {
        var t = await AWSHelper.getAcceptedSuggestions();
        console.log(t)
        if (t.finalchoice != null) {
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
        } else {
            setTasks([]);
            setTaskInfo([]);
        }

        var time = await AWSHelper.getTimeNeeded();
        setThreeDays(time.days);
        setWeek(time.week)
    }

    const finish = async () => {
        await AWSHelper.createTimeSlot(new Date(), {'hours': 0, 'minutes': 0}, []);
        loadData();
    }

    const createTimeHandler = () => {
        navigation.navigate("Enter a Time Slot");
    }

    

    return (
        <ScrollView>
            <Pressable onPress={createTimeHandler}>
                <Card>
                    <Card.Title>
                        Enter a new time slot
                    </Card.Title>
                </Card>
            </Pressable>

            {(threeDays != null) ?
            <View>
                <Card>
                    <Text>Estimate of time needed in the next three days:</Text>
                    <Text>{threeDays}</Text>
                    <Text>Estimate of time needed in the next week:</Text>
                    <Text>{week}</Text>
                </Card>
            </View>:
            <Text></Text>}

            {(tasks == null || tasks.length == 0) ?
            <Text style={styles.subheader}>You have no tasks to complete</Text>:
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
            <Button style={styles.button} title="Finish" onPress={finish}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button: {
        margin: 0,
        height: 20,
        backgroundColor: 'blue',
    },
    subheader: {
        fontSize: 16,
        alignSelf: 'center',
        padding: 10
    }
});
