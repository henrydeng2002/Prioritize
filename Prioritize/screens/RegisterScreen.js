import { Button, TextInput, View, Text } from "react-native"
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AWSHelper from "./../resources/AWSHelper";


const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState();


    const registerHandler = async () => {
        // TODO: update error handling and display
        if (email === "" || password === "" || username === "") {
            setErrorMessage("Please fill out all fields");
            return;
        } else {
            if (await AWSHelper.signUp({username, email, password})) {
                navigation.navigate("EmailConfirmation", {username: username});
            } else {
                setErrorMessage("Error registering user, please check data fields");
            }
        }
    }

    const onLoginClick = () => {
        navigation.navigate("LoginScreen");
    }

    return (
        <View style={styles.container}>
            <Text>Register</Text>
            <View style={styles.inputContainer}>
            <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(text) => setUsername(text.replace(" ", ""))}
                    />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text.replace(" ", ""))}
                    />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text.replace(" ", ""))}
                    />
                <Text>{errorMessage ? errorMessage : ""}</Text>
            </View>
            <Button
                style={styles.loginButton}
                title="Register"
                onPress = {registerHandler} 
            />
            <Button
                style={styles.loginButton}
                title="Already Have An Account?"
                onPress = {onLoginClick}
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

export default RegisterScreen;