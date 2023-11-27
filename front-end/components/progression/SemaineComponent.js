import React from 'react';
import { View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown';

const SemaineComponent = ({ onSelect }) => {
  const weeks = [...Array(52).keys()].map(i => `Semaine ${i + 1}`);
  const handleSelect = (selectedItem, index) => {
    console.log(selectedItem, index);
    onSelect(selectedItem, index); // Appel de la fonction onSelect avec les valeurs
  };
  return (
    <View style={styles.container}>
      <SelectDropdown
        data={weeks}
        defaultValueByIndex={0} // assuming semaine is 1-based index
        onSelect={(selectedItem, index) => {
          //console.log(selectedItem, index);
          handleSelect(selectedItem,index);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        buttonStyle={styles.dropdownButton}
        buttonTextStyle={styles.dropdownButtonText}
        renderDropdownIcon={() => {
          return <Feather name="chevron-down" size={20} color={"white"} />;
        }}
        dropdownIconPosition={'right'}
        dropdownStyle={styles.dropdownStyle}
        rowTextStyle={styles.rowTextStyle} // Add this line
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'purple',
    paddingHorizontal: 30,
    paddingVertical: 10,
    margin: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButton: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    alignSelf: 'flex-start',
  },
  dropdownButtonText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dropdownStyle: {
    backgroundColor: 'purple',
    borderRadius: 20,
    marginTop: Platform.OS === 'android' ? -50 : 0,
  },
  rowStyle: {
    paddingVertical: 10,
  },
  rowTextStyle: {
    color: 'white',
  },
});

export default SemaineComponent;
