'use strict'
import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';

module.exports = StyleSheet.create({
    containerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    containerFull: {
        backgroundColor: '#F5FCFF',
        flex:1,
    },
    navigationMenuItem: {
        margin: 10,
    },
    navitationtextItem: {
        fontSize: 14,
        margin: 5,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    rowButton:{
        width: '100%',
        backgroundColor: '#f6f7f8',
        padding: 15,
        borderColor: '#AAA',
        borderBottomWidth: 0.5
    },
    rowButtonText:{
        fontSize:14,
        color: '#333',
        textAlign: 'left',
    },

    gridRow: {
        flexDirection: 'row',
    },
    gridColumnItem: {
        flexDirection: 'column',
        flex:1,
        height: 120,
        backgroundColor: "#f6f7f8",
        borderColor: "#AAA",
        borderBottomWidth: 0.5
    },
    gridRowButton:{
        padding: 20,
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridRowButtonIcon:{
        color: "#333",
        fontSize: 40,
    },


    fullSlideWrapper: {
        flex:1,
        backgroundColor: '#e9eaed',
        padding: 20,
    },
    fullSlideBlocWrapper: {
        marginTop: 10,
        marginBottom: 20,
    },

    boxInner: {
        backgroundColor: '#f6f7f8',
        padding: 10,
        marginBottom: 15,
    },
    box: {
        backgroundColor: '#f6f7f8',
        marginBottom: 20,
        padding: 10,
    },

    boxTitle: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    boxText:{ fontSize: 14, },
    boxTextTitle:{ fontSize: 16, marginBottom: 8, },

    buttonFullWidth:{
        width: '100%',
        backgroundColor: '#841584',
        padding: 5,
    },
    buttonFullWidthDisabled:{
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
