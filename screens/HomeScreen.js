import React from 'react';
import {StyleSheet} from 'react-native';
import {Block, Text, theme} from 'galio-framework';
import {Button, Icon, Input, Card, Modal} from '../components';

const HomeScreen = props => {
  return (
    <Block flex center>
      <Button style={{marginTop: 10}}>Tìm kiếm đơn hàng</Button>
      <Button style={{marginTop: 10}}>Đơn Hàng Cần Nhận </Button>
      <Button style={{marginTop: 10}}>Đơn Hàng Đang Giữ </Button>
    </Block>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
});
