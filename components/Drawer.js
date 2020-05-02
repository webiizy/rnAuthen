import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import materialTheme from "../constants/Theme";

const proScreens = [
  "Woman",
  "Man",
  "Kids",
  "New Collection",
  "Sign In",
  "Sign Up"
];

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Home":
        return (
          <Icon
            size={16}
            name="shop"
            family="GalioExtra"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Template":
        return (
          <Icon
            size={16}
            name="md-switch"
            family="ionicon"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      case "Sign In":
        return (
          <Icon
            size={16}
            name="ios-log-in"
            family="ionicon"
            color={focused ? "white" : materialTheme.COLORS.MUTED}
          />
        );
      default:
        return null;
    }
  };

  renderLabel = () => {
    const { title } = this.props;

    if (proScreens.includes(title)) {
      return (
        <Block middle style={styles.pro}>
          <Text size={12} color="white">
            VIP
          </Text>
        </Block>
      );
    }

    return null;
  };

  render() {
    const { focused, title, navigation } = this.props;
    const proScreen = proScreens.includes(title);
    return (
      <TouchableOpacity style={{ height: 55 }} onPress={() => {
        global.currenRouter = title
        console.log("title", title)
        navigation.navigate(title)
      }}>
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
              color={
                focused
                  ? "white"
                  : "black"
              }
            >
              {title}
            </Text>
            {this.renderLabel()}
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

export default DrawerItem;

const styles = StyleSheet.create({
  defaultStyle: {
    borderWidth: 0.5,
    borderColor: "grey",
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 3
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