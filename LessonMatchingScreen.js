import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Alert,
    Image,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import Config from './Config';
import { DrawerLayoutAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import styles from './Styles';
import shuffle from 'shuffle-array';

class LessonMatchingScreen extends React.Component {

    static navigationView = null;

    static navigationOptions = { 'title': 'Matching' };

    constructor()
    {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            currentView: 'lessonVocabulary',
            dataSource: ds.cloneWithRows([]),
            loaded: false,
            currentSlide : null,
            endGame: false,
            clickedWord: null,
            clickedTranslation: null,
            errorMatching: false,
            successMatching: false
        };
        this.lesson = null;
        this.game = {
            score: null,
            vocabularies : [],
            errorCount: 0,
            viewVocabularies:[],
            viewWords:[],
            viewTranslations:[],
            locked: false
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
                this.lesson = responseData;
                this.initGame(responseData.vocabularies);
            })
            .done();
    };

    setViewVocabularies()
    {
        this.game.viewWords = this.game.vocabularies.slice(0);
        this.game.viewTranslations = this.game.vocabularies.slice(0);

        shuffle(this.game.viewWords);
        shuffle(this.game.viewTranslations);
    }

    // Initialize the game variables
    initGame(vocabularies)
    {
        this.game.vocabularies = vocabularies;
        this.setViewVocabularies();
        this.setState({
            loaded: true,
        });
    }

    replay()
    {
        this.game = {
            score: null,
            vocabularies : this.game.vocabularies,
            errorCount: 0,
            viewVocabularies:[],
            viewWords:[],
            viewTranslations:[],
            locked: false
        };

        this.game.viewWords = this.game.vocabularies.slice(0);
        this.game.viewTranslations = this.game.vocabularies.slice(0);

        console.log(this.game.viewWords);
        console.log(this.game.viewWords.length);

        shuffle(this.game.viewWords);
        shuffle(this.game.viewTranslations);

        this.setState({
            endGame: false,
            clickedWord: null,
            clickedTranslation: null,
            errorMatching: false,
            successMatching: false
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
            return this.renderGameView();
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

    getColItems(type)
    {
        let items = [];
        for(i=0; i<this.game.viewWords.length; i++){
            items.push(this.getColItem(i, type));
        }
        return items;
    }

    getColItem(index, type)
    {
        let text = null;
        let vocabulary = null;
        let clicked = false;
        let styleClicked = {  };
        if(type == 'word'){
            text = this.game.viewWords[index].word;
            vocabulary = this.game.viewWords[index];
            // Check if already clicked to apply color style
            if(this.state.clickedWord != null){
                if(this.state.clickedWord == index){
                    clicked = true;
                    if(this.state.errorMatching){
                        styleClicked = { backgroundColor:'#bf231e' };
                    }else if(this.state.successMatching){
                        styleClicked = { backgroundColor:'#15843a' };
                    }else{
                        styleClicked = { backgroundColor:'#bf6c1e' };
                    }
                }
            }
        }else{
            text = this.game.viewTranslations[index].translation;
            vocabulary = this.game.viewTranslations[index];
            // Check if already clicked to apply color style
            if(this.state.clickedTranslation != null){
                if(this.state.clickedTranslation == index){
                    clicked = true;
                    if(this.state.errorMatching){
                        styleClicked = { backgroundColor:'#bf231e' };
                    }else if(this.state.successMatching){
                        styleClicked = { backgroundColor:'#15843a' };
                    }else{
                        styleClicked = { backgroundColor:'#bf6c1e' };
                    }
                }
            }
        }


        return(
            <View key={"row-"+type+'-'+index} style={{ marginBottom:15 }}>
                <TouchableHighlight
                    onPress={() => { this.checkClickedResult(index, type) } }
                    underlayColor="white"
                    activeOpacity={0.7}
                    >
                        <View style={[ styles.buttonFullWidth, styleClicked ]}>
                            <Text style={[styles.buttonText, { fontSize:13, paddingTop:10, paddingBottom:10 }]}>{text}</Text>
                        </View>
                </TouchableHighlight>
            </View>
        );
    }

    setError()
    {
        this.game.locked = false;
        this.game.errorCount ++;
        this.setState({
            clickedWord: null,
            clickedTranslation: null,
            successMatching: false,
            errorMatching: false
        });
    }

    setMatch()
    {
        this.game.locked = false;
        this.game.viewWords.splice(this.state.clickedWord, 1);
        this.game.viewTranslations.splice(this.state.clickedTranslation, 1);
        this.setState({
            clickedWord: null,
            clickedTranslation: null,
            successMatching: false,
            errorMatching: false,
            endGame: this.game.viewWords.length == 0
        });
    }

    checkClickedResult(index, type)
    {
        if(this.game.locked){
            return false;
        }

        if(type == 'word'){
            // Clicked on word
            if(this.state.clickedTranslation != null){
                if(this.game.viewWords[index].id == this.game.viewTranslations[this.state.clickedTranslation].id){
                    setTimeout(() => { this.setMatch(); }, 300);
                    this.game.locked = true;
                    this.setState({clickedWord: index, successMatching:true});
                }else{
                    setTimeout(() => { this.setError(); }, 500);
                    this.game.locked = true;
                    this.setState({clickedWord: index, errorMatching:true});
                }
            }else{
                this.setState({clickedWord: index});
            }
        }else{
            // Clicked on translation
            if(this.state.clickedWord != null){
                // If two sides clicked, apply succes or error with timeout
                if(this.game.viewTranslations[index].id == this.game.viewWords[this.state.clickedWord].id){
                    setTimeout(() => { this.setMatch(); }, 300);
                    this.game.locked = true;
                    this.setState({clickedTranslation: index, successMatching:true});
                }else{
                    setTimeout(() => { this.setError(); }, 500);
                    this.game.locked = true;
                    this.setState({clickedTranslation: index, errorMatching:true});
                }
            }else{
                this.setState({clickedTranslation: index});
            }
        }
    }

    renderGameView()
    {
        return (
            <DrawerLayoutAndroid
                ref={'DRAWER_REF'}
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => this.navigationView}>
                <View style={styles.containerFull}>
                    <View style={styles.containerBoxed}>
                        <ScrollView style={{ paddingRight:5 }}>
                        <View style={styles.gridRow}>
                            <View style={{ flex:1, marginRight:5 }}>
                                { this.getColItems('word') }
                            </View>
                            <View style={{ flex:1, marginLeft:5 }}>
                                { this.getColItems('translation') }
                            </View>
                        </View>
                        </ScrollView>
                    </View>
              </View>
            </DrawerLayoutAndroid>
        );
    }

    getScore()
    {
        let errorValue = 100 / this.game.vocabularies.length;
        let result = 100 - (errorValue * this.game.errorCount);
        result = Math.round(result);
        return result < 0 ? 0 : result;
    }
}

module.exports = LessonMatchingScreen;
