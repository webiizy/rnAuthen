import React from 'react';
import {
  ScrollView,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import {Block, Text, theme} from 'galio-framework';
import {useForm} from 'react-hook-form';
import {Button, Icon, Input, Card, Modal} from '../../components';
import {materialTheme, Images} from '../../constants';
import {StateContext, firebase} from '../../context';
import styles from './styles';
const {width, height} = Dimensions.get('screen');

const SignIn = () => {
  return (
    <Block flex center>
      <ScrollView />
    </Block>
  );
};

export default SignIn;
