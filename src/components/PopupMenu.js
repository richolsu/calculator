import React, { Component } from 'react';
import { findNodeHandle, TouchableOpacity, UIManager, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppStyle from '../AppStyle';


export default class PopupMenu extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icon: null
        }
    }

    onError() {
        console.log('Popup Error')
    }

    onPress = () => {
        if (this.state.icon) {
            UIManager.showPopupMenu(
                findNodeHandle(this.state.icon),
                this.props.actions,
                this.onError,
                this.props.onPress
            )
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.onPress}>
                    <Icon
                        style={this.props.style}
                        name='md-more'
                        size={AppStyle.iconSizeSet.normal}
                        color={AppStyle.colorSet.whiteColor}
                        ref={this.onRef} />
                </TouchableOpacity>
            </View>
        )
    }

    onRef = icon => {
        if (!this.state.icon) {
            this.setState({ icon })
        }
    }
}