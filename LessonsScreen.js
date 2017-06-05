import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight
} from 'react-native';
import Config from './Config';
import { DrawerLayoutAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import styles from './Styles';

class ButtonRow extends React.Component {
    render(){
        return (
            <TouchableHighlight
                onPress={() => { this.props.onPress() }}
                underlayColor="white"
                activeOpacity={0.7}
                >
                <View style={ styles.rowButton}>
                    <Text style={styles.rowButtonText}>{ this.props.text }</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

class LessonsScreen extends React.Component {

    static navigationOptions = {
        title: 'lessons',
    };

    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            currentView: 'lessons',
            dataSource: ds.cloneWithRows([]),
            loaded: false
        };
    }

    render() {
        const { navigate } = this.props.navigation;
        let navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
                <Icon.Button style={[styles.navigationMenuItem]} name="home" onPress={() => navigate('Lesson')} color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.navitationtextItem]}>Lesson 1</Text>
                </Icon.Button>
                <Icon.Button style={[styles.navigationMenuItem]} name="book" onPress={() => navigate('Lesson')}  color='#455A64' backgroundColor="#fff" borderRadius={0}>
                    <Text style={[styles.navitationtextItem]}>Lesson 2</Text>
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

    renderLoadedView()
    {
        const { navigate } = this.props.navigation;
        return (
            <DrawerLayoutAndroid
                ref={'DRAWER_REF'}
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => this.navigationView}>
                <View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(lesson) => <ButtonRow onPress={() => navigate('Lesson', { id : lesson.id, title: lesson.title }) } text={lesson.number + " - " + lesson.title} /> }
                    />
                </View>
            </DrawerLayoutAndroid>
        );
    }

    componentDidMount()
    {
        this.fetchData();
    };

    fetchData()
    {
        fetch(Config.API_LESSONS_URL)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    loaded: true
                });
            })
            .done();
    };

}

module.exports = LessonsScreen;
