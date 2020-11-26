import React, { useState, useEffect } from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import socketIOClient from "socket.io-client";
var socket = socketIOClient("http://172.17.1.97:3000");
import { connect } from 'react-redux';

function MapScreen(props) {
  const [CurrentLocation, setCurrentLocation] = useState([])
  const [AllLocation, setAllLocation] = useState([]);
  const [pseudo, setPseudo] = useState('');
  const [addPOI, setAddPOI] = useState(false);
  const [listPOI, setListPOI] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coordinatesOnClick, setCoordinatesOnClick] = useState({})

  useEffect(() => {


    async function askPermissions() {
      var { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {

        Location.watchPositionAsync({ distanceInterval: 2 },
          (location) => {
            socket.emit("sendLocation", { latitude: location.coords.latitude, longitude: location.coords.longitude, pseudo: props.pseudo })
          }
        );
      }
    }
    askPermissions();

    AsyncStorage.getItem("POI",
      function (error, data) {
        var poi = JSON.parse(data);
        if (poi) {
          setListPOI(poi)
        }
      });

  }, []);


  useEffect(() => {

    socket.on('sendLocationFromBack', (location) => {
      console.log(location)
      setAllLocation([...AllLocation, location])
    });
  }, [AllLocation]);


  let openModal = (event) => {
    if (addPOI) {
      setCoordinatesOnClick(event.nativeEvent.coordinate)
      setVisible(!visible);
      setAddPOI(!addPOI);
    }
  }

  let addPin = () => {
    setListPOI([...listPOI, { latitude: coordinatesOnClick.latitude, longitude: coordinatesOnClick.longitude, title: title, description: description }])
    AsyncStorage.setItem("POI", JSON.stringify([...listPOI, { latitude: coordinatesOnClick.latitude, longitude: coordinatesOnClick.longitude, title: title, description: description }]))
    setVisible(!visible);
    props.saveSpot({ title: title, description: description })
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }}
        onPress={(event) => openModal(event)}
        initialRegion={{
          latitude: 48.866667,
          longitude: 2.33333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        draggable>
        {
          listPOI.map((element, i) =>
            <Marker key={i}
              coordinate={{ latitude: element.latitude, longitude: element.longitude }}
              title={element.title}
              description={element.description}
              pinColor="blue"
            />
          )
        }
        {
          AllLocation.map((element, i) =>
            <Marker key={i}
              coordinate={{ latitude: element.latitude, longitude: element.longitude }}
              title={element.pseudo}
              description="hello, I am another user"
              pinColor="yellow"
            />
          )
        }
      </MapView>
      <Button onPress={() => { setAddPOI(!addPOI) }}
        title="Add POI"
        buttonStyle={{ backgroundColor: "#eb4d4b" }}
        type="solid"
        disabled={addPOI}
      />
      <Overlay isVisible={visible}>
        <Input placeholder='title' onChangeText={(val) => setTitle(val)} />
        <Input placeholder='description' onChangeText={(val) => setDescription(val)} />
        <Button onPress={() => { addPin() }} title="Add POI" type="solid" buttonStyle={{ backgroundColor: "#eb4d4b", marginTop: 5 }} />
        <Text onPress={() => { setVisible(!visible) }} style={{ fontSize: "20px", marginTop: 15, textAlign: "center", color: "red" }}>Ignorer</Text>
      </Overlay>
    </View>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    saveSpot: function (listPOI) {
      dispatch({ type: 'saveSpot', listPOI: listPOI })
    }
  }
}
export default connect(
  null,
  mapDispatchToProps,
)(MapScreen);

