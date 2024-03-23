import { Button, TextInput, View, Text } from "react-native"
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AWSHelper from "./../resources/AWSHelper";

const LoginScreen = ({navigation}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState();

    const loginHandler = async () => {
        // TODO: update error handling and display
        if (username === "" || password === "") {
            setError("Please fill out all fields");
        } else {
            if (await AWSHelper.signIn({username, password})) {
                navigation.navigate("MainScreen");
            } else {
                setError("Error logging in, please check data fields");
            }
        }
        
    }

    const onRegisterRequest = () => {
        navigation.navigate("Register");
    }

    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(text) => setUsername(text.replace(" ", ""))}
                    />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text.replace(" ", ""))}
                    />
            </View>
            <Text>{error ? error : ""}</Text>
            <Button
                style={styles.loginButton}
                title="Login"
                onPress = {loginHandler} 
            />
            <Button
                style={styles.loginButton}
                title="Don't Have An Account?"
                onPress = {onRegisterRequest} 
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

export default LoginScreen;