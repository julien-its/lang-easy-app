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

class LessonMappingScreen extends React.Component {

    static navigationView = null;

    static navigationOptions = { 'title': 'Mapping' };

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
            clickedIndexes: [false, false, false, false],
        };
        this.lesson = null;
        this.game = {
            score: null,
            vocabularies : [],
            playedVocabularies : [],
            unplayedVocabularies: [],
            currentVocabulary: null,
            currentVocabularyIndex: null,
            slideVocabularies: null,
            errorCount: 0,
            viewVocabularies:[],
            viewWords:[],
            viewTranslations:[]
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
        // Set random 6 vocabulary to show
        for(i=0; i<6; i++){
            this.game.viewVocabularies.push(this.game.unplayedVocabularies[i]);
        }

        // Split this 6 vocabulary in two rows and mixed them
        for(i=0; i<this.game.viewVocabularies.length; i++){
            this.game.viewWords.push(this.game.viewVocabularies[i]);
        }
        for(i=0; i<this.game.viewVocabularies.length; i++){
            this.game.viewTranslations.push(this.game.viewVocabularies[i]);
        }
    }

    // Initialize the game variables
    initGame(vocabularies)
    {
        this.game.vocabularies = vocabularies;
        this.game.unplayedVocabularies = vocabularies;
        this.setViewVocabularies();
        this.setState({
            loaded: true,
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

    getRowsItems()
    {
        let rows = [];
        for(i=0; i<this.game.viewWords.length; i++){
            rows.push(this.getRowItems(i));
        } 
        return rows;
    }

    getRowItems()
    {
        return(
            <View style={[styles.gridRow, { marginBottom:15 }]}>
                <TouchableHighlight
                    onPress={() => { Alert.alert('ok');} }
                    underlayColor="white"
                    activeOpacity={0.7}
                    style={{ flex:1, marginRight:5 }}
                    >
                        <View style={ styles.buttonFullWidth }>
                            <Text style={styles.buttonText}>Word 1</Text>
                        </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => { Alert.alert('ok');} }
                    underlayColor="white"
                    activeOpacity={0.7}
                    style={{ flex:1, marginLeft:5 }}
                    >
                        <View style={ styles.buttonFullWidth }>
                            <Text style={styles.buttonText}>Word 2</Text>
                        </View>
                </TouchableHighlight>
            </View>
        );
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
                        { this.getRowsItems() }
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

module.exports = LessonMappingScreen;
