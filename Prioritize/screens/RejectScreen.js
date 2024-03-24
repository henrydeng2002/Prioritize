import { View, Text, Button, Pressable, ScrollView, StyleSheet } from 'react-native';
import React, {useState, useEffect} from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import AWSHelper from '../resources/AWSHelper';
import { TimePicker, ValueMap } from 'react-native-simple-time-picker';

export default function RejectScreen ({route, navigation}) {
    const [tasks, setTasks] = useState();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    const [time, setTime] = useState({
        hours: 1,
        minutes: 0,
        seconds: 0,
    });

    const handleTimeNeededChange = (newValue: ValueMap) => {
        setTime(newValue);
    };

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

        for (var i = 0; i < t.length; i++) {
            items.push({
                label: t[i].title,
                value: t[i].eventID
            })
        }

    }

    const confirm = () => {
        AWSHelper.addTimeSlot(time, value);
        navigation.navigate("CalendarScreen");
    }

    return (
        <View>
        <Text>Choose a task to work on</Text>
        <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder={'Choose a field to edit'}
            />
        <Text>Choose a duration:</Text>
        <TimePicker value={time} onChange={handleTimeNeededChange} minutesInterval={15} hoursUnit='hrs' minutesUnit='mins' />
        <Button style={styles.button} title="Confirm" onPress={confirm}/>
        </View>

    )

}

const styles = StyleSheet.create({

    button: {
        margin: 0,
        height: 20,
        backgroundColor: 'blue',
    },
});