import { Pressable, ScrollView, Text, StyleSheet } from "react-native";
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import AWSHelper from '../resources/AWSHelper';
import React, {useState, useEffect} from 'react';

export default function TaskOverviewScreen({route, navigation}) {
    const [tasks, setTasks] = useState([]);
    const onTaskSelect = (task) => {
        navigation.navigate("Task Detail", {task: task});
    } 

    const createTaskHandler = () => {
        navigation.navigate("Create a Task");
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await loadData();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);
    
    const loadData = async () => {
        var t = await AWSHelper.getTasks();
        if (t != null) {
            setTasks(t);
        }
    }

    return(
        <ScrollView>
            <Pressable onPress={createTaskHandler}>
                <Card>
                    <Card.Title>
                        Create a new task
                    </Card.Title>
                </Card>
            </Pressable>

            <Text style={styles.status}>{tasks.length > 0 ? "Your Tasks:" : "You currently have no tasks!"}</Text>

            {tasks.map((task) => {
                return (
                    <Pressable onPress={() => {onTaskSelect(task)}} key={task.eventID}>
                        <Card key={task.dateTime}>
                            <Card.Title key={task.title}>
                                {task.title}
                            </Card.Title>
                            <Text>Category: {task.category}</Text>
                            <Text></Text>
                            <Text>Time needed:</Text>
                            <Text key={task.timeNeededString}>{task.timeNeededString}</Text>
                            <Text></Text>
                            <Text>Date due:</Text>
                            <Text>{task.dateTimeString}</Text>
                            <Text></Text>
                            <Text>
                                {(task.description != "") ? "Description: " + task.description : ""}
                            </Text>
                        </Card>
                    </Pressable>
                )
            })}
            

        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    status: {
        margin: 10,
        alignSelf: 'center',
        fontWeight: 'bold'
    }
})