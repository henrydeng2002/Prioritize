import React, {useState} from 'react';
import { Text, SafeAreaView, StyleSheet, Button, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AWSHelper from '../resources/AWSHelper';
import { TimePicker, ValueMap } from 'react-native-simple-time-picker';

export default function CreateTime({navigation}) {
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

    const confirmTime = () => {
        if (time.hours == 0 && time.minutes == 0) {
            Alert.alert('Error', 'Insufficient time', [
                { text: 'OK' }
            ]);
        } else if (value == null || value.length == 0) {
            Alert.alert('Error', 'Please choose at least one category', [
                { text: 'OK' }
            ]);
        } else {
            var date = new Date()
            AWSHelper.createTimeSlot(date, time, value);
            navigation.navigate("Confirm tasks", {date: date.toISOString()});
        }
    }

    return (
        <SafeAreaView>
            <Text style={styles.header}>How much time do you have?</Text>
            <TimePicker value={time} onChange={handleTimeNeededChange} minutesInterval={15} hoursUnit='hrs' minutesUnit='mins' />
            <Text style={styles.header}>What type of work are you doing?</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                multiple={true}
                placeholder={'Choose a category.'}
            />
            <Button style={styles.button} title="Confirm" onPress={confirmTime}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
    },
    button: {
        margin: 0,
        height: 20,
        backgroundColor: 'blue',
    },
})