import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import { Input, Block, Text } from "galio-framework";

import { argonTheme } from "../constants";

const InputForm = props => {
  const { shadowless, success, error, id, errors, setValue, triggerValidation } = props;
  const inputStyles = [
    styles.input,
    !shadowless && styles.shadow,
    success && styles.success,
    error || (errors && errors[id]) && styles.error,
    { ...props.style }
  ];

  return (
    [
      <Input
        key={0}
        placeholder="write something here"
        placeholderTextColor={argonTheme.COLORS.MUTED}
        style={inputStyles}
        color={argonTheme.COLORS.HEADER}
        onChangeText={text => {
          setValue(id, text)
          triggerValidation && triggerValidation(id)
        }}
        // autoFocus={true}
        {...props}
      />,
      <Block key={1} row style={styles.error_message}>
        <Text bold size={12} color={argonTheme.COLORS.ERROR}>
          {(errors && errors[id] && errors[id].message || '')}</Text>
      </Block>
    ]
  );
}


InputForm.defaultProps = {
  shadowless: false,
  success: false,
  error: false
};

InputForm.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool
}

const styles = StyleSheet.create({
  input: {
    borderColor: argonTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  success: {
    borderColor: argonTheme.COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: argonTheme.COLORS.INPUT_ERROR,
  },
  shadow: {
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  error_message: {
    paddingLeft: 15,
  },
});

export default InputForm;
