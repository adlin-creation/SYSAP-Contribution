import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import { Block, Text } from "galio-framework";
import InputField from '../components/InputField';
import Button from '../components/Button'; // Assuming you have a custom Button component
import { Icon } from '../components';
import CustomButton from '../components/CustomButton';

export default Register = ({ navigation }) => {
    return (
        <Block style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ paddingHorizontal: 25, alignItems: 'center' }}>
                <Image
                source={require('../assets/images/login-logo.jpg')} // Replace with your actual image import
                style={{ height: 300, width: 300, transform: [{ rotate: '-5deg' }] }}
                />

                <Text
                style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 28,
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: 30,
                }}>
                Register
                </Text>

                <InputField
                label={'prénom'}
                icon={<Icon
                    size={16}
                    name="body-outline"
                    family="ionicon"
                    color={"black"}
                    />} 
                />

                <InputField
                label={'nom de famille'}
                icon={<Icon
                    size={16}
                    name="body-outline"
                    family="ionicon"
                    color={"black"}
                    />} 
                />

                <InputField
                label={'Email'}
                icon={<Icon
                    size={16}
                    name="mail-outline"
                    family="ionicon"
                    color={"black"}
                    />}  
                keyboardType="email-address" />

                <InputField
                label={'mot de passe'}
                icon={<Icon
                    size={16}
                    name="shield-outline"
                    family="ionicon"
                    color={"black"}
                    />} 
                inputType="password" />

                <InputField
                label={'Confirmez le mot de passe'}
                icon={<Icon
                    size={16}
                    name="shield-outline"
                    family="ionicon"
                    color={"black"}
                    />} 
                inputType="password" />

                <CustomButton label={'Inscription'} onPress={() => {navigation.navigate('App')}} />

                <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                }}>
                <Text>Déjà inscrit?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: '#AD40AF', fontWeight: '700' }}> Login</Text>
                </TouchableOpacity>
                </View>
            </View>
        </Block>
    );
}