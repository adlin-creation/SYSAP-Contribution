import {Text, Pressable} from 'react-native';
import React from 'react';
import { materialTheme } from '../constants';

export default function CustomButton({label, onPress}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: materialTheme.COLORS.BUTTON_COLOR,
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#fff',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}