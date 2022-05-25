/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
    View, StatusBar, Pressable,
    Text,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import { Layout } from './constants/dimension';
import { regionLatLong, initMarkerLatLong, MapKey, lang, country } from './constants/constant';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

let wide = Layout.width;
let high = Layout.height;

class App extends Component {

    constructor() {
        super()
        this.state = {
            selectedLatLong: null,
            seleCtedNorthLatLong: {},
            seleCtedSouthLatLong: {},
            regionLatLong: regionLatLong,
            isTxtValue: false,

        }
    }

    handlleSelectedAddress = (data) => {
        this.setState({
            selectedLatLong: {
                latitude: data.geometry.location.lat,
                longitude: data.geometry.location.lng,
            },
            seleCtedNorthLatLong: {
                latitude: data.geometry.viewport.northeast.lat,
                longitude: data.geometry.viewport.northeast.lng,
            },
            seleCtedSouthLatLong: {
                latitude: data.geometry.viewport.southwest.lat,
                longitude: data.geometry.viewport.southwest.lng,
            },
            regionLatLong: {
                latitude: data.geometry.location.lat,
                longitude: data.geometry.location.lng,
                latitudeDelta: 0.015 * 10,
                longitudeDelta: 0.0121 * 10,
            }
        })



    }

    handleTextChange = (val) => {
        debugger
        if (val != '') {
            this.setState({ isTxtValue: true })
        } else {
            this.setState({
                isTxtValue: false,
                regionLatLong: regionLatLong,
                selectedLatLong: null,
            })
        }
    }

    renderCloseBtn = () => {
        const { isTxtValue } = this.state
        return (
            <Pressable style={{
                width: wide * 0.09, height: wide * 0.09, position: 'absolute',
                backgroundColor: '#f8f8f8',
                right: wide * 0.022, top: wide * 0.035,
                justifyContent: 'center', alignItems: 'center'
            }}
                onPress={() => this.setState({
                    isTxtValue: false,
                    regionLatLong: regionLatLong,
                    selectedLatLong: null,
                }, () => this._txtInput.clear())}
            >
                {isTxtValue == true ?
                    <Text style={{ fontSize: 18, fontWeight: '700' }}>X</Text>
                    :
                    <></>
                }
            </Pressable>
        )
    }


    render() {
        const { selectedLatLong, regionLatLong } = this.state;
        return (
            <View style={{ flex: 1, }}>
                <StatusBar translucent={true} barStyle="dark-content" backgroundColor="transparent" />
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 1 }}
                        provider={PROVIDER_GOOGLE}
                        region={regionLatLong}
                    >
                        <Marker
                            coordinate={initMarkerLatLong}
                        >
                        </Marker>
                        {selectedLatLong !== null ?
                            <Circle
                                key={(selectedLatLong.latitude + selectedLatLong.longitude).toString()}
                                ref={ref => (this.polygon = ref)}
                                center={selectedLatLong}
                                radius={1000}
                                strokeWidth={1}
                                strokeColor={'red'}
                                fillColor={'rgb(255, 187, 97)'}
                                onLayout={() => this.polygon.setNativeProps({
                                    fillColor: 'rgb(255, 187, 97)'
                                })}
                                accessibilityIgnoresInvertColors={false}
                            />
                            : <></>
                        }

                    </MapView>

                    <View style={{
                        width: '90%', height: wide,
                        position: 'absolute', top: 40,
                        alignSelf: "center"
                    }}>

                        <GooglePlacesAutocomplete
                            ref={ref => (this._txtInput = ref)}
                            placeholder='Start typing an address'
                            onPress={(data, details) => this.handlleSelectedAddress(details)}

                            fetchDetails={true}
                            query={{
                                key: MapKey,
                                language: lang,
                                components: country,
                            }}
                            styles={{
                                textInputContainer: {
                                    // backgroundColor: Colors.lightGray,
                                },
                                textInput: {
                                    height: 45,
                                    color: '#5d5d5d',
                                    fontSize: 16,
                                    backgroundColor: '#f8f8f8',
                                    paddingHorizontal: 10,
                                    top: 10,
                                    borderRadius: 10,

                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb',
                                },
                            }}
                            renderRightButton={() => this.renderCloseBtn()}
                            textInputProps={{
                                onChangeText: (txt) => { this.handleTextChange(txt) }
                            }}

                        />
                    </View>

                </View>
            </View>
        );

    }

};

export default App;
