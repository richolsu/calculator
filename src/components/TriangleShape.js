import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppStyle from '../AppStyle';

export default class TriangleShape extends Component {


    render() {
        const angle = this.props.angle;
        const borderWidth = this.props.borderWidth;
        const outerWidth = this.props.width;
        const tanDegree = Math.tan(angle * Math.PI / 180);
        const outerHeight = outerWidth / 2 * tanDegree;
        const innerHeight = outerHeight - 2 * borderWidth;
        const innerWidth = 2 * innerHeight / tanDegree;

        const outerTriangleStyle = {
            borderLeftWidth: outerWidth * 0.5,
            borderRightWidth: outerWidth * 0.5,
            borderBottomWidth: outerHeight,
            borderBottomColor: this.props.borderColor,
        };
        const innerTriangleStyle = {
            borderLeftWidth: innerWidth * 0.5,
            borderRightWidth: innerWidth * 0.5,
            borderBottomWidth: innerHeight,
            borderBottomColor: this.props.backgroundColor,
            left: 2 * borderWidth / tanDegree,
            bottom: borderWidth,
        };
        const left = angle < 30 ? 50 : 30;
        const angleStyle = {
            left: left,
            bottom: 5 * (angle / 45),
        };

        return (
            <View>
                <View style={[styles.outerTriangle, outerTriangleStyle]}></View>
                <View style={[styles.innerTriangle, innerTriangleStyle]}></View>
                <Text style={[styles.angle, angleStyle]}>{this.props.angle}°</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    angle: {
        position: 'absolute',
        left: 30,
        bottom: 3,
        color: AppStyle.colorSet.whiteColor,
        fontWeight: 'bold',
    },
    outerTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: AppStyle.colorSet.blackColor,
    },
    innerTriangle: {
        position: 'absolute',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: AppStyle.colorSet.mainColor,
    },
});