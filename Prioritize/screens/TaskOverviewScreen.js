import { Pressable, ScrollView, Text } from "react-native";
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function TaskOverviewScreen({route, navigation}) {
    const onTaskSelect = () => {
        navigation.navigate("Task Detail");
    } 
    return(
        <ScrollView>
            <Pressable onPress={onTaskSelect}>
                <Card>
                    <Card.Title>
                        Sample Event
                    </Card.Title>
                    <Text>
                        Info
                    </Text>
                </Card>
            </Pressable>
        </ScrollView>
        
    )
}