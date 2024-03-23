import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CalendarScreen from './screens/CalendarScreen';
import EmailConfirmation from './screens/EmailConfirmation';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TaskOverviewScreen from './screens/TaskOverviewScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import TaskCreationScreen from './screens/TaskCreationScreen';

import React from "react";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            gestureEnabled: false,
            headerShown: true,
            headerLeft: () => <></>,
          }}
        /> 
        <Stack.Screen
          name="Confirm Email"
          component={EmailConfirmation}
          options={{
            gestureEnabled: false,
            headerShown: true,
            headerLeft: () => <></>,
          }}
        /> 
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            gestureEnabled: false,
            headerShown: true,
            headerLeft: () => <></>,
          }}
        /> 
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{
            gestureEnabled: false,
            headerShown: false,
            headerLeft: () => <></>,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainScreen() {
  return (
  <Tab.Navigator>
    <Tab.Screen name="Calendar" component={Calendar} />
    <Tab.Screen name="Tasks" component={Task}/>
  </Tab.Navigator>)
}

function Calendar() {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          headerLeft: () => <></>,
        }}
      />
    </Stack.Navigator>
  )
}

function Task() {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name="Task Overview"
        component={TaskOverviewScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="Task Detail"
        component={TaskDetailScreen}
        options={{
          //gestureEnabled: false,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Create a Task"
        component={TaskCreationScreen}
        // options={{
        //   gestureEnabled: false,
        //   headerShown: true,
        //   headerLeft: () => <></>,
        // }}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
