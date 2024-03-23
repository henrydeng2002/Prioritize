import { Pressable, ScrollView, Text, StyleSheet } from "react-native";
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import AWSHelper from '../resources/AWSHelper';
import React, {useState, useEffect} from 'react';

export default function TaskOverviewScreen({route, navigation}) {
    const [tasks, setTasks] = useState([]);
    const onTaskSelect = () => {
        navigation.navigate("Task Detail");
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

            <Text style={styles.status}>{tasks.length > 0 ? "" : "You currently have no tasks!"}</Text>

            {tasks.map((task) => {
                return (
                    <Pressable onPress={onTaskSelect} key={task.eventID}>
                        <Card>
                            <Card.Title>
                                {task.title}
                            </Card.Title>
                            <Text>
                                {(task.description != "") ? task.description : ""}
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
        alignSelf: 'center'
    }
})