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
import Swiper from 'react-native-swiper';
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

    static navigationOptions = { 'header': null };

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
            soundsState : []
        };
    }

    componentDidMount()
    {
        this.fetchData();
    };

    fetchData()
    {
        const { params } = this.props.navigation.state;
        var soundsState = [];
        lessonUrl = Config.API_LESSON_URL.replace("{0}", params.id);
        fetch(lessonUrl)
            .then((response) => response.json())
            .then((responseData) => {

                for(i=0; i<responseData.vocabularies.length;i++){
                    soundsState.push({
                        soundState: 'waitingClick'
                    });
                }

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.vocabularies),
                    loaded: true,
                    lesson: responseData,
                    loadingSound: false,
                    soundsState: soundsState
                });
            })
            .done();
    };

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
            return this.renderLoadedView();
        }
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

    downloadFileAndPlay(indexVoc, indexExample)
    {
        this.setState({'soundState':'loading'});

        let soundFile;
        let soundPath;

        if(indexExample == null){
            soundFile = this.state.lesson.vocabularies[indexVoc].sound.filename;
            soundPath = this.state.lesson.vocabularies[indexVoc].sound.path;
        }else{
            soundFile = this.state.lesson.vocabularies[indexVoc].examples[indexExample].sound.filename;
            soundPath = this.state.lesson.vocabularies[indexVoc].examples[indexExample].sound.path;
        }

        const downloadDest = RNFS.DocumentDirectoryPath + '/' + soundFile;
        const download = RNFS.downloadFile(
            {
                fromUrl: Config.API_DOMAIN+'/uploads/files'+soundPath+'/'+soundFile,
                toFile: downloadDest
            }
        );
        download.promise.then(resDownload => {
            var whoosh = new Sound(downloadDest, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    this.setState({'soundState':'waitingClick'});
                    return;
                }
                // loaded successfully
                console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
                // Play the sound with an onEnd callback
                this.setState({'soundState':'playing'});
                whoosh.play((callBackPlay) => {
                    if (callBackPlay == true) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                    this.setState({'soundState':'waitingClick'});
                });
            });
        }).catch(err => {
            this.setState({'soundState':'waitingClick'});
            console.log("ErrorLoadingSound "+err);
        });
    }

    getVocabularySlides(vocabularies)
    {
        return vocabularies.map(function(item, i){

            let buttonText = "Listen";
            if(this.state.soundState == 'loading'){
                buttonText = 'Loading';
            }
            if(this.state.soundState == 'playing'){
                buttonText = 'Playing';
            }

            let examples = null;
            if(item.hasOwnProperty('examples')){
                examples = this.getExamplesBlocks(item.examples, i);
            }

            let getListenButton = i => {
                if(item.sound == null) return null;
                return (<ButtonListen onPress={() => this.downloadFileAndPlay(i, null) } text={buttonText} disabled={buttonText != "Listen"} />);
            };

            return (
                <View style={styles.fullSlideWrapper} key={i}>
                    <View style={styles.box}>
                        <Text style={styles.boxTextTitle}>{item.word}</Text>
                        <Text style={styles.boxText}>{item.translation}</Text>
                        <Text style={styles.boxText}>{item.phonetic}</Text>
                    </View>
                    { getListenButton(i) }
                    { examples }
                </View>
            )
        }, this);
    }

    getExamplesBlocks(examples, indexVoc)
    {
        let buttonText = "Listen";
        if(this.state.soundState == 'loading'){
            buttonText = 'Loading';
        }
        if(this.state.soundState == 'playing'){
            buttonText = 'Playing';
        }

        if(examples.length == 0){
            return null;
        }

        let exampleSoundJsx = (example, indexVoc, j) => {
            if(example.hasOwnProperty('sound') && example.sound != null){
                return(
                    <View style={ {marginBottom:15} }>
                        <ButtonListen onPress={() => this.downloadFileAndPlay(indexVoc, j) } text={buttonText} disabled={buttonText != "Listen"}  />
                    </View>
                );
            }
            return(null);
        }

        let blocks = examples.map(function(example, j){
            return(
                <View key={"voc-"+indexVoc+"-example-"+j}>
                    <View style={styles.boxInner}>
                        <Text style={styles.text}>{example.sentence}</Text>
                        <Text style={styles.text}>{example.translation}</Text>
                        <Text style={styles.text}>{example.phonetic}</Text>
                    </View>
                    { exampleSoundJsx(example, indexVoc, j) }
                </View>
            )
        }, this);

        return (
            <View style={styles.fullSlideBlocWrapper}>
                <Text style={styles.textTitle}>{ blocks.length == 1 ? "Example" : "Examples" }</Text>
                { blocks }
            </View>
        );
    }

    renderLoadedView()
    {
        let slidesList = this.getVocabularySlides(this.state.lesson.vocabularies);
        return (
            <DrawerLayoutAndroid
                ref={'DRAWER_REF'}
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => this.navigationView}>
                <View style={styles.containerFull}>
                    <Swiper showsButtons={true} showsPagination={true}>
                        { slidesList }
                    </Swiper>
              </View>
            </DrawerLayoutAndroid>
        );
    }

    renderVocabulary(item)
    {
        return (
            <View>
                <View style={{ flex:1 }}>
                    <Text style={styles.boxTitle}>{item.word} {item.translation}</Text>
                </View>
            </View>
        );
    };
}

module.exports = LessonFindImageScreen;
