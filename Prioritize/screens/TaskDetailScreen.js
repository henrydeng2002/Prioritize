import { useNavigation } from '@react-navigation/native';
import {Text, StyleSheet} from 'react-native';

export default function TaskDetailScreen() {
    return (
        <Text style={styles.header}>Task Detail</Text>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        alignSelf: 'center'
    }
})