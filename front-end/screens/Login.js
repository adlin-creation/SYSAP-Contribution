import React from 'react';
import {
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import { Block, Text } from "galio-framework";
import InputField from "../components/InputField";
import { Button, Icon } from '../components';

export default class Login extends React.Component {
    render() {
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
                    label={'Email ID'}
                    icon={
                        <Icon
                        size={16}
                        name="ios-log-in"
                        family="ionicon"
                        color={"white"}
                        />
                    }
                    keyboardType="email-address"
                    />

                    <InputField
                    label={'Password'}
                    icon={
                        <Icon
                        size={16}
                        name="ios-log-in"
                        family="ionicon"
                        color={"white"}
                        />
                    }
                    inputType="password"
                    fieldButtonLabel={"Forgot?"}
                    fieldButtonFunction={() => {}}
                    />
                    
                    <Button label={"Login"} onPress={() => {}} />

                    <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 30,
                    }}>
                    <Text>New to the app?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{color: '#AD40AF', fontWeight: '700'}}> Register</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Block>
        );
    }
}