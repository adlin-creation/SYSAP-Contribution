import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const RaccourcisExercice = ({ onPress, title }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, isPressed && styles.buttonPressed]}
    >
      <View>
        <Text style={[styles.buttonText, isPressed && styles.textPressed]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  buttonText: {
    color: "#800080",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default RaccourcisExercice;
