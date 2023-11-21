import React, { useState, useEffect } from 'react';
import {
    View,
    Pressable,
    Image,
    TextInput,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Text } from "galio-framework";
import { Icon } from '../components';
import CustomButton from '../components/CustomButton';

const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); 

    useEffect(() => {
        // Inside the useEffect, you can get the token from AsyncStorage
        const getToken = async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            if (token !== null) {
                // Token found in AsyncStorage, you can proceed with authentication or other actions
                console.log('Token: ', token);
                // Replace with your authentication logic
                navigation.navigate('App');
            } else {
                return;
            }
          } catch (error) {
                console.error('Error fetching token:', error);
          }
        };
    
        getToken();
      }, []);
  
    const validateForm = () => { 
        let errors = {}; 
  
        if (!email || !password) { 
            errors.name = 'Tous les champs sont nécessaires.'; 
        } else if (!/\S+@\S+\.\S+/.test(email)) { 
            errors.email = 'Email invalide.'; 
        }
  
        setErrors(errors); 
        if (Object.keys(errors).length > 0) { 
            return false;
        }
        return true;
    };

    const handleLogin = () => {
        if (!validateForm()) return;
        let errors = {}; 
        setErrors({});

        const requestBody = {
            email: email,
            password: password,
        };

        fetch('http://localhost:80/api/auth/login', {
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
                throw new Error('missing token');
            }
            await AsyncStorage.setItem('userToken', responseData.token);

            navigation.navigate('App');
        })
        .then(async (data) =>{
            if (!data.token) {
                errors.failed = 'Connection échouée'
                setErrors(errors);
            }
            
            AsyncStorage.setItem('userToken', data.token);
            navigation.navigate('App');
        })
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                errors.failed = 'Failed to connect to the server'
              } else { 
                errors.failed = 'Connection échouée'
            }
            setErrors(errors);
            return;
        });
    };

    return (
        <Block style={{flex: 1, justifyContent: 'center'}}>
            <View style={{paddingHorizontal: 25}}>
                <View style={{alignItems: 'center'}}>
                    <Image
                        source={require('../assets/images/login-logo.jpg')}
                        style={{ height: 300, width: 300 }}
                    />
                </View>

                <Text style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 28,
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: 30,
                }}>
                Connection
                </Text>

                <View style={styles.container}>
                    <Icon
                    size={16}
                    name="mail-outline"
                    family="ionicon"
                    color={"black"}
                    />
                    <TextInput
                    placeholder={'email'}
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                    />
                </View>

                <View style={styles.container}>
                    <Icon
                    size={16}
                    name="lock-closed-outline"
                    family="ionicon"
                    color={"black"}
                    />
                    <TextInput
                    placeholder={'mot de passe'}
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                    inputType="password"
                    // fieldButtonLabel={"Oublié?"}
                    // fieldButtonFunction={() => {}}
                    />
                </View>
                
                <CustomButton label={'Se connecter'} onPress={handleLogin} />

                {Object.values(errors).map((error, index) => ( 
                    <Text key={index} style={styles.error}> 
                        {error} 
                    </Text> 
                ))} 

                <View style={styles.container}>
                    <Text>Nouveau sur Sysap?</Text>
                    <Pressable onPress={() => navigation.navigate('Register')}>
                        <Text style={{color: '#AD40AF', fontWeight: '700'}}> Inscription</Text>
                    </Pressable>
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
    error: { 
        color: 'red', 
        textAlign: 'center',
        fontSize: 14, 
        marginBottom: 12, 
    },
});

export default Login;