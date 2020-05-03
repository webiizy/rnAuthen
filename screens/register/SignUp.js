import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Block, Checkbox, Text, theme} from 'galio-framework';
import {useForm} from 'react-hook-form';
import {Button, Icon, Input, Modal} from '../../components';
import {Images, materialTheme} from '../../constants';
import {firebase} from '../../context';
import styles from './styles';
const {width, height} = Dimensions.get('screen');

const SignUp = props => {
  const {navigate, popToTop} = props.navigation;
  const [waiting, setWaiting] = useState(false);
  const [isAgree, setAgree] = useState(true);
  const [isModalVisible, toggleModal] = useState(false);
  const [modalMess, setModalMess] = useState('');
  const {register, handleSubmit, setValue, errors, triggerValidation} = useForm(
    {
      defaultValues: {
        name: 'Ha Minh',
        email: 'minh.ha@spt.vn',
        password: '123456',
      },
    },
  );

  const onSubmit = data => {
    //setWaiting(true);
    const {password} = data;
    delete data.password;
    data.provider = 'classic';
    data.role = {customer: true};
    console.log('new user', data);
    try {
      firebase.auth
        .createUserWithEmailAndPassword(data.email, password)
        .then(() => {
          console.log('authen create thanh cong');
          firebase.addDocument('users', firebase.getUid(), data, error => {
            if (!error) {
              setModalMess(`Welcome, ${data.name || data.email}!`);
              toggleModal(true);
              setWaiting(false);
              popToTop();
            } else {
              if (error.exists) {
                setModalMess('Email đã được sử dụng!');
              } else setModalMess('Fail add user', error);

              toggleModal(true);
              setWaiting(false);
            }
          });
        })
        .catch(error => {
          console.log('error---create:', error);
          switch (error.code) {
            case 'auth/email-already-in-use':
              setModalMess('Email đã được sử dụng!');
              break;
            case 'auth/invalid-email':
              setModalMess('Email không hơp lệ!');
              break;
            default:
              setModalMess('Không tạo được tài khoản: ', error);
              break;
          }
          toggleModal(true);
          setWaiting(false);
        });
    } catch (error) {
      console.log('---golable ---error', error);
      setModalMess('Không tạo được tài khoản: ', error);
      toggleModal(true);
      setWaiting(false);
    }
  };

  useEffect(() => {
    register('name', {
      required: 'Vui lòng nhập tên',
    });
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={Images.RegisterBackground}
          style={{width, height: 'auto', zIndex: 1}}>
          <Block flex center>
            <Block style={styles.registerContainer}>
              {/* Form Input */}
              <Block flex center style={styles.formInput}>
                <Block flex={0.17} middle>
                  <Text color="#8898AA" size={12}>
                    Vui lòng nhập thông tin để tạo tài khoản{' '}
                  </Text>
                </Block>
                <KeyboardAvoidingView
                  style={{flex: 1, marginTop: theme.SIZES.BASE * 0.75}}
                  behavior="padding"
                  enabled>
                  <Block style={styles.blockInput}>
                    <Input
                      rounded
                      placeholder="Name"
                      iconContent={
                        <Icon
                          size={16}
                          color={materialTheme.COLORS.ICON}
                          name="account-circle"
                          style={styles.inputIcons}
                        />
                      }
                      id="name"
                      errors={errors}
                      setValue={setValue}
                      triggerValidation={triggerValidation}
                    />
                  </Block>
                  <Block style={styles.blockInput}>
                    <Input
                      rounded
                      placeholder="Email"
                      iconContent={
                        <Icon
                          size={16}
                          color={materialTheme.COLORS.ICON}
                          name="email"
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
                      viewPass
                      rounded
                      placeholder="Password"
                      iconContent={
                        <Icon
                          size={16}
                          color={materialTheme.COLORS.ICON}
                          name="lock"
                          style={styles.inputIcons}
                        />
                      }
                      id="password"
                      errors={errors}
                      setValue={setValue}
                      triggerValidation={triggerValidation}
                    />
                  </Block>
                  <Block row width={width * 0.75}>
                    <Checkbox
                      checkboxStyle={{
                        borderWidth: 3,
                      }}
                      initialValue={isAgree}
                      onChange={setAgree}
                      color={materialTheme.COLORS.PINK}
                      label="Tôi đồng ý với "
                    />
                    <Text
                      size={16}
                      color={materialTheme.COLORS.PINK}
                      // onPress={() => navigate('Privacy Policy')}
                    >
                      {' '}
                      Các điều khoản{' '}
                    </Text>
                  </Block>
                  {!isAgree && (
                    <Block key={1} row>
                      <Text bold size={12} color={materialTheme.COLORS.ERROR}>
                        Vui lòng đồng ý với các điều khoản
                      </Text>
                    </Block>
                  )}
                  <Block middle>
                    <Button
                      rounded
                      color="pink"
                      style={styles.createButton}
                      onPress={
                        !waiting && isAgree ? handleSubmit(onSubmit) : () => {}
                      }>
                      {waiting ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text bold size={14} color="white">
                          Tạo tài khoản{' '}
                        </Text>
                      )}
                    </Button>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
              {/* Form Input */}
            </Block>
          </Block>
        </ImageBackground>
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

export default SignUp;
