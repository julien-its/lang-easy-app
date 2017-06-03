import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Alert,
    TouchableHighlight
} from 'react-native';
import { DrawerLayoutAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import Swiper from 'react-native-swiper';

var RNFS = require('react-native-fs');
var Sound = require('react-native-sound');

var API_URL = 'http://www.julien-gustin.be/files/lesson.json';

class ButtonListen extends React.Component {
    render(){
        return (
            <TouchableHighlight
                onPress={() => { this.props.onPress() }}
                underlayColor="white"
                activeOpacity={0.7}
                disabled={this.props.disabled}
                >
                <View style={ this.props.disabled ? styles.buttonDisabled : styles.button}>
                    <Text style={styles.buttonText}>{ this.props.text }</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

class LessonScreen extends React.Component {

    static navigationView = null;

    static navigationOptions = { title: 'Lesson 1', 'header': null };

    constructor()
    {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            currentView: 'lesson',
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
        var soundsState = [];

        fetch(API_URL)
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
                <Icon.Button style={[styles.menuItem]} name="home" onPress={() => navigate('Home')} color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.textItem]}>Lesson 1</Text>
                </Icon.Button>
                <Icon.Button style={[styles.menuItem]} name="book" onPress={() => navigate('Lessons')} color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.textItem]}>Lessons</Text>
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
                <View style={styles.container}>
                    <Animatable.Text animation="rotate" iterationCount="infinite" direction="normal">
                        <Icon name="circle-o-notch" style={styles.spinner}  size={30} color="#900" />
                    </Animatable.Text>
              </View>
            </DrawerLayoutAndroid>
        );
    }

    downloadFileAndPlay(index)
    {
        this.setState({'soundState':'loading'});
        console.log('Load '+ index);
        const downloadDest = RNFS.DocumentDirectoryPath + '/listen.mp3';
        const download = RNFS.downloadFile(
            {
                fromUrl: 'http://www.julien-gustin.be/files/sample.mp3',
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
            console.log(err);
        });
    }

    renderLoadedView()
    {
        // OnClick event
        const _downloadFileAndPlay = () => {
            this.downloadFileAndPlay();
        };

        var slidesList = this.state.lesson.vocabularies.map(function(item, i){

            var buttonText = "Listen";
            if(this.state.soundState == 'loading'){
                buttonText = 'Loading';
            }
            if(this.state.soundState == 'playing'){
                buttonText = 'Playing';
            }

            return (
                <View style={styles.slideWrapper} key={i}>
                    <View style={styles.slideBlock}>
                        <Text style={styles.textTitle}>{item.word}</Text>
                        <Text style={styles.text}>{item.translation}</Text>
                        <Text style={styles.text}>{item.phonetic}</Text>
                    </View>
                    <View style={styles.slideBlock}>
                        <Text style={styles.textTitle}>Examples</Text>
                    </View>
                    <ButtonListen onPress={_downloadFileAndPlay} text={buttonText} disabled={buttonText != "Listen"} />
                </View>
            )
        }, this);

        return (
            <DrawerLayoutAndroid
                ref={'DRAWER_REF'}
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => this.navigationView}>
                <View style={styles.containerVocabulary}>
                    <Swiper style={styles.wrapperSwiper} showsButtons={true} showsPagination={true}>
                        { slidesList }
                    </Swiper>
              </View>
            </DrawerLayoutAndroid>
        );
    }

    renderVocabulary(item)
    {
        return (
            <View style={styles.rowContainer}>
                <View style={styles.rightContainer}>
                    <Text style={styles.title} >{item.word} {item.translation}</Text>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    containerVocabulary: {
        backgroundColor: '#F5FCFF',
    },
    rowContainer: {

    },
    rightContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    year: {
        textAlign: 'center',
    },
    thumbnail: {
        width: 53,
        height: 81,
    },
    listView: {
        paddingTop: 0,
        backgroundColor: '#F5FCFF',
    },
    wrapperSwiper: {

    },
    slideWrapper: {
        flex:1,
        backgroundColor: '#e9eaed',
        padding: 20,
    },
    slideBlock: {
        backgroundColor: '#f6f7f8',
        marginBottom: 20,
        padding: 10,
    },
    text:{ fontSize: 14, },
    textTitle:{ fontSize: 16, marginBottom: 8, },
    button:{
        width: '100%',
        backgroundColor: '#841584',
        padding: 5,
    },
    buttonDisabled:{
        width: '100%',
        backgroundColor: 'rgba(142,25,142,0.5)',
        opacity: 0.4,
        padding: 5,
    },
    buttonText:{
        fontSize:18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    }
});

module.exports = LessonScreen;
