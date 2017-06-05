import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { DrawerLayoutAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';
import styles from './Styles';

class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'Home',
    };

    constructor() {
        super();
        this.state = {
            currentView: 'home',
        };
    }

    render() {
        const { navigate } = this.props.navigation;
        var navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
                <Icon.Button style={[styles.navigationMenuItem]} name="home" color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.navitationtextItem]}>Home</Text>
                </Icon.Button>
                <Icon.Button style={[styles.navigationMenuItem]} name="book" onPress={() => navigate('Lessons')} color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.navitationtextItem]}>Lessons</Text>
                </Icon.Button>
            </View>
        );

        return (
            <DrawerLayoutAndroid
                ref={'DRAWER_REF'}
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => navigationView}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
                    <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>World!</Text>
              </View>
            </DrawerLayoutAndroid>
        );
    }
}

module.exports = HomeScreen;
