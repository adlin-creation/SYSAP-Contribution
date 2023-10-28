import React, {useState} from 'react';
import {
    CheckBox,
    View,
    Pressable,
    Image,
    StyleSheet
} from 'react-native';

import { Block, Text } from "galio-framework";
import InputField from "../components/InputField";
import { Icon } from '../components';
import CustomButton from '../components/CustomButton';

const Login = ({navigation}) => {
    const [isSelected, setSelection] = useState(false);
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
                Connection
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
                    name="lock-closed-outline"
                    family="ionicon"
                    color={"black"}
                    />
                }
                inputType="password"
                fieldButtonLabel={"Oublié?"}
                fieldButtonFunction={() => {}}
                />

                <View style={styles.checkboxContainer}>
                    <CheckBox
                    value={isSelected}
                    onValueChange={setSelection}
                    style={styles.checkbox}
                    />
                    <Text style={styles.label}>Je suis le proche aidant</Text>
                </View>

                {/* <InputField
                label={'Code patient'}
                icon={<Icon
                    size={16}
                    name="barbell-outline"
                    family="ionicon"
                    color={"black"}
                    />}  
                /> */}
                
                <CustomButton label={'Se connecter'} onPress={() => {navigation.navigate('App')}} />

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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    checkbox: {
      alignSelf: 'center',
    },
    label: {
      margin: 8,
    },
  });

export default Login;