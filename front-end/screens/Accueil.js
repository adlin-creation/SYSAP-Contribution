import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Block, Input, theme } from 'galio-framework';

import Icon from '../components';
import CustomCard from '../components/CustomCard';
import { fetchServerData } from '../services/apiServices';

const { width } = Dimensions.get('screen');

function ProgramInfo() {
  const [programData, setProgramData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const data = await fetchServerData(`/api/programEnrollment/user/${userId}`);
        setProgramData(data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProgramData({ ProgramName: '', Erreur: 'Erreur de connexion' });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* <CustomCard title={programData.program.name} programData={programData} /> */}
    </View>
  );
}

export default class Accueil extends React.Component {
  renderSearch = () => {
    const { navigation } = this.props;
    const iconCamera = <Icon size={16} color={theme.COLORS.MUTED} name="zoom-in" family="material" />

    return (
      <Input
        right
        color="black"
        style={styles.search}
        iconContent={iconCamera}
        placeholder="Que cherchez vous?"
        onFocus={() => navigation.navigate('Profile')}
      />
    )
  }

  renderTabs = () => {
    const { navigation } = this.props;

    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Profile')}>
          <Block row middle>
            <Icon name="grid" family="feather" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Exercices</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Programme')}>
          <Block row middle>
            <Icon size={16} name="camera-18" family="GalioExtra" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Programme</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  render() {
    return (
      <ScrollView>
        <Block flex center style={styles.home}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageCenter}
              source={require('../assets/images/abc.png')}
            />
          </View>
          <ProgramInfo />
        </Block>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },

  imageContainer: {
    paddingTop: 50,
  },
  imageCenter: {
    width: width - 32,
    height: 300,
    alignSelf: 'center',
    marginBottom: 10
  }
});
