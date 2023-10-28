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

                <InputField
                label={'Prénom'}
                icon={<Icon
                    size={16}
                    name="body-outline"
                    family="ionicon"
                    color={"black"}
                    />} 
                />

                <InputField
                label={'Nom de famille'}
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
                label={'Code patient'}
                icon={<Icon
                    size={16}
                    name="barbell-outline"
                    family="ionicon"
                    color={"black"}
                    />}  
                />

                <InputField
                label={'Mot de passe'}
                icon={<Icon
                    size={16}
                    name="lock-closed-outline"
                    family="ionicon"
                    color={"black"}
                    />} 
                inputType="password" />

                <InputField
                label={'Confirmez le mot de passe'}
                icon={<Icon
                    size={16}
                    name="lock-closed-outline"
                    family="ionicon"
                    color={"black"}
                    />} 
                inputType="password" />

                <CustomButton label={"S'inscrire"} onPress={() => {navigation.navigate('App')}} />

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