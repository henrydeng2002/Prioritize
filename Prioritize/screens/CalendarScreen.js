import React, { useEffect } from 'react';
import { Card } from '@rneui/themed';
import { View, Text, Button, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function CalendarScreen({navigation}) {
    
    useEffect(() => {
    }, []);

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
});
