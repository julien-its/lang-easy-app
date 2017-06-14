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
let HomeScreen = require('./HomeScreen.js');
let LessonsScreen = require('./LessonsScreen.js');
let LessonScreen = require('./LessonScreen.js');
let LessonVocabularyScreen = require('./LessonVocabularyScreen.js');
let LessonFindImageScreen = require('./LessonFindImageScreen.js');
let LessonMatchingScreen = require('./LessonMatchingScreen.js');

const LangEasyApp = StackNavigator(
    {
        Home: { screen: LessonMatchingScreen },
        Lessons: { screen: LessonsScreen },
        Lesson: { screen: LessonScreen },
        LessonVocabulary: { screen: LessonVocabularyScreen },
        LessonFindImage: { screen: LessonFindImageScreen },
        LessonMatching: { screen: LessonMatchingScreen },
    },
    {
        mode: 'modal',
    }
);

AppRegistry.registerComponent('LangEasy', () => LangEasyApp);
