import React, {useState} from 'react';
import { View, Button, Platform, StyleSheet, Switch, Text, Alert, SectionList} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.REACT_APP_API_URL;

export default class Rappel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            show: false,
            selectedDate: null,
            isSwitchOn: null,
            visible: false
        };
    }

    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        this.setState({ date: currentDate, selectedDate: selectedDate });
    }

    onSubmit = async () => {
        const { isSwitchOn, selectedDate } = this.state;

        //conversion
        const offsetMinutes = selectedDate.getTimezoneOffset();
        const localTime = new Date(selectedDate.getTime() - offsetMinutes * 60 * 1000);

        if (isSwitchOn && localTime) {
            await this.scheduleLocalNotification(localTime);
        }

        this.setState({ selectedDate: null, show: false });

        const userStorage = await AsyncStorage.getItem('user');
        const user = JSON.parse(userStorage);
        console.log(user.idPatient);
        const requestBody = {
            Frequency: 1,
            UserId: user.idPatient,
            NextReminder: localTime 
        };

        // Mettre ici ce qui se passe quand on submit
         fetch(`${apiUrl}/api/reminder/setReminder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        }).then((response)=>
            console.log("test")
        )

        this.createSingleButtonAlert("Changements sauvegardés",
         "Vous recevrez maintenant vos rappels tous les jours à " + selectedDate.toLocaleTimeString());
    }

    toggleSwitch = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Pour utiliser la fonctionalité de rappel, vous devez accepter les permissions');
          return;
        }
        this.setState((previousState) => ({
            isSwitchOn: !previousState.isSwitchOn,
        }));
    }

    createSingleButtonAlert(alertTitle, alertMessage){
        Alert.alert(alertTitle, alertMessage, [
            {text: 'Ok'}
        ])
    }


    scheduleLocalNotification = async (selectedDate) => {
        const notificationDate = new Date(selectedDate);
        const notificationContent = {
          title: 'Rappel',
          body: 'Vous avez une séance à faire',
        };
        await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: {
            hour: notificationDate.getHours(),
            minute: notificationDate.getMinutes(),
            repeats: true,
          },
        });
      };


    render() {
        const { show, date, selectedDate, isSwitchOn } = this.state;

        if (Platform.OS === "ios" || Platform.OS === "android") {
            return (
                <View style={styles.container}>
                    <View style={styles.switchContainer}>
                        <Text>Activer les rappels</Text>
                        <Switch 
                        style={styles.switch}
                        value={isSwitchOn} 
                        onValueChange={this.toggleSwitch}
                        />
                    </View>

                    {isSwitchOn ? (
                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Choisir une heure"
                                    onPress={() => this.setState({ show: true })}
                                />
                                {show && (
                                    <DateTimePicker
                                        testID='dateTimePicker'
                                        value={date}
                                        mode="time"
                                        display='default'
                                        onChange={this.onChange}
                                        disabled={!isSwitchOn}
                                    />
                                )}
                            </View>
                    ) : null}
                    {selectedDate && (
                        <View style={styles.selectedDateContainer}>
                            <Text>Selected Date: {selectedDate.toString()}</Text>
                        </View>
                    )}

                    {isSwitchOn ? (
                    <View style={styles.submitButton}>
                        <Button
                            onPress={this.onSubmit}
                            title="Sauvegarder"
                            disabled={!selectedDate}
                        />
                    </View>
                    ) : null}

                </View>
            );
        } else {
            return (
                <p>Seulement disponible sur iOS et Android pour le moment.</p>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 100,
    },
    switchContainer: {
        flexDirection:"row",
        justifyContent:"center",
        alignItems:'center',
        top:160,
        position:'absolute'
    },
    switch: {
        marginLeft: 10
    }
});