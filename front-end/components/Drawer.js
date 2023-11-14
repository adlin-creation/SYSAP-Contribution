import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import materialTheme from "../constants/Theme";

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused, screenName } = this.props;

    switch (title) {
      case "Accueil":
        return (
          <Icon
            size={16}
            name="home"
            family="entypo"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Profile":
        return (
          <Icon
            size={16}
            name="circle-10"
            family="GalioExtra"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Programme":
        return (
          <Icon
            size={16}
            name="file-text"
            family="feather"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Progression":
        return (
          <Icon
            size={16}
            name="linechart"
            family="AntDesign"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Séance":
        return (
          <Icon
            size={16}
            name="heart"
            family="AntDesign"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
        case "Évaluation":
          return (
            <Icon
              size={16}
              name="heart"
              family="AntDesign"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          );
      case "Rappel":
        return (
          <Icon
            size={16}
            name="sync"
            family="AntDesign"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Se connecter":
        return (
          <Icon
            size={16}
            name="login"
            family="entypo"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Se déconnecter":
        return (
          <Icon
            size={16}
            name="logout"
            family="AntDesign"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      default:
        return null;
    }
  };

  renderLabel = () => {
    const { title } = this.props;
    return (
      <Block middle style={styles.pro}>
        <Text size={12} color="white">
          PRO
        </Text>
      </Block>
    );
  };

  render() {
    const { focused, title, navigation } = this.props;
    return (
      <TouchableOpacity style={{ height: 55 }} onPress={() => { navigation.navigate(title) }}>
        <Block
          flex
          row
          style={[
            styles.defaultStyle,
            focused ? [styles.activeStyle, styles.shadow] : null
          ]}
        >
          <Block middle flex={0.1} style={{ marginRight: 28 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={18}
              color={focused ? "white" : "black"}
            >
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

export default DrawerItem;

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  activeStyle: {
    backgroundColor: materialTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginLeft: 8,
    borderRadius: 2,
    height: 16,
    width: 36
  }
});
