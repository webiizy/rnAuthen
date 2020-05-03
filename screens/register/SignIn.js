import React, {useState, useEffect} from 'react';
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

const SignIn = props => {
  const {navigate} = props.navigation;
  const [waiting, setWaiting] = useState(false);
  const {register, handleSubmit, setValue, errors, triggerValidation} = useForm(
    {
      defaultValues: {
        email: 'minh.ha@spt.vn',
        password: '123456',
      },
    },
  );
  const {user} = React.useContext(StateContext);
  const [isModalVisible, toggleModal] = useState(false);
  const [modalMess, setModalMess] = useState('');

  const onSubmit = data => {
    console.log('onSubmit');
    try {
      firebase.auth
        .signInWithEmailAndPassword(data.email, data.password)
        .then(() => {
          console.log('Login thanh cong -----------');
          firebase.getDocument('users', firebase.getUid(), doc => {
            console.log('doc', doc._data);
            if (doc.exists) {
              setModalMess(`Welcome, ${doc._data.name || doc._data.email}!`);
            } else {
              setModalMess('Cannot find this user!');
            }
            global.setSpinner(false);
            toggleModal(true);
            setWaiting(false);
          });
        })
        .catch(error => {
          console.log('Login error -----------', error);
        });
    } catch (error) {
      console.log('Submit login email failed', error);
    }
  };
  useEffect(() => {
    register('email', {
      required: 'Vui lòng nhập email',
      pattern: {
        value: /^\s+$|^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Email không hợp lệ',
      },
    });
    register('password', {
      required: 'Vui lòng nhập mật khẩu',
      minLength: {
        value: 6,
        message: 'Mạt khẩu quá ngắn',
      },
    });
  }, []);
  return (
    <Block flex center>
      <ScrollView>
        {/* Social Login */}
        <Block flex={0.25} middle style={styles.socialConnect}>
          <Text color="#8898AA" size={12}>
            Đăng nhập với mạng xã hội{' '}
          </Text>
          <Block row style={{marginTop: theme.SIZES.BASE}}>
            <Button
              style={{
                ...styles.socialButtons,
                marginRight: 30,
                backgroundColor: theme.COLORS.FACEBOOK,
              }}
              onPress={
                waiting
                  ? () => {}
                  : () => {
                      setWaiting(true);
                      global.setSpinner(true);
                      firebase.loginWithFaceBook(onLoginHandle);
                    }
              }>
              <Block row>
                <Icon
                  name="logo-facebook"
                  family="Ionicon"
                  size={15}
                  color={'white'}
                  style={{marginTop: 3, marginRight: 5}}
                />
                <Text style={styles.socialTextButtons}>FACEBOOK</Text>
              </Block>
            </Button>
            <Button
              style={{
                ...styles.socialButtons,
                backgroundColor: materialTheme.COLORS.ERROR,
              }}
              onPress={
                waiting
                  ? () => {}
                  : () => {
                      setWaiting(true);
                      global.setSpinner(true);
                      firebase.loginWithGoogle(onLoginHandle);
                    }
              }>
              <Block row>
                <Icon
                  name="logo-google"
                  family="Ionicon"
                  size={15}
                  color={'white'}
                  style={{marginTop: 3, marginRight: 5}}
                />
                <Text style={styles.socialTextButtons}>GOOGLE</Text>
              </Block>
            </Button>
          </Block>
        </Block>
        {/* Social Login */}
        <Block flex style={styles.formInput}>
          <Block flex={0.17} middle>
            <Text color="#8898AA" size={12}>
              Hoặc đăng nhập với email{' '}
            </Text>
          </Block>

          <Block flex center>
            <KeyboardAvoidingView
              style={{flex: 1, marginTop: theme.SIZES.BASE * 0.75}}
              behavior="padding"
              enabled
            />
            <Block style={styles.blockInput}>
              <Input
                rounded
                placeholder="Email"
                iconContent={
                  <Icon
                    size={16}
                    color={materialTheme.COLORS.ICON}
                    name="email"
                    // family="ArgonExtra"
                    style={styles.inputIcons}
                  />
                }
                id="email"
                errors={errors}
                setValue={setValue}
                triggerValidation={triggerValidation}
              />
            </Block>
            <Block style={styles.blockInput}>
              <Input
                password
                placeholder="Password"
                rounded
                viewPass
                iconContent={
                  <Icon
                    size={16}
                    color={materialTheme.COLORS.ICON}
                    name="lock"
                    family="font-awesome"
                    style={styles.inputIcons}
                  />
                }
                id="password"
                errors={errors}
                setValue={setValue}
                triggerValidation={triggerValidation}
              />
            </Block>
            <Text
              color={materialTheme.COLORS.PINK}
              size={12}
              style={{
                alignSelf: 'flex-end',
                lineHeight: theme.SIZES.FONT,
              }}
              onPress={() => Alert.alert('Chờ update')}>
              {' '}
              Bạn đã quên mật khẩu?{' '}
            </Text>
            <Block middle>
              <Button
                color="pink"
                round
                style={styles.createButton}
                onPress={waiting ? () => {} : handleSubmit(onSubmit)}>
                {waiting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text bold size={14} color="white">
                    {' '}
                    Sign In{' '}
                  </Text>
                )}
              </Button>
              <Block row center>
                <Text color="#8898AA" size={12}>
                  {' '}
                  Bạn chưa có tài khoản?{' '}
                </Text>
                <Text
                  size={12}
                  color={materialTheme.COLORS.PINK}
                  onPress={() => navigate('Sign Up')}>
                  {' '}
                  Đăng ký ngay!{' '}
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      </ScrollView>
      <Modal
        message={modalMess}
        isModalVisible={isModalVisible}
        toggleModal={() => {
          toggleModal(!isModalVisible);
        }}
      />
    </Block>
  );
};

export default SignIn;
