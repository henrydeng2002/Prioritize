import { useNavigation } from '@react-navigation/native';
import { Text, StyleSheet, View, TextInput, Button, SafeAreaView, ScrollView, Alert } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import React, { useState } from 'react';
import AWSHelper from '../resources/AWSHelper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimePicker, ValueMap } from 'react-native-simple-time-picker';

export default function TaskCreationScreen({ navigation }) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

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

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    const loadData = () => {
        var categories = AWSHelper.getTaskCategories();
        var temp = []
        for (var i = 0; i < categories.length; i++) {
            var cat = {
                label: categories[i],
                value: categories[i]
            }
            temp.push(cat);
        }
        setItems(temp);
    }

    const createCategory = () => {
        if (newCategory != null || newCategory != '') {
            console.log("new category: " + newCategory)
            AWSHelper.createCategory(newCategory);
            loadData();
        }
    }

    const createEvent = () => {
        //if ()
        var dateString = date.toISOString();

        if (dateString == null || dateString == '' || value == null || value == '' || name == null || name == '') {
            createAlert('Please complete all fields');
        } else if (date < new Date()) {
            createAlert('Please enter a date after current time');
        } else {
            AWSHelper.createTask({dateTime: dateString, category: value, title: name, description: description, time: time});
            navigation.navigate("Task Overview");
        }
    }

    const createAlert = (body) =>
        Alert.alert('Error', body, [
            { text: 'OK' }
        ]);

    return (
        <ScrollView>
            <Text style={styles.header}>Create a Task</Text>
            {/* </View>
        <View> */}
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder={'Choose a category.'}
            />
            <TextInput
                style={styles.input}
                placeholder="Create a new category"
                onChangeText={(text) => setNewCategory(text)}
            />
            <Button
                style={styles.button}
                title="Create"
                onPress={createCategory}
            />
            <Text style={styles.subheader}>Task name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter a name"
                onChangeText={(text) => setName(text)}
            />
            <Text style={styles.subheader}>Due on:</Text>
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
                    />
                )}
                <Text>Date & Time selected: {date.toLocaleString()}</Text>
            </SafeAreaView>
            <Text></Text>
            <Text style={styles.subheader}>Time needed to complete task:</Text>
            <TimePicker value={time} onChange={handleTimeNeededChange} minutesInterval={15} hoursUnit='hrs' minutesUnit='mins' />
            <Text></Text>
            <Text style={styles.subheader}>Description:</Text>
            <TextInput
                style={styles.description}
                placeholder="Description (optional)"
                onChangeText={(text) => setDescription(text)}
            />
            <Button
                title="Confirm"
                style={styles.button}
                onPress={createEvent}
            />
        </ScrollView>
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