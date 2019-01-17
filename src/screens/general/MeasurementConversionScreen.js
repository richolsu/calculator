import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CustomInput } from '../../components';


const UNIT_INCH = 'inches';
const UNIT_MILLIMETER = 'millimeters';
const UNIT_FEET = 'feet';
const UNIT_CENTIMETER = 'centimeters';
const UNIT_YARD = 'yards';
const UNIT_METER = 'meters';

const UnitConversionTable = {
    [UNIT_INCH]: {
        [UNIT_INCH]: 1,
        [UNIT_MILLIMETER]: 25.4,
        [UNIT_FEET]: 0.083333333333333,
        [UNIT_CENTIMETER]: 2.54,
        [UNIT_YARD]: 0.027777777777778,
        [UNIT_METER]: 0.0254,
    },
    [UNIT_MILLIMETER]: {
        [UNIT_INCH]: 0.039370078740157,
        [UNIT_MILLIMETER]: 1,
        [UNIT_FEET]: 0.0032808398950131,
        [UNIT_CENTIMETER]: 0.1,
        [UNIT_YARD]: 0.0010936132983377,
        [UNIT_METER]: 0.001,
    },
    [UNIT_CENTIMETER]: {
        [UNIT_INCH]: 0.39370078740157,
        [UNIT_MILLIMETER]: 10,
        [UNIT_FEET]: 0.032808398950131,
        [UNIT_CENTIMETER]: 1,
        [UNIT_YARD]: 0.010936132983377,
        [UNIT_METER]: 0.01,
    },
    [UNIT_FEET]: {
        [UNIT_INCH]: 12,
        [UNIT_MILLIMETER]: 304.8,
        [UNIT_FEET]: 1,
        [UNIT_CENTIMETER]: 30.48,
        [UNIT_YARD]: 0.33333333333333,
        [UNIT_METER]: 0.3048,
    },
    [UNIT_YARD]: {
        [UNIT_INCH]: 36,
        [UNIT_MILLIMETER]: 914.4,
        [UNIT_FEET]: 3,
        [UNIT_CENTIMETER]: 91.44,
        [UNIT_YARD]: 1,
        [UNIT_METER]: 0.9144,
    },
    [UNIT_METER]: {
        [UNIT_INCH]: 39.370078740157,
        [UNIT_MILLIMETER]: 1000,
        [UNIT_FEET]: 3.2808398950131,
        [UNIT_CENTIMETER]: 100,
        [UNIT_YARD]: 1.0936132983377,
        [UNIT_METER]: 1,
    },
}
class MeasurementConversionScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Measurement Conversion',
        headerLeft:
            <TouchableOpacity onPress={() => { navigation.toggleDrawer() }} >
                <Icon style={AppStyle.styleSet.menuButton} name="ios-menu" size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.whiteColor} />
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);

        this.state = {
            [UNIT_INCH]: null,
            [UNIT_MILLIMETER]: null,
            [UNIT_FEET]: null,
            [UNIT_CENTIMETER]: null,
            [UNIT_YARD]: null,
            [UNIT_METER]: null
        };
    }



    componentDidMount() {
        this.props.navigation.dispatch({ type: 'SaveRouteName', routeName: this.props.navigation.state.routeName });
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onBack = () => {
        this.props.navigation.dispatch({ type: 'Back', lastScreenRoute: this.props.prevScreenRoute });
        return true;
    }

    onClear = () => {
        this.setState({
            [UNIT_INCH]: null,
            [UNIT_MILLIMETER]: null,
            [UNIT_FEET]: null,
            [UNIT_CENTIMETER]: null,
            [UNIT_YARD]: null,
            [UNIT_METER]: null
        });
    }

    createMessage = () => {
        let message = '';
        for (const key in this.state) {
            message += key + ' = ' + this.state[key] + '\n';
        }
        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Measurement Conversion', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Measurement Conversion', this.createMessage());
    }

    onInput = (key, value) => {
        this.setState({ [key]: value });
        const number = AppStyle.checkValue(value);
        const table = UnitConversionTable[key];
        self = this;
        Object.keys(table).map(unitkey => {
            let conversionValue = Math.round(number * table[unitkey] * 10000) / 10000;

            if (conversionValue == 0) {
                conversionValue = '';
            } else if (conversionValue < 1) {
                conversionValue = conversionValue.toString();
                conversionValue = conversionValue.replace(/^0+/, '');
            } else {
                conversionValue = conversionValue.toString();
            }

            if (key != unitkey) {
                self.setState({ [unitkey]: conversionValue });
            }

        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>Enter a value into any of the fields to convert the measurement to other units of measure.</Text>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Inches"
                        number={true}
                        value={this.state[UNIT_INCH]}
                        onChangeText={(text) => { this.onInput(UNIT_INCH, text) }} />
                    <View style={styles.seperator}></View>
                    <CustomInput
                        style={styles.input}
                        label="Millimeters"
                        number={true}
                        value={this.state[UNIT_MILLIMETER]}
                        onChangeText={(text) => { this.onInput(UNIT_MILLIMETER, text) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Feet"
                        number={true}
                        value={this.state[UNIT_FEET]}
                        onChangeText={(text) => { this.onInput(UNIT_FEET, text) }} />
                    <View style={styles.seperator}></View>
                    <CustomInput
                        style={styles.input}
                        label="Centimeters"
                        number={true}
                        value={this.state[UNIT_CENTIMETER]}
                        onChangeText={(text) => { this.onInput(UNIT_CENTIMETER, text) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Yards"
                        number={true}
                        value={this.state[UNIT_YARD]}
                        onChangeText={(text) => { this.onInput(UNIT_YARD, text) }} />
                    <View style={styles.seperator}></View>
                    <CustomInput
                        style={styles.input}
                        label="Meters"
                        number={true}
                        value={this.state[UNIT_METER]}
                        onChangeText={(text) => { this.onInput(UNIT_METER, text) }} />
                </View>
                <View style={styles.row}>
                    <CustomButton style={styles.btn} mode="clear" label="Clear" onPress={this.onClear} />
                </View>
                <View style={styles.row}>
                    <CustomButton style={styles.btn} mode="link" label="Share" onPress={this.onShare} />
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    description: {
        marginBottom: 30,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'center',
    },
    seperator: {
        flex: 1,
    },
    input: {
        flex: 2,
        paddingLeft: 10,
        borderBottomColor: AppStyle.colorSet.lightGreyColor,
        borderBottomWidth: 2,
    },
    btn: {
        alignSelf: 'center',
    },
    btnSeperator: {
        width: 30,
    },

});

const mapStateToProps = state => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(MeasurementConversionScreen);

