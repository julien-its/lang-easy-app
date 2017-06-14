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

class LessonListenChooseScreen extends React.Component {

    static navigationView = null;

    static navigationOptions = { 'title': 'Find Image' };

    constructor()
    {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            currentView: 'lessonVocabulary',
            dataSource: ds.cloneWithRows([]),
            loaded: false,
            soundAutoPlayed: false,
            soundState: 'waitingClick',
            currentSlide : null,
            endGame: false,
            clickedIndexes: [false, false, false, false],
        };
        this.lesson = null;
        this.game = {
            score: null,
            allVocabularies: [],
            vocabularies : [],
            playedVocabularies : [],
            unplayedVocabularies: [],
            currentVocabulary: null,
            currentVocabularyIndex: null,
            slideVocabularies: null,
            errorCount: 0,
        };
    }

    componentDidMount()
    {
        this.fetchData();
    };

    componentDidUpdate()
    {
        // Auto play sound first time
        if(this.state.soundState == 'waitingClick' && this.state.soundAutoPlayed == false){
            this.downloadFileAndPlay(this.game.currentVocabulary);
        }
    }

    fetchData()
    {
        const { params } = this.props.navigation.state;
        //lessonUrl = Config.API_LESSON_URL.replace("{0}", params.id);
        lessonUrl = Config.API_LESSON_URL.replace("{0}", 3);
        fetch(lessonUrl)
            .then((response) => response.json())
            .then((responseData) => {
                this.lesson = responseData;
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
                this.game.allVocabularies.push(vocabularies[i]);
                this.game.unplayedVocabularies.push(vocabularies[i]);
            }
        }

        this.setGameSlide();
        this.setState({
            loaded: true,
            currentSlide : 1,
            clickedIndexes: [false, false, false, false]
        });
    }

    replay()
    {
        this.game = {
            score: null,
            allVocabularies : this.game.allVocabularies.slice(0),
            vocabularies : this.game.allVocabularies.slice(0),
            playedVocabularies : [],
            unplayedVocabularies: this.game.allVocabularies.slice(0),
            currentVocabulary: null,
            currentVocabularyIndex: null,
            slideVocabularies: null,
            errorCount: 0,
            currentSlide:1,
            clickedIndexes: [false, false, false, false]
        };
        this.setGameSlide();
        this.setState({
            soundAutoPlayed: false,
            currentSlide : 1,
            endGame: false,
            clickedIndexes: [false, false, false, false]
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
        }else if(this.state.endGame){
            return this.renderEndGame();
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
        randomIndex = this.randomIndex(0, this.game.unplayedVocabularies.length-1, null);
        this.game.currentVocabulary = this.game.unplayedVocabularies[randomIndex];

        // Remove the vocabulary from unplayedVocabularies
        this.game.unplayedVocabularies.splice(randomIndex, 1);

        // Add this currentVocabulary to playedVocabularies
        this.game.playedVocabularies.push(this.game.currentVocabulary);
    }

    setRandomSlideVocabularies()
    {
        let vocabulariesToShowInSlide = this.game.vocabularies.slice(0);
        // Remove currentVocabulary
        for(i=0; i<vocabulariesToShowInSlide.length; i++){
            if(vocabulariesToShowInSlide[i].id == this.game.currentVocabulary.id){
                vocabulariesToShowInSlide.splice(i, 1);
            }
        }

        // Then generate an array of 4 elements with the selected vocabulary placed randomly
        let randomVocabularyPosition = this.randomIndex(0, 3);
        let randomSlideVocabularies = [];
        for(i=0;i<=3;i++){
            if(i==randomVocabularyPosition){
                randomSlideVocabularies.push(this.game.currentVocabulary);
            }else{
                let index = this.randomIndex(0, vocabulariesToShowInSlide.length-1, null);
                randomSlideVocabularies.push(vocabulariesToShowInSlide[index]);
                vocabulariesToShowInSlide.splice(index, 1);
            }
        }

        this.game.slideVocabularies = randomSlideVocabularies;
    }

    setGameSlide()
    {
        this.setRandomVocabulary();
        this.setRandomSlideVocabularies();
    }

    nextSlide()
    {
        if(this.game.unplayedVocabularies.length == 0){
            this.setState({
                endGame: true
            });
        }else{
            this.setGameSlide();
            this.setState({
                soundAutoPlayed: false,
                currentSlide: this.state.currentSlide++,
                clickedIndexes: [false, false, false, false]
            });
        }

    }

    renderGameSlideView()
    {
        let buttonText = "Listen";
        if(this.state.soundState == 'loading'){
            buttonText = 'Loading';
        }
        if(this.state.soundState == 'playing'){
            buttonText = 'Playing';
        }


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
                                { this.getColumnImageItem(0) }
                                { this.getColumnImageItem(1) }
                            </View>
                            <View style={styles.gridRow}>
                                { this.getColumnImageItem(2) }
                                { this.getColumnImageItem(3) }
                            </View>
                        </View>
                        <View style={[ styles.buttonFullWidth, { marginTop:15 } ]}>
                            <ButtonListen onPress={() => this.downloadFileAndPlay(this.game.currentVocabulary) } text={buttonText} disabled={buttonText != "Listen"}  />
                        </View>
                    </View>
              </View>
            </DrawerLayoutAndroid>
        );
    }

    renderEndGame()
    {
        let score = this.getScore();
        const { navigate } = this.props.navigation;
        return (
            <DrawerLayoutAndroid
                ref={'DRAWER_REF'}
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => this.navigationView}>
                <View style={styles.containerLoader}>
                    <Text style={ styles.boxTitle }>Your score: { score }%</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', flex:1, margin:10, }}>
                            <TouchableHighlight
                                onPress={() => { this.replay(); }}
                                underlayColor="white"
                                activeOpacity={0.7}
                                disabled={this.props.disabled}
                                >
                                <View style={ styles.buttonFullWidth }>
                                    <Text style={styles.buttonText}>Replay</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={{ flexDirection: 'column', flex:1, margin:10, }}>
                            <TouchableHighlight
                                onPress={() => navigate('Lesson', { id : this.lesson.id, title: this.lesson.title }) }
                                underlayColor="white"
                                activeOpacity={0.7}
                                disabled={this.props.disabled}
                                >
                                <View style={ styles.buttonFullWidth }>
                                    <Text style={styles.buttonText}>Back to lesson</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
              </View>
            </DrawerLayoutAndroid>
        );
    }

    getColumnImageItem(index)
    {
        let vocabulary = this.game.slideVocabularies[index];
        if(this.state.clickedIndexes[index] == true){
            if(vocabulary.id == this.game.currentVocabulary.id){
                // Set a timer to play next slide if good answer
                setTimeout(
                    () => { this.nextSlide(); },
                    800
                );
                // Dislay green overlayer (good answer)
                return(
                    <View style={[styles.gridColumnImageItem, { borderRightWidth: (index == 0 || index == 2) ? 0.5 : 0 }]}>
                        <View style={[styles.gridRowImage, {backgroundColor:'#178c3a', flex:1}]}>
                            <Image style={{flex:1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.7}} source={ { uri: Config.API_DOMAIN+'/uploads/photos'+vocabulary.photo.path+'/'+vocabulary.photo.filename,} } />
                        </View>
                    </View>
                )
            }else{
                // Display red overlayer (wrong answer)
                return(
                    <View style={[styles.gridColumnImageItem, { borderRightWidth: (index == 0 || index == 2) ? 0.5 : 0 }]}>
                        <View style={[styles.gridRowImage, {backgroundColor:'#FF0000', flex:1}]}>
                            <Image style={{flex:1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.7}} source={ { uri: Config.API_DOMAIN+'/uploads/photos'+vocabulary.photo.path+'/'+vocabulary.photo.filename,} } />
                        </View>
                    </View>
                )
            }

        }else{
            // Display not answered, just image cell
            return(
                <View style={[styles.gridColumnImageItem, { borderRightWidth: (index == 0 || index == 2) ? 0.5 : 0 }]}>
                    <TouchableHighlight
                        onPress={() => this.state.soundState != 'playing' && this.state.soundState != 'loading' && this.checkSlideResult(vocabulary, index)}
                        underlayColor="white"
                        activeOpacity={0.7}
                        style={{ flex:1 }}
                        >
                            <View style={styles.gridRowImage}>
                                <Image style={{flex:1}} source={ { uri: Config.API_DOMAIN+'/uploads/photos'+vocabulary.photo.path+'/'+vocabulary.photo.filename,} } />
                            </View>
                    </TouchableHighlight>
                </View>
            )
        }
    }

    checkSlideResult(vocabulary, index)
    {
        let clickedIndexes = this.state.clickedIndexes;
        clickedIndexes[index] = true;
        if(vocabulary.id == this.game.currentVocabulary.id){
            this.setState({ clickedIndexes: clickedIndexes });
        }else{
            this.game.errorCount ++;
            this.setState({ clickedIndexes: clickedIndexes });
        }
    }

    getScore()
    {
        let errorValue = 100 / this.game.vocabularies.length;
        let result = 100 - (errorValue * this.game.errorCount);
        result = Math.round(result);
        return result < 0 ? 0 : result;
    }

    downloadFileAndPlay(vocabulary)
    {
        this.setState({'soundState':'loading', 'soundAutoPlayed':true});

        let soundFile = vocabulary.sound.filename;
        let soundPath = vocabulary.sound.path;
        let extension = vocabulary.sound.extension;

        const downloadDest = RNFS.DocumentDirectoryPath + '/listen.' + extension;
        const download = RNFS.downloadFile(
            {
                fromUrl: Config.API_DOMAIN+'/uploads/files'+soundPath+'/'+soundFile,
                toFile: downloadDest
            }
        );
        download.promise.then(resDownload => {
            var playerSound = new Sound(downloadDest, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    this.setState({'soundState':'waitingClick'});
                    return;
                }
                // loaded successfully
                console.log('duration in seconds: ' + playerSound.getDuration() + 'number of channels: ' + playerSound.getNumberOfChannels());
                // Play the sound with an onEnd callback
                this.setState({'soundState':'playing'});
                playerSound.play((callBackPlay) => {
                    if (callBackPlay == true) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                    this.setState({'soundState':'waitingClick'});
                    playerSound.release();
                });
            });
        }).catch(err => {
            this.setState({'soundState':'waitingClick'});
            console.log("ErrorLoadingSound "+err);
        });
    }

}

module.exports = LessonListenChooseScreen;
