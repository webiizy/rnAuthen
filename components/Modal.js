import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Button from "./Button";
import { Block, Text } from "galio-framework";
import Modal from 'react-native-modal';
import { argonTheme, materialTheme } from "../constants";
const { width, height } = Dimensions.get("screen");
export default MyModal = (props) => {
    return (
        <Block row center flex>
            <Modal isVisible={props.isModalVisible} style={styles.modal}
                onSwipeComplete={props.toggleModal}
                onBackdropPress={props.toggleModal}
                swipeDirection="left">
                <View style={styles.container}>
                    <Text style={styles.contentTitle}>    {props.message} </Text>
                    {props.onAccept &&
                        <Block row >
                            <Button color='success' style={styles.button} title="yes" onPress={props.onAccept} >
                                <Text bold size={14} color={materialTheme.COLORS.PINK}>
                                    Yes </Text>
                            </Button>
                            <Button color='error' style={styles.button} title="Close" onPress={props.toggleModal} >
                                <Text bold size={14} color={materialTheme.COLORS.PINK}>
                                    NO </Text>
                            </Button>
                        </Block>}
                </View>
            </Modal>
        </Block>
    );

}
const styles = StyleSheet.create({
    button: {
        width: width * 0.3,
        height: 40,
        marginHorizontal: 15
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        backgroundColor: 'white',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 15,
        marginBottom: 12,
        color: materialTheme.COLORS.PINK
    },
});