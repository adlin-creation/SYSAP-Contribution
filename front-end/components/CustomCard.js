import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, theme } from 'galio-framework';
import { putData } from '../services/apiServices';
import Imprimer from "../components/imprimer/print.js";

const { width } = Dimensions.get('screen');
const DATE_FORMAT = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
};


const CustomCard = ({ programData }) => {
    const [showExercises, setShowExercises] = useState(programData != undefined && programData.startDate != undefined && programData.startDate != '');
    const startProgram = async () => {
        const path = `/api/programEnrollment/user/startDate`;
        const data = { userId: programData.patient.id };
        try {
            await putData(path, data);
            // On success, refresh the rendering by showing exercises
            setShowExercises(true);
        } catch (error) {
            console.error('Error starting program:', error);
        }
    };

    const numberExercices = programData != undefined ? programData.program.numberExercices : 0;

    const renderProgramDates = () => {
        if (programData != undefined && showExercises && numberExercices > 0) {
            let startDate = startDate == null ? new Date() : new Date(programData.startDate);
            let endDate = new Date(startDate).setDate(startDate.getDate() + programData.program.duration);
            let today = new Date();
            let nbDaysLeft = Math.round((endDate - today) / (1000 * 60 * 60 * 24));
            let unite = 'jours'

            if (nbDaysLeft == 1) {
                unite = 'jour'
            } else if (nbDaysLeft == 0) {
                unite = 'ceci est votre dernier jour dans le programme'
            }

            let nbDaysLeftinfos = `${nbDaysLeft} ${unite}`

            if (nbDaysLeft < 0) {
                nbDaysLeftinfos = 'vous avez dépassé la date de fin de votre programme'
            }

            return (
                <View>
                    <Text style={styles.bodyText}>
                        <Text style={styles.keyText}>Date du debut:</Text> {startDate.toLocaleString('fr-FR', DATE_FORMAT)}
                    </Text>
                    <Text style={styles.bodyText}>
                        <Text style={styles.keyText}>Date de fin:</Text> {new Date(endDate).toLocaleString('fr-FR', DATE_FORMAT)}
                    </Text>
                    <Text style={styles.bodyText}>
                        <Text style={styles.keyText}>Nombre de jours restants:</Text> {nbDaysLeftinfos}

                    </Text>
                </View>
            );

        } else {
            return (<Text></Text>);
        }
    }

    const renderExerciseButtons = () => {
        if (programData != undefined && showExercises && numberExercices > 0) {
            // Group buttons into rows of 2
            let rows = [];
            for (let i = 0; i < numberExercices; i += 2) {
                let row = (
                    <View key={i} style={styles.buttonRow}>
                        <Button shadowless
                            style={[styles.buttonExercice, { marginRight: theme.SIZES.BASE }]}
                            color='#088c4f' key={i + 1} onPress={() => { }}>
                            {`Exercise ${i + 1}`}
                        </Button>
                        {i + 1 < numberExercices && <Button shadowless
                            style={styles.buttonExercice}
                            color='#088c4f' key={i + 2} onPress={() => { }}>
                            {`Exercise ${i + 2}`}
                        </Button>}
                    </View>
                );
                rows.push(row);
            }
            return rows;
        } else {
            return (
                <View style={styles.buttonCommencer}>
                    <Button style={styles.buttonCommencer} color='#088c4f' onPress={() => { startProgram() }}>
                        Débuter le programme
                    </Button>
                </View>
            );
        }
    };

    const render = () => {
        if (programData != undefined) {
            return (
                <View style={styles.cardContainer}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.headerText}>{programData.program.name}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={styles.bodyText}>
                            <Text style={styles.keyText}>Description:</Text> {programData.program.description}
                        </Text>
                        <Text style={styles.bodyText}>
                            <Text style={styles.keyText}>Durée:</Text> {programData.program.duration} jours
                        </Text>
                        <Text style={styles.bodyText}>
                            <Text style={styles.keyText}>Date d'enregistrement:</Text> {new Date(programData.enrollmentDate).toLocaleString('fr-FR', DATE_FORMAT)}
                        </Text>
                        {renderProgramDates()}
                        {/* Conditionally render exercise buttons or the start program button */}
                        {renderExerciseButtons()}

                        <View style={{ alignSelf: 'center', width: 200 }}>
                            <Imprimer type={"programme"} />
                        </View>
                    </View>

                </View>
            );
        } else {
            return (
                <View style={styles.cardContainer}>
                    <View style={styles.cardHeader}>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={styles.bodyText}>
                            <Text style={styles.keyText}>Erreur:</Text> Données introuvables
                        </Text>
                    </View>
                </View>
            )
        }
    }

    return (
        <View>
            {render()}
        </View>
    )
};

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: '#D1C4E9',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // Almost transparent body
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
        color: '#FFFFFF', // White text for contrast
        alignSelf: 'center',
    },
    cardBody: {
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // Matching the body's almost transparent style
    },
    bodyText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#000000', // Black text for readability
    },
    keyText: {
        fontWeight: 'bold',
    },
    buttonImprimer: {
        width: width * 0.5,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4f024f',
        shadowRadius: 4,
        shadowOpacity: 0.1,
        alignSelf: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonCommencer: {
        width: width * 0.5,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#AB47BC',
        shadowRadius: 4,
        shadowOpacity: 0.1,
        alignSelf: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonExercice: {
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
        justifyContent: 'space-between'
    },
});

export default CustomCard;
