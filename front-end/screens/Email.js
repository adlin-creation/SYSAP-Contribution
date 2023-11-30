import React from 'react';
import { ScrollView, View, Image, StyleSheet, Dimensions } from 'react-native';
import EmailCard from '../components/EmailCard';
import { Block } from 'galio-framework';

const { width } = Dimensions.get('screen');

export default class Email extends React.Component {
  render() {
    return (
      <ScrollView>
        <Block flex center style={styles.home}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageCenter}
              source={require('../assets/images/email.png')}
              resizeMode="contain"
            />
          </View>
          <EmailCard />
        </Block>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  imageContainer: {
    paddingTop: 50,
    width: width,  // Set the width of the container
    height: 450,  // Set a fixed height for the container
    alignItems: 'center',  // Center the image horizontally
    justifyContent: 'center',  // Center the image vertically
    marginBottom: 20,  // Add some spacing between the container and the image
  },
  imageCenter: {
    width: '100%',  // Set image width to 100% of the container
    height: '100%',  // Set image height to 100% of the container
    alignSelf: 'center',
  }
});
