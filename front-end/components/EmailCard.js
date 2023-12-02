import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, Dimensions, View, Text } from 'react-native';
import { Button } from 'galio-framework';

import { postData } from '../services/EmailServices';


const { width } = Dimensions.get('screen')

const SEND_MAIL_PATH = '/api/email';

const TextInputExample = () => {

    const [objet, onChangeObjet] = React.useState('');
    const [message, onChangeMessage] = React.useState('');
    const [objetErr, setObjetErr] = React.useState('');
    const [msgErr, setMsgErr] = React.useState('');
    const [msgSucces, setMsgSucces] = React.useState('');
    const [msgFail, setMsgFail] = React.useState('');

    const EffacerForm = () => {
        onChangeMessage('');
        onChangeObjet('');
    }
    const effacerObjetErr = () => {
        setObjetErr('')
    }
    const effacerMsgErr = () => {
        setMsgErr('')
    }

    const validerForm = () => {
        let valide = true
        if (objet.length <= 0) {
            setObjetErr('objet ne peut pas etre vide')
            valide = false;
        }
        if (message.length <= 0) {
            setMsgErr('message ne peut pas etre vide');
            valide = false;
        }
        return valide;
    };
    const envoyerReq = async () => {
        if (validerForm()) {

            const data = { subject: objet, message: message, senderId: localStorage.userId };
            const status = await postData(SEND_MAIL_PATH, data);
            if (status.error) {
                setMsgFail(status.error);
                setTimeout(() => setMsgFail(''), 10000);
            } else {
                setMsgSucces(status.msg);
                setTimeout(() => setMsgSucces(''), 10000);
            }
        }
    };

    return (
        <SafeAreaView>
            <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Text style={styles.headerText}>Contacter votre professionnel</Text>
                </View>
                <View style={styles.cardBody}>
                    <TextInput
                        style={styles.input}
                        placeholder='Objet'
                        onChangeText={onChangeObjet}
                        value={objet}
                        onKeyPress={effacerObjetErr}
                    />
                    <Text style={styles.errorText}>{objetErr}</Text>
                    <TextInput
                        style={styles.msg}
                        editable
                        multiline
                        numberOfLines={7}
                        maxLength={770}
                        placeholder='votre message'
                        onChangeText={onChangeMessage}
                        onKeyPress={effacerMsgErr}
                        value={message}
                    />
                    <Text style={styles.errorText}>{msgErr}</Text>

                    <View style={styles.buttonRow}>
                        <Button
                            style={styles.button}
                            onPress={envoyerReq}
                            color='#088c4f'
                        >
                            envoyer
                        </Button>

                        <Button
                            style={styles.button}
                            color='#c7044f'
                            onPress={EffacerForm}
                        >
                            Effacer
                        </Button>
                    </View>
                </View>
            </View>
            <Text style={styles.failText}>{msgFail}</Text>
            <Text style={styles.succText}>{msgSucces}</Text>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: '#D1C4E9',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: width - 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        backgroundColor: '#4f024f',
        padding: 12,
        borderBottomWidth: 0,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        alignSelf: 'center',
    },
    cardBody: {
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#fad7e4'
    },
    msg: {
        backgroundColor: '#fad7e4',
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    errorText: {
        color: 'red',
        marginLeft: 12,
    },
    button: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#BA68C8',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    succText: {
        backgroundColor: 'green',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingLeft: 15
    },
    failText: {

        backgroundColor: 'red',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingLeft: 15
    }
});

export default TextInputExample;
