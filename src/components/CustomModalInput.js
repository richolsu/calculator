import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet, Modal, TouchableHighlight, Platform, Keyboard } from 'react-native';
import AppStyle from '../AppStyle';


export default class CustomModalInput extends Component {

    state = {
        modalVisible: false,
        value: this.props.value,
        feet: parseInt(AppStyle.checkValue(this.props.value) / 12).toString(),
        inches: parseInt(AppStyle.checkValue(this.props.value) % 12).toString()
    };

    componentDidMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide= ()=> {
        if (Platform.OS == 'ios') {
            this.setState({ modalVisible: false });
        }        
    }

    getValueLabel = () => {
        let label = '';
        if (this.props.editable != false) {
            label = AppStyle.getFeetInchLabel(this.props.value);
        } else {
            label = this.props.value;
        }

        return label;
    }

    setModalVisible(visible) {
        if (visible) {
            this.setState({
                feet: parseInt(AppStyle.checkValue(this.props.value) / 12).toString(),
                inches: parseInt(AppStyle.checkValue(this.props.value) % 12).toString()
            });
        }
        this.setState({ modalVisible: visible });
    }

    onDirectInput = (input) => {
        const feet = (parseInt(parseInt(input) / 12)).toString();
        const inches = (parseInt(input) % 12).toString();
        this.setState({
            value: input,
            feet: feet,
            inches: inches
        });

        this.props.onChangeText(input);
    }

    onInput = (key, value) => {
        this.setState({ [key]: value });
        if (value == '') {
            value = 0;
        }
        let inches = 0;
        if (key == 'feet') {
            inches = AppStyle.checkValue(this.state.inches) + AppStyle.checkValue(value) * 12;
        } else {
            inches = AppStyle.checkValue(value) + AppStyle.checkValue(this.state.feet) * 12;
        }

        this.props.onChangeText(inches.toString());
    }

    onConfirm = () => {
        // alert('hi');
        this.setModalVisible(false);
    }

    onModalShow = () => {
        this.firstTextInput.focus();
    }

    render() {

        const textAlign = this.props.center ? 'center' : 'left';
        const paddingLeft = this.props.center ? {} : { paddingLeft: 0 };

        return (
            <View style={this.props.style}>
                <Text style={[styles.label, { textAlign: textAlign }]}>{this.props.label}</Text>
                {this.props.editable == null &&
                    <TouchableHighlight underlayColor={AppStyle.colorSet.modalBgGreayColor} onPress={() => { this.setModalVisible(true) }}>
                        <Text style={[styles.input, paddingLeft, { textAlign: textAlign }]}>{this.getValueLabel()}</Text>
                    </TouchableHighlight>
                }
                {this.props.editable == false &&
                    <Text style={[styles.input, paddingLeft, { textAlign: textAlign }]}>{this.getValueLabel()}</Text>
                }
                <Modal
                    animationType="none"
                    transparent={true}
                    onShow={this.onModalShow}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}>
                    <TouchableHighlight onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                        <View>
                            <View style={styles.container}>
                                <View style={styles.inputPanel}>
                                    <View style={styles.feetInputView}>
                                        <Text style={[styles.label, { textAlign: 'center' }]}>Feet ( ' )</Text>
                                        <TextInput
                                            autoFocus={true}
                                            blurOnSubmit={false}
                                            autoFocus={true}
                                            keyboardType={'numeric'}
                                            returnKeyType={"next"}
                                            selectTextOnFocus={true}
                                            ref={(input) => { this.firstTextInput = input; }}
                                            style={[styles.input, { paddingLeft: 0, textAlign: 'center' }]}
                                            onSubmitEditing={() => { this.secondTextInput.focus(); }}
                                            value={this.state.feet}
                                            underlineColorAndroid='transparent'
                                            placeholderTextColor={AppStyle.colorSet.greyColor}
                                            onChangeText={(text) => { this.onInput('feet', text) }} />
                                    </View>
                                    <View style={styles.feetInputView}>
                                        <Text style={[styles.label, { textAlign: 'center' }]}>Inches ( " )</Text>
                                        <TextInput
                                            keyboardType={'numeric'}
                                            ref={(input) => { this.secondTextInput = input; }}
                                            style={[styles.input, { paddingLeft: 0, textAlign: 'center' }]}
                                            value={this.state.inches}
                                            selectTextOnFocus={true}
                                            onSubmitEditing={() => { this.setModalVisible(false); }}
                                            underlineColorAndroid='transparent'
                                            placeholderTextColor={AppStyle.colorSet.greyColor}
                                            onChangeText={(text) => { this.onInput('inches', text) }} />
                                    </View>
                                </View>
                            </View>

                        </View>
                    </TouchableHighlight>
                </Modal>
            </View>
        )
    }

}

const PADDING = 30;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: AppStyle.colorSet.modalBgGreayColor,
    },
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
    },
    inputPanel: {
        alignSelf: 'center',
        padding: PADDING,
        paddingRight: 0,
        marginTop: 200,
        backgroundColor: AppStyle.colorSet.feetInputGrey,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 3,
        borderColor: AppStyle.colorSet.lightGreyColor,
    },
    feetInputView: {
        marginRight: PADDING,
        width: 100,
        borderBottomColor: AppStyle.colorSet.lightGreyColor,
        borderBottomWidth: 2,
    },
});