import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { DrawerLayoutAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';

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
                <Icon.Button style={[styles.menuItem]} name="home" color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.textItem]}>Home</Text>
                </Icon.Button>
                <Icon.Button style={[styles.menuItem]} name="book" onPress={() => navigate('Lessons')} color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.textItem]}>Lessons</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
        menuItem: {
        margin: 10,
    },
        textItem: {
        fontSize: 14,
        margin: 5,
    },
        instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

module.exports = HomeScreen;
