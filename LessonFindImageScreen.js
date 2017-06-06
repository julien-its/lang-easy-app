import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Alert,
    Image,
    TouchableHighlight
} from 'react-native';
import Config from './Config';
import { DrawerLayoutAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import styles from './Styles';

let RNFS = require('react-native-fs');
let Sound = require('react-native-sound');

class ButtonListen extends React.Component {
    render(){
        return (
            <TouchableHighlight
                onPress={() => { this.props.onPress() }}
                underlayColor="white"
                activeOpacity={0.7}
                disabled={this.props.disabled}
                >
                <View style={ this.props.disabled ? styles.buttonFullWidthDisabled : styles.buttonFullWidth}>
                    <Text style={styles.buttonText}>{ this.props.text }</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

class LessonFindImageScreen extends React.Component {

    static navigationView = null;

    static navigationOptions = { 'title': 'Find Image' };



    constructor()
    {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            currentView: 'lessonVocabulary',
            dataSource: ds.cloneWithRows([]),
            lesson: null,
            loaded: false,
            soundState: 'waitingClick',
            currentSlide : null,
        };
        this.game = {
            score: null,
            vocabularies : [],
            shownVocabularies : [],
            currentVocabulary: null,
            currentVocabularyIndex: null
        };
    }

    componentDidMount()
    {
        this.fetchData();
    };

    fetchData()
    {
        const { params } = this.props.navigation.state;
        //lessonUrl = Config.API_LESSON_URL.replace("{0}", params.id);
        lessonUrl = Config.API_LESSON_URL.replace("{0}", 3);
        fetch(lessonUrl)
            .then((response) => response.json())
            .then((responseData) => {
                this.initGame(responseData.vocabularies);

            })
            .done();
    };

    // Initialize the game variables
    initGame(vocabularies)
    {
        // Get vocabularies with photo
        for(i=0; i<vocabularies.length; i++){
            if(vocabularies[i].hasOwnProperty('photo') && vocabularies[i].photo != null){
                this.game.vocabularies.push(vocabularies[i]);
            }
        }

        this.setState({
            loaded: true,
            currentSlide : 1
        });
    }

    render()
    {
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

        if (!this.state.loaded) {
            return this.renderLoadingView();
        }else{
            return this.renderGameSlideView();
        }
    }

    randomIndex(min, max, excludes)
    {
        min = Math.ceil(min);
        max = Math.floor(max);

        random = Math.floor(Math.random() * (max - min)) + min;
        if(excludes != null){
            if(excludes.constructor === Array){
                if(excludes.indexOf(random) !== -1){
                    return this.randomIndex(max, max, excludes);
                }
            }else if(random == excludes){
                console.log("not array and exclude yes");
                return this.randomIndex(max, max, excludes);
            }
        }
        return random;
    }

    renderLoadingView()
    {
        return (
            <DrawerLayoutAndroid
                ref={'DRAWER_REF'}
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => this.navigationView}>
                <View style={styles.containerLoader}>
                    <Animatable.Text animation="rotate" iterationCount="infinite" direction="normal">
                        <Icon name="circle-o-notch" size={30} color="#900" />
                    </Animatable.Text>
              </View>
            </DrawerLayoutAndroid>
        );
    }

    setRandomVocabulary()
    {
        this.game.currentVocabularyIndex = this.randomIndex(0, this.game.vocabularies.length-1, null);
        this.game.currentVocabulary = this.game.vocabularies[this.game.currentVocabularyIndex];
    }

    getRandomSlideVocabularies()
    {
        // Create an array of random indexes from 0 to count existing vocabularies
        // index can't be twice
        // index can't be the selected vobabulary
        let indexes = [];
        let excludes = [this.game.currentVocabularyIndex];
        for(i=0;i<3;i++){
            index = this.randomIndex(0, this.game.vocabularies.length-1, excludes);
            indexes.push(index);
            excludes.push(index);
        } 

        // Then generate an array of 4 elements with the selected vocabulary placed randomly
        let randomVocabularyPosition = this.randomIndex(0, 3);
        let randomSLideVocabularies = [];
        for(i=0,index=0;i<=4;i++){
            if(i==randomVocabularyPosition){
                randomSLideVocabularies.push(this.game.currentVocabulary);
            }else{
                randomSLideVocabularies.push(this.game.vocabularies[indexes[index]]);
                index++;
            }
        }
        return randomSLideVocabularies;
    }

    renderGameSlideView()
    {
        this.setRandomVocabulary();

        const slideVocabularies = this.getRandomSlideVocabularies();
        return (
            <DrawerLayoutAndroid
                ref={'DRAWER_REF'}
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => this.navigationView}>
                <View style={styles.containerFull}>
                    <View style={styles.containerBoxed}>
                        <View>
                            <View style={styles.gridRow}>
                                <View style={[styles.gridColumnImageItem, { borderRightWidth: 0.5 }]}>
                                    <TouchableHighlight
                                        onPress={() => Alert.alert("1")}
                                        underlayColor="white"
                                        activeOpacity={0.7}
                                        style={{ flex:1 }}
                                        >
                                            <View style={styles.gridRowImage}>
                                                <Image style={{flex:1}} source={ { uri: Config.API_DOMAIN+'/uploads/photos'+slideVocabularies[0].photo.path+'/'+slideVocabularies[0].photo.filename,} } />
                                            </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={[styles.gridColumnImageItem]}>
                                    <TouchableHighlight
                                        onPress={() => Alert.alert("2")}
                                        underlayColor="white"
                                        activeOpacity={0.7}
                                        style={{ flex:1 }}
                                        >
                                            <View style={styles.gridRowImage}>
                                                <Image style={{flex:1}} source={ { uri: Config.API_DOMAIN+'/uploads/photos'+slideVocabularies[1].photo.path+'/'+slideVocabularies[1].photo.filename,} } />
                                            </View>
                                    </TouchableHighlight>
                                </View>
                            </View>

                            <View style={styles.gridRow}>
                                <View style={[styles.gridColumnImageItem, { borderRightWidth: 0.5 }]}>
                                    <TouchableHighlight
                                        onPress={() => Alert.alert("3")}
                                        underlayColor="white"
                                        activeOpacity={0.7}
                                        style={{ flex:1 }}
                                        >
                                            <View style={styles.gridRowImage}>
                                                <Image style={{flex:1}} source={ { uri: Config.API_DOMAIN+'/uploads/photos'+slideVocabularies[2].photo.path+'/'+slideVocabularies[2].photo.filename,} } />
                                            </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={[styles.gridColumnImageItem]}>
                                    <TouchableHighlight
                                        onPress={() => Alert.alert("4")}
                                        underlayColor="white"
                                        activeOpacity={0.7}
                                        style={{ flex:1 }}
                                        >
                                            <View style={styles.gridRowImage}>
                                                <Image style={{flex:1}} source={ { uri: Config.API_DOMAIN+'/uploads/photos'+slideVocabularies[3].photo.path+'/'+slideVocabularies[3].photo.filename,} } />
                                            </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>

                        <View style={{ alignItems: "center", padding:30 }}>
                            <Text style={[styles.boxTextTitle]}>{this.game.currentVocabulary.word}</Text>
                        </View>
                    </View>



              </View>
            </DrawerLayoutAndroid>
        );
    }


}

module.exports = LessonFindImageScreen;
