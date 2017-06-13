import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Alert,
    TouchableHighlight
} from 'react-native';
import Config from './Config';
import { DrawerLayoutAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import styles from './Styles';

class LessonScreen extends React.Component {

    static navigationView = null;

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title
    });

    constructor()
    {
        super();
        this.state = {
            currentView: 'lesson',
            lesson: null,
            loaded: false,
            title: 'test'
        };
    }

    render()
    {
        const { params } = this.props.navigation.state;

        //this.navigationOptions.title = 'lesson x';
        const { navigate } = this.props.navigation;
        this.navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
                <Icon.Button style={[styles.navigationMenuItem]} name="home" onPress={() => navigate('Home')} color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.navitationtextItem]}>Lesson 1</Text>
                </Icon.Button>
                <Icon.Button style={[styles.navigationMenuItem]} name="book" onPress={() => navigate('Lessons')} color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.navitationtextItem]}>Lessons</Text>
                </Icon.Button>
            </View>
        );

        return(
            <DrawerLayoutAndroid
                ref={'DRAWER_REF'}
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => this.navigationView}>
                    { this.renderScreen() }
            </DrawerLayoutAndroid>
        );
    }

    renderScreen()
    {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.containerFull}>
                <View style={styles.gridRow}>
                    <View style={[styles.gridColumnItem, {borderRightWidth: 0.5 }]}>
                        <TouchableHighlight
                            onPress={() => navigate('LessonVocabulary', { id: params.id })}
                            underlayColor="white"
                            activeOpacity={0.7}
                            style={{ flex:1 }}
                            >
                            <View style={styles.gridRowButton}>
                                <Icon style={styles.gridRowButtonIcon} name="book" color='#455A64' backgroundColor="#fff" />
                                <Text>Vocabulary</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.gridColumnItem}>
                        <TouchableHighlight
                            onPress={() => navigate('LessonFindImage', { id: params.id })}
                            underlayColor="white"
                            activeOpacity={0.7}
                            style={{ flex:1 }}
                            >
                            <View style={styles.gridRowButton}>
                                <Icon style={styles.gridRowButtonIcon} name="picture-o" color='#455A64' backgroundColor="#fff" />
                                <Text>Find Image</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={styles.gridRow}>
                    <View style={[styles.gridColumnItem, {borderRightWidth: 0.5 }]}>
                        <TouchableHighlight
                            onPress={() => navigate('LessonVocabulary', { id: params.id })}
                            underlayColor="white"
                            activeOpacity={0.7}
                            style={{ flex:1 }}
                            >
                            <View style={styles.gridRowButton}>
                                <Icon style={styles.gridRowButtonIcon} name="search" color='#455A64' backgroundColor="#fff" />
                                <Text>Find Word</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.gridColumnItem}>
                        <View style={styles.gridColumnItem}>
                            <TouchableHighlight
                                onPress={() => navigate('LessonVocabulary', { id: params.id })}
                                underlayColor="white"
                                activeOpacity={0.7}
                                style={{ flex:1 }}
                                >
                                <View style={styles.gridRowButton}>
                                    <Icon style={styles.gridRowButtonIcon} name="headphones" color='#455A64' backgroundColor="#fff" />
                                    <Text>Listen & Choose</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                <View style={styles.gridRow}>
                    <View style={[styles.gridColumnItem, {borderRightWidth: 0.5 }]}>
                        <TouchableHighlight
                            onPress={() => navigate('LessonMatching', { id: params.id })}
                            underlayColor="white"
                            activeOpacity={0.7}
                            style={{ flex:1 }}
                            >
                            <View style={styles.gridRowButton}>
                                <Icon style={styles.gridRowButtonIcon} name="puzzle-piece" color='#455A64' backgroundColor="#fff" />
                                <Text>Matching</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.gridColumnItem}>

                    </View>
                </View>
            </View>
        )
    }
}

module.exports = LessonScreen;
