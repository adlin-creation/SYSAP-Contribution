import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, TextInput, Alert, StyleSheet } from 'react-native';

import { Block, Text } from "galio-framework";
import { Icon } from '../components';

export default Register = ({ navigation }) => {
    const [name, setName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassowrd] = useState('');
    const [errors, setErrors] = useState({}); 
  
    const validateForm = () => { 
        let errors = {}; 
  
        if (!name || !familyName || !email || !password || !confirmPassword) { 
            errors.name = 'Tous les champs sont nécessaires.'; 
        } else if (!/\S+@\S+\.\S+/.test(email)) { 
            errors.email = 'Email invalide.'; 
        } else if (password !== confirmPassword) { 
            errors.password = 'Le mot de passe ne correspond pas à la confirmation.'; 
        } 
  
        setErrors(errors); 
        if (Object.keys(errors).length > 0) { 
            return false;
        }
        return true;
    };

    const handleRegisteration = () => {
        if (!validateForm()) return;

        const requestBody = {
            name: name,
            familyName: familyName,
            email: email,
            password: password,
        };

        fetch('http://localhost:80/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Request failed');
            }
        })
        .then(async (responseData) => 
        {
            if(!responseData.token) {
                throw new Error('Login failed');
            }
            await AsyncStorage.setItem('userToken', responseData.token);
            navigation.navigate('App');
        })
        .catch((error) => {
            console.log('Login failed', 'Please check your credentials and try again.');
        });
    };

    return (
        <Block style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ paddingHorizontal: 25, alignItems: 'center' }}>
                <Image
                source={require('../assets/images/login-logo.jpg')} // Replace with your actual image import
                style={{ height: 300, width: 300 }}
                />

                <Text
                style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 28,
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: 30,
                }}>
                Inscription
                </Text>

                <View style={styles.container}>
                    <Icon
                        size={16}
                        name="body-outline"
                        family="ionicon"
                        color={"black"}
                        />
                    <TextInput
                    placeholder='Prénom'
                    value={name}
                    onChangeText={setName}
                    />
                </View>

                <View style={styles.container}>
                    <Icon
                        size={16}
                        name="body-outline"
                        family="ionicon"
                        color={"black"}
                        />
                    <TextInput
                    placeholder='Nom de famille'
                    value={familyName}
                    onChangeText={setFamilyName}
                    />
                </View>

                <View style={styles.container}>
                    <Icon
                        size={16}
                        name="mail-outline"
                        family="ionicon"
                        color={"black"}
                        />
                    <TextInput
                    placeholder={'Email'}
                    value={email}
                    onChangeText={setEmail}
                    inputType="email-address" />
                </View>

                <View style={styles.container}>
                    <Icon
                        size={16}
                        name="lock-closed-outline"
                        family="ionicon"
                        color={"black"}
                        />
                    <TextInput
                    placeholder='Mot de passe'
                    value={password}
                    onChangeText={setPassword}
                    inputType="password" />
                </View>

                <View style={styles.container}>
                    <Icon
                        size={16}
                        name="lock-closed-outline"
                        family="ionicon"
                        color={"black"}
                    />
                    <TextInput
                    placeholder='Confirmez le mot de passe'
                    value={confirmPassword}
                    onChangeText={setConfirmPassowrd}
                    inputType="password" />
                </View>
                <TouchableOpacity 
                style={styles.button} 
                onPress={handleRegisteration} 
                > 
                    <Text style={styles.buttonText}>Se connecter</Text> 
                </TouchableOpacity> 
                
                {Object.values(errors).map((error, index) => ( 
                    <Text key={index} style={styles.error}> 
                        {error} 
                    </Text> 
                ))} 

                <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                }}>
                    <Text>Déjà inscrit?</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ color: '#AD40AF', fontWeight: '700' }}> Connection</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Block>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
    },
    input: { 
        height: 60, 
        borderColor: '#ccc', 
        borderWidth: 1, 
        marginBottom: 12, 
        paddingHorizontal: 10, 
        borderRadius: 8, 
        fontSize: 16, 
    }, 
    button: { 
        backgroundColor: '#AD40AF', 
        borderRadius: 8, 
        paddingVertical: 10, 
        alignItems: 'center', 
        marginTop: 16, 
        marginBottom: 12, 
    }, 
    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16, 
    }, 
    error: { 
        color: 'red', 
        textAlign: 'center',
        fontSize: 14, 
        marginBottom: 12, 
    },
});