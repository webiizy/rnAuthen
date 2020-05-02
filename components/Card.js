import React from 'react';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { Images } from "../constants";

const { width } = Dimensions.get('screen');

export default Card = (props) => {
  const { data, horizontal, full, style, priceColor, imageStyle, onPress } = props;
  const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];

  return (
    <Block row={horizontal} card flex style={[styles.data, styles.shadow, style]}>
      <TouchableWithoutFeedback onPress={onPress}>
        <Block flex style={[styles.imageContainer, styles.shadow]}>
          <Image source={{ uri: data.photoURL || Images.Profile }} style={imageStyles} />
        </Block>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onPress}>
        <Block flex space="between" style={styles.dataDescription}>
          <Text size={14} style={styles.dataTitle}>{`Welcome, ${data.name || data.displayName || data.email}`}</Text>
        </Block>
      </TouchableWithoutFeedback>
    </Block>
  )
}
const styles = StyleSheet.create({
  data: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  dataTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  dataDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});