import React from 'react';
import { Text, Block, Radio, Button } from 'galio-framework';
import { useState, TouchableOpacity, useReducer } from 'react';

function reducer(state, action) {
    switch (action.type) {
        case 'satisfaction':
            return { ...state, satisfaction: action.satisfaction === action.value ? '' : action.value };
        case 'douleur':
            return { ...state, douleur: action.douleur === action.value ? '' : action.value };
        case 'motivation':
            return { ...state, motivation: action.motivation === action.value ? '' : action.value };
        case 'tempsDeMarche':
            return { ...state, tempsDeMarche: action.value };
        case 'nbExercices':
            return { ...state, nbExercices: action.value };
        default:
            throw new Error();
    }
}


export default function Evaluation(props) {
    const [step, setStep] = useState(0);
    const { nbExercices } = props;
    const [state, dispatch] = useReducer(reducer, { satisfaction: '', douleur: '', motivation: '', tempsDeMarche: 0, nbExercices: nbExercices });
    const satisfaction = ['Très satisfait', 'Satisfait', 'Neutre', 'insatisfait', 'Très insatisfait'];
    return (
        <Block center>
            <Text h2>Rapport de suivi</Text>
            {step === 0 &&
                (<>
                    <Text h4>Sélectionner votre niveau de satisfaction :</Text>
                    <Block>
                        {satisfaction.map((s, i) => (
                            <Block key={i}>
                                <Radio
                                    label={s}
                                    initialValue={state.satisfaction === s}
                                    value={state.satisfaction === s}
                                    onChange={() => dispatch({ type: 'satisfaction', value: s })}
                                />
                                <Text>{state.satisfaction === s ? "vrai" : "faux"}</Text>
                            </Block>
                        ))}
                    </Block>
                    <Text>La valeur de satisfaction est: {state.satisfaction}</Text>
                    <Button onPress={() => { }} title="next" >Suivant </Button>
                </>)}
        </Block>
    );
}
