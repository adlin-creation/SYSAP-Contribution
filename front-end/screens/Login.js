import React from 'react';
import {
  View,
  Pressable,
  Image,
} from 'react-native';

import { Block, Text } from "galio-framework";
import InputField from "../components/InputField";
import { Icon } from '../components';
import CustomButton from '../components/CustomButton';

const Login = ({navigation}) => {
    return (
        <Block style={{flex: 1, justifyContent: 'center'}}>
            <View style={{paddingHorizontal: 25}}>
                <View style={{alignItems: 'center'}}>
                    <Image
                        source={require('../assets/images/login-logo.jpg')}
                        style={{ height: 300, width: 300 }}
                    />
                </View>

                <Text
                style={{
                    fontFamily: 'Roboto-Medium',
                    fontSize: 28,
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: 30,
                }}>
                Login
                </Text>

                <InputField
                label={'email'}
                icon={
                    <Icon
                    size={16}
                    name="mail-outline"
                    family="ionicon"
                    color={"black"}
                    />
                }
                keyboardType="email-address"
                />

                <InputField
                label={'mot de passe'}
                icon={
                    <Icon
                    size={16}
                    name="shield-outline"
                    family="ionicon"
                    color={"black"}
                    />
                }
                inputType="password"
                fieldButtonLabel={"Oublié?"}
                fieldButtonFunction={() => {}}
                />
                
                <CustomButton label={'Login'} onPress={() => {navigation.navigate('App')}} />

                <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                }}>
                <Text>Nouveau sur Sysap?</Text>
                <Pressable onPress={() => navigation.navigate('Register')}>
                    <Text style={{color: '#AD40AF', fontWeight: '700'}}> Inscription</Text>
                </Pressable>
                </View>
            </View>
        </Block>
    );
}

export default Login;