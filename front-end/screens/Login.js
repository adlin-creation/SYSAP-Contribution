import React, {useState} from 'react';
import {
    View,
    Pressable,
    Image,
    TextInput,
    StyleSheet
} from 'react-native';

import { Block, Text } from "galio-framework";
import { Icon } from '../components';
import CustomButton from '../components/CustomButton';

const Login = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); 
  
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


        // Define the request body
        const requestBody = {
            email: email,
            password: password,
        };
        console.log(JSON.stringify(requestBody));

        fetch('http://localhost:80/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then((response) => {
            if (response.ok) {
                // Request was successful, you can handle the response here
                console.log(response);
                navigation.navigate('App');

            } else {
                // Request failed, handle the error
                console.log('Login failed', 'Please check your credentials and try again.');
            }
        })
        .catch((error) => {
            console.log('Login failed', 'Please check your credentials and try again.');
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