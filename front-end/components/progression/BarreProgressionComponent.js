import React, { Component } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Text, View, StyleSheet } from "react-native";

class BarreProgressionComponent extends Component {
  calculateFill = () => {
    const { sessionsCompleted, totalSessions } = this.props;
    if (!sessionsCompleted || !totalSessions || totalSessions === 0) return 0;
    return (sessionsCompleted / totalSessions) * 100;
  };

  render() {
    const fillPercentage = this.calculateFill();
    const { sessionsCompleted, totalSessions } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={150}
            width={15}
            fill={fillPercentage}
            tintColor="#F4902B"
            backgroundColor="#E1DEDB"
            lineCap="round"
          >
            {() => (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={styles.sessionText}
                >{`${sessionsCompleted} / ${totalSessions}`}</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  progressContainer: {
    transform: [{ rotate: "-90deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  sessionText: {
    fontSize: 38,
    color: "#615F5F",
    transform: [{ rotate: "90deg" }],
  },
});

export default BarreProgressionComponent;
