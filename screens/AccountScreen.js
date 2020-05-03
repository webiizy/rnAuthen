import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
// import { LinearGradient as Gradient } from 'expo';

// galio components
import {Button, Block, Text, NavBar, theme} from 'galio-framework';
import {materialTheme} from '../constants';
import {StateContext, firebase} from '../context';
import {Icon} from '../components';
import {getDateFomat} from '../services';
const BASE_SIZE = theme.SIZES.BASE * 0.5;
const COLOR_GREY = materialTheme.COLORS.MUTED; // '#D8DDE1';
const {height} = Dimensions.get('screen');

const AccountScreen = props => {
  const {navigate} = props.navigation;
  const {user} = React.useContext(StateContext);
  const [isModalVisible, toggleModal] = useState(false);
  const [modalMess, setModalMess] = useState('');
  console.log('###AccountScreen.js###--  user', user);

  return (
    <Block safe flex>
      <Text>{JSON.stringify(user)}</Text>
      <Block
        row
        space="between"
        style={{paddingVertical: 16, alignItems: 'baseline'}}>
        <Text size={16}>Cập nhật thông tin</Text>
        <Text
          size={12}
          color={theme.COLORS.PRIMARY}
          onPress={() => {
            setModalMess(
              `Goodbye, ${user.name || user.displayName || user.email}!`,
            );
            toggleModal(true);
            global.setSpinner(true);
            firebase.auth.currentUser &&
              firebase.auth.signOut().then(() => {
                // popToTop()
                // Alert.alert('User signed out!')
                global.setSpinner(false);
              });
          }}>
          Đăng xuất
        </Text>
      </Block>
    </Block>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  group: {
    borderColor: 'transparent',
    borderRadius: 0,
    backgroundColor: 'white',
    marginTop: theme.SIZES.BASE,
  },
  card: {
    borderColor: 'transparent',
    borderRadius: 0,
    borderWidth: 1,
    paddingLeft: BASE_SIZE,
    backgroundColor: 'white',
    shadowOpacity: 1,
    marginVertical: 0.5,
    paddingVertical: BASE_SIZE,
  },
  menu: {
    width: theme.SIZES.BASE,
    borderColor: 'transparent',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: theme.SIZES.BASE,
  },
  left: {
    marginRight: theme.SIZES.BASE,
  },
  right: {
    width: theme.SIZES.BASE,
    backgroundColor: 'transparent',
    elevation: 0,
  },
});
