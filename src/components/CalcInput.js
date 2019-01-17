import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import AppStyle from '../AppStyle';


export default class CalcInput extends Component {

    render() {
        return (
            <TouchableOpacity style={[styles.containerStyle, this.props.containerStyle]} onPress={this.props.onPress}>
                <Text style={[styles.label, this.props.style]}>{this.props.label}</Text>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    containerStyle: {
        padding: 10,
        minHeight: 50,
    },
    label: {
        color: AppStyle.colorSet.darkGreyColor,
        fontSize: AppStyle.fontSet.middle,

    },
});