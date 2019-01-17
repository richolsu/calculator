import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Button from 'react-native-button';
import AppStyle from '../AppStyle';

export default class CustomButton extends Component {

    render() {
        let containerStyle = styles.primaryContainer;
        let textStyle = styles.primaryText;

        if (this.props.mode == 'clear') {
            containerStyle = styles.clearContainer;
            textStyle = styles.clearText;
        } else if (this.props.mode == 'link') {
            containerStyle = styles.linkContainer;
            textStyle = styles.linkText;
        }

        let sepecialStyle = {}
        if (this.props.containerStyle) {
            sepecialStyle = this.props.containerStyle;
        }

        return (
            <Button containerStyle={[styles.container, containerStyle, sepecialStyle]} style={[textStyle, this.props.style]} onPress={this.props.onPress}>{this.props.label}</Button>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        borderRadius: 2,
        minWidth: 100,
        padding: 15,
        paddingTop: 8,
        paddingBottom: 8,
        alignSelf: 'center'
    },
    primaryContainer: {
        backgroundColor: AppStyle.colorSet.mainColor,
    },
    primaryText: {
        color: AppStyle.colorSet.whiteColor
    },
    clearContainer: {
        backgroundColor: AppStyle.colorSet.transparent,
        borderWidth: 0.5,
        borderColor: AppStyle.colorSet.darkGreyColor,
    },
    clearText: {
        color: AppStyle.colorSet.darkGreyColor
    },
    linkContainer: {
        backgroundColor: AppStyle.colorSet.transparent,
    },
    linkText: {
        color: AppStyle.colorSet.mainColor
    },
});