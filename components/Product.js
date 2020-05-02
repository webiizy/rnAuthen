import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Button from "./Button"
import materialTheme from '../constants/Theme';

const { width } = Dimensions.get('screen');

class Product extends React.Component {
  render() {
    const { navigation, product, horizontal, full, style, priceColor, imageStyle } = this.props;
    const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];

    return (
      <Block row={horizontal} card flex style={[styles.product, styles.shadow, style]}>
        <TouchableWithoutFeedback onPress={() => { }}>
          <Block flex style={[styles.imageContainer, styles.shadow]}>
            <Image source={product.image ? { uri: product.image.url } : product.url} style={imageStyles} />
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => { }}>
          <Block flex space="between" style={styles.productDescription}>
            <Text size={14} style={styles.productTitle}>{product.title || product.name}</Text>
            {/* {product.desc && <Text size={12} muted>{product.desc}</Text>} */}
            {product.price && <Text size={12} muted={!priceColor} color={priceColor}>${product.price}</Text>}
            {
              (<Button color="pink" round style={styles.createButton} onPress={() => navigation.navigate('Basket', {
                product
              })}>
                <Text bold size={14} color="white">
                  Mua ngay </Text>
              </Button>)}
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

export default withNavigation(Product);

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  productDescription: {
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
  createButton: {
    maxWidth: 100,
    width: width / 4,
    height: 30
    // marginVertical: 15
  },
});