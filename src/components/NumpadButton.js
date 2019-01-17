import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import AppStyle from '../AppStyle';


export default class NumpadButton extends Component {

    render() {
        const btnStyle = {
            backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : 'transparent',
        }
        if (this.props.label == null) {
            btnStyle.opacity = 0;
        }
        const textStyle = {
        }
        if (this.props.textColor) {
            textStyle.color = this.props.textColor;
        }

        onPress = () => {
            if (this.props.onPress) {
                this.props.onPress(this.props.label);
            }
        }

        return (
            <TouchableOpacity disabled={this.props.label == null ? true : false} style={[styles.container, btnStyle]} onPress={onPress} >
                <Text style={[styles.label, textStyle]}>
                    {this.props.label}
                </Text>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppStyle.colorSet.greyColor,
        borderWidth: 1,
        borderColor: AppStyle.colorSet.darkGreyColor,
        borderRadius: 10,
        marginRight: 5,
        flex: 1,
    },
    label: {
        alignSelf: 'center',
        textAlign: 'center',
        margin: 12,
        color: AppStyle.colorSet.darkGreyColor,
        fontSize: AppStyle.fontSet.middle,
    },

});