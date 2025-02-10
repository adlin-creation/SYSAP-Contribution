import React, {useEffect, useState, } from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown';
import getFetch from "../apiFetch/getFetch";
import {getISOWeek} from "date-fns";
import {useIsFocused} from "@react-navigation/native";

const SemaineComponent = ({ onSelect, idPatient}) => {


  const [depart, setDepart] = useState(0);
  const [duree, setDuree] = useState(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDepart = await getFetch(`http://localhost:3000/api/programEnrollment/user/${idPatient}`)
        if (responseDepart) {
          const startDate = new Date(responseDepart.startDate);
          setDuree(responseDepart.program.duration);
          setDepart(getISOWeek(startDate));
        }
      } catch (error){
        console.error('Error fetching data', error);
      }
    };
    if (isFocused) fetchData();
  },[isFocused, idPatient])


  const weekOptions = Array.from({ length: duree }, (_, i) => {
    const weekNumber = depart + i <= 52 ? depart + i : depart + i - 52;
    return {
      label: `Semaine ${i + 1}`,
      value: weekNumber
    };
  });

  const handleSelect = (selectedItem) => {
    onSelect(selectedItem.value); // Appel de la fonction onSelect avec les valeurs
  };
  return (
    <View style={styles.container}>
      <SelectDropdown
        data={weekOptions}
        // defaultValue={}
        onSelect={(selectedItem) => {
          handleSelect(selectedItem);
        }}
        buttonTextAfterSelection={(selectedItem) => {
          return selectedItem.label;
        }}
        rowTextForSelection={(item) => {
          return item.label;
        }}
        buttonStyle={styles.dropdownButton}
        buttonTextStyle={styles.dropdownButtonText}
        renderDropdownIcon={() => {
          return <Feather name="chevron-down" size={20} color={"white"} />;
        }}
        dropdownIconPosition={'right'}
        dropdownStyle={styles.dropdownStyle}
        rowTextStyle={styles.rowTextStyle}
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
