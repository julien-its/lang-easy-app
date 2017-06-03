/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
var LessonsScreen = require('./LessonsScreen.js');
var LessonScreen = require('./LessonScreen.js');
var HomeScreen = require('./HomeScreen.js');

const LangEasyApp = StackNavigator(
    {
        Home: { screen: LessonScreen },
        Lessons: { screen: LessonsScreen },
        Lesson: { screen: LessonScreen },
    },
    {
        mode: 'modal',
    }
);

AppRegistry.registerComponent('LangEasy', () => LangEasyApp);
