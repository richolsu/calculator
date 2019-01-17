import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import AppStyle from '../AppStyle';

export default class CustomSelect extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{this.props.label}</Text>
                <ModalSelector
                    touchableActiveOpacity={0.9}
                    data={this.props.data}
                    animationType={'fade'}
                    sectionTextStyle={styles.sectionTextStyle}
                    optionTextStyle={styles.optionTextStyle}
                    optionContainerStyle={styles.optionContainerStyle}
                    cancelContainerStyle={styles.cancelContainerStyle}
                    cancelTextStyle={styles.cancelTextStyle}
                    selectedItemTextStyle={styles.selectedItemTextStyle}
                    backdropPressToClose={true}
                    cancelText={'Cancel'}
                    disabled={this.props.disabled}
                    initValue={this.props.initValue}
                    onChange={this.props.onChange}>
                    <Text style={[styles.text, this.props.textStyle]}>{this.props.initValue}</Text>
                </ModalSelector>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
    },
    label: {
        color: AppStyle.colorSet.darkGreyColor,
        fontSize: AppStyle.fontSet.small,
    },
    text: {
        paddingTop: 10,
        paddingBottom: 10,
        color: AppStyle.colorSet.blackColor,
        fontSize: AppStyle.fontSet.normal,
        borderBottomColor: AppStyle.colorSet.lightGreyColor,
        borderBottomWidth: 2,
    },
    optionTextStyle: {
        color: AppStyle.colorSet.blackColor,
        fontSize: 16,
    },
    selectedItemTextStyle: {
        fontSize: 18,
        color: AppStyle.colorSet.mainColor,
        fontWeight: 'bold',
    },
    optionContainerStyle: {
        backgroundColor: AppStyle.colorSet.whiteColor
    },
    cancelContainerStyle: {
        backgroundColor: AppStyle.colorSet.whiteColor,
        borderRadius: 10,
    },
    sectionTextStyle: {
        fontSize: 21,
        color: AppStyle.colorSet.blackColor,
        fontWeight: 'bold',
    },
    cancelTextStyle: {
        fontSize: 21,
        color: AppStyle.colorSet.mainColor
    }
});