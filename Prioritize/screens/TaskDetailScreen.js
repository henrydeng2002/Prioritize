import { useNavigation } from '@react-navigation/native';
import {Text, StyleSheet, View, TextInput, Button, SafeAreaView, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimePicker, ValueMap } from 'react-native-simple-time-picker';
import AWSHelper from '../resources/AWSHelper';

export default function TaskDetailScreen({route, navigation}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Due date & time", value: "due" },
        { label: "Time needed", value: "time" },
    ]);

    const [name, setName] = useState('');

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [time, setTime] = useState({
        hours: 1,
        minutes: 0,
        seconds: 0,
    });

    const handleTimeNeededChange = (newValue: ValueMap) => {
        setTime(newValue);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const updateEvent = () => {
        console.log(route.params.task.eventID)
        if (value == 'due') {
            if (date < new Date()) {
                createAlert('Please enter a date after current time');
            } else {
                var dateString = date.toISOString();
                AWSHelper.updateDue(route.params.task.eventID, dateString);
            }
        } else if (value == 'time') {
            AWSHelper.updateTimeNeeded(route.params.task.eventID, time);
        }
    }

    const moreTime = () => {
        Alert.alert('More Time', 'Please edit time needed to complete task', [
            { text: 'OK' }
        ]);
    }

    const finishedHandler = () => {
        Alert.alert('Are you sure?', 'Press Yes to finish this task and remove it from pending tasks', [
            { text: 'Cancel' },
            { text: 'Yes',
                onPress: async () => {await AWSHelper.removeEvent(route.params.task.eventID); navigation.navigate("Task Overview")}
            }
        ]);
    }

    return (
        <View>
            <Text style={styles.header}>Task Details:</Text>
            <Text>Title: {route.params.task.title}</Text>
            <Text>Category: {route.params.task.category}</Text>
            <Text>Due on: {route.params.task.dateTimeString}</Text>
            <Text>Time needed: {route.params.task.timeNeededString}</Text>
            <Text>Description: {route.params.task.description}</Text>
            <Text></Text>
            <Text style={styles.header}>Edit Task</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder={'Choose a field to edit'}
            />
            {
                (value == null) ? 
                    <Text>Choose a category</Text>
                : (value == 'due') ?
                    <SafeAreaView>
                        <Button onPress={showDatepicker} title="Date" />
                        <Button onPress={showTimepicker} title="Time" />
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                                style={styles.picker}
                                minuteInterval={15}
                            />
                        )}
                        <Text>Date & Time selected: {date.toLocaleString()}</Text>
                    </SafeAreaView>
                : 
                <View>
                    <Text style={styles.subheader}>Time needed to complete task:</Text>
                    <TimePicker value={time} onChange={handleTimeNeededChange} minutesInterval={15} hoursUnit='hrs' minutesUnit='mins' />    
                </View>
            }
            {(value == null) ? <Text></Text> :<Button style={styles.button} onPress={updateEvent} title="Confirm" />}
            {(route.params.task.timeNeeded == 0) ?
            <Button style={styles.button} onPress={moreTime} title="Need more time?"/>
            : <Button style={styles.button} onPress={finishedHandler} title="Finished?" />}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        alignSelf: 'center'
    },
    subheader: {
        fontSize: 16,
        alignSelf: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#cecece',
        padding: 10,
        marginTop: 0,
        margin: 20,
        width: '100%',
        alignSelf: 'center'
    },
    button: {
        margin: 0,
        height: 20,
        backgroundColor: 'blue',
    },
    picker: {
        alignSelf: 'center'
    },
    description: {
        borderWidth: 1,
        borderColor: '#cecece',
        padding: 10,
        marginTop: 0,
        margin: 20,
        width: '100%',
        alignSelf: 'center',
        height: 200,
    }
})