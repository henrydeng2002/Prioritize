import { Button, TextInput, View, Text } from "react-native"
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AWSHelper from "./../resources/AWSHelper";

const EmailConfirmation = ({route, navigation}) => {
    var username = route.params.username;
    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState();

    // email confirmation request
    const onEmailConfirmationRequest = () => {
        if (AWSHelper.confirmSignUp({ username, code})) {
            navigation.navigate("LoginScreen");
        } else {
            setErrorMessage("Error confirming user, please check code");
        }
    }

    return (
        <View style={styles.container}>
            <Text>Please enter confirmation code:</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Code"
                    onChangeText={(text) => setCode(text.replace(" ", ""))}
                    />
            </View>
            <Text>{ errorMessage? errorMessage : ""}</Text>
            <Button
                style={styles.loginButton}
                title="Confirm"
                onPress = {onEmailConfirmationRequest} 
            />
        </View>
    );
}



const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#cecece',
        padding: 10,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: 'blue',
        width: '80%',
    }
}

export default EmailConfirmation;