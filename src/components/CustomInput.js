import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import AppStyle from '../AppStyle';


export default class CustomInput extends Component {

    render() {

        const textAlign = this.props.center ? 'center' : 'left';
        const secureTextEntry = this.props.secureTextEntry ? this.props.secureTextEntry : false;
        const paddingLeft = this.props.center ? {} : { paddingLeft: 0 };
        const keyboardType = this.props.number ? 'numeric' : 'default';
        const returnKeyType = this.props.returnKeyType ? this.props.returnKeyType : 'done';
        const selectTextOnFocus = this.props.selectTextOnFocus == undefined ? true : this.props.selectTextOnFocus;

        console.log(this.props);
        return (
            <View style={this.props.style}>
                <Text style={[styles.label, { textAlign: textAlign }]}>{this.props.label}</Text>
                <TextInput
                    ref={this.props.inputRef}
                    keyboardType={keyboardType}
                    autoFocus={this.props.autoFocus}
                    selectTextOnFocus={selectTextOnFocus}
                    secureTextEntry={secureTextEntry}
                    returnKeyType={returnKeyType}
                    inputAccessoryViewID={this.props.inputAccessoryViewID}
                    onSubmitEditing={this.props.onSubmitEditing}
                    editable={this.props.editable}
                    autoCapitalize={'words'}
                    style={[styles.input, paddingLeft, { textAlign: textAlign }]}
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={AppStyle.colorSet.greyColor}
                    underlineColorAndroid='transparent' />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    label: {
        color: AppStyle.colorSet.darkGreyColor,
        fontSize: AppStyle.fontSet.small,
    },
    input: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        minHeight: 50,
        color: AppStyle.colorSet.blackColor,
        fontSize: AppStyle.fontSet.middle,
    }
});