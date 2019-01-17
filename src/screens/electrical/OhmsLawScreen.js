import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CustomInput } from '../../components';

class OhmsLawScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Ohm\'s Law',
        headerLeft:
            <TouchableOpacity onPress={() => { navigation.toggleDrawer() }} >
                <Icon style={AppStyle.styleSet.menuButton} name="ios-menu" size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.whiteColor} />
            </TouchableOpacity>,
        headerRight:
            <TouchableOpacity onPress={() => { navigation.state.params.onProjects() }} >
                <Text style={AppStyle.styleSet.rightNavButton}>PROJECTS</Text>
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);

        this.state = {
            current: '',
            voltage: '',
            resistance: '',
            power: '',
        };

        this.project = props.navigation.getParam('data');

        if (this.project) {
            this.state = this.project.data;
        } else {
            this.project = {
                calculation: this.props.navigation.state.routeName,
                name: '',
                customer_name: '',
                notes: '',
            };
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onProjects: this.onProjects
        });
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

    onProjects = () => {
        
        if (this.props.isLoggedIn) {
            this.props.navigation.dispatch({ type: 'Project', routeName: this.props.navigation.state.routeName, calculation: 'OhmsLaw' });
        } else {
            this.props.navigation.dispatch({ type: 'GoToProject', routeName: this.props.navigation.state.routeName, calculation: 'OhmsLaw' });
            this.props.navigation.navigate('Login');
        }
    }

    onClear = () => {
        this.setState({
            current: null,
            voltage: null,
            resistance: null,
            power: null,
        });
    }

    onSaveToProject = () => {
        this.project.data = this.state;
        if (this.props.isLoggedIn) {
            this.props.navigation.dispatch({ type: 'EditProject', payload: this.project, routeName: this.props.navigation.state.routeName });
        } else {
            this.props.navigation.dispatch({ type: 'SaveToProject', payload: this.project, routeName: this.props.navigation.state.routeName });
            this.props.navigation.navigate('Login');
        }
    }

    createMessage = () => {
        let message = '';
        message += 'Current (I) (amps) = ' + this.state.current + '\n';
        message += 'Voltage (V) (volts) = ' + this.state.voltage + '\n';
        message += 'Resistance (R) (ohms) = ' + this.state.resistance + '\n';
        message += 'Power (P) (watts) = ' + this.state.power + '\n';

        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Ohm\'s Law', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Ohm\'s Law', this.createMessage());
    }

    onInput = (key, value) => {
        this.setState({ [key]: value });
    }

    formatValue = (value) => {
        return (Math.round(value * 1000000) / 1000000).toString();
    }

    calc = () => {
        const values = Object.keys(this.state).map((key) => {
            return AppStyle.checkValue(this.state[key]);
        });

        let current = values[0];
        let voltage = values[1];
        let resistance = values[2];
        let power = values[3];

        if (current) {
            if (voltage) {
                resistance = this.formatValue(voltage / current);
                power = this.formatValue(voltage * current);
                this.setState({ resistance: resistance, power: power });
            } else if (resistance) {
                voltage = this.formatValue(current * resistance);
                power = this.formatValue(voltage * current);
                this.setState({ voltage: voltage, power: power });
            } else if (power) {
                voltage = this.formatValue(power / current);
                resistance = this.formatValue(voltage / current);
                this.setState({ voltage: voltage, resistance: resistance });
            }
        } else if (voltage) {
            if (resistance) {
                current = this.formatValue(voltage / resistance);
                power = this.formatValue(voltage * current);
                this.setState({ current: current, power: power });
            } else if (power) {
                current = this.formatValue(power / voltage);
                resistance = this.formatValue(voltage / current);
                this.setState({ current: current, resistance: resistance });
            }
        } else if (resistance) {
            if (power) {
                current = this.formatValue(Math.pow(power / resistance, 1 / 2));
                voltage = this.formatValue(current * resistance);
                this.setState({ voltage: voltage, current: current });
            }
        }
    }

    render() {

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>Select the phase and enter the power factor, volts, and amperes to calculate the number of watts.</Text>

                <CustomInput
                    style={styles.input}
                    label="Current (I) (amps)"
                    number={true}
                    returnKeyType="next"
                    onSubmitEditing={() => { this.voltageInput.focus(); }}
                    onChangeText={(text) => { this.onInput('current', text) }}
                    value={this.state.current} />
                <CustomInput
                    style={styles.input}
                    label="Voltage (V) (volts)"
                    number={true}
                    returnKeyType="next"
                    onSubmitEditing={() => { this.resInput.focus(); }}
                    inputRef={(c) => this.voltageInput = c}
                    onChangeText={(text) => { this.onInput('voltage', text) }}
                    value={this.state.voltage} />
                <CustomInput
                    style={styles.input}
                    number={true}
                    returnKeyType="next"
                    onSubmitEditing={() => { this.powerInput.focus(); }}
                    inputRef={(c) => this.resInput = c}
                    onChangeText={(text) => { this.onInput('resistance', text) }}
                    label="Resistance (R) (ohms)"
                    value={this.state.resistance} />
                <CustomInput
                    style={styles.input}
                    number={true}
                    inputRef={(c) => this.powerInput = c}
                    onChangeText={(text) => { this.onInput('power', text) }}
                    label="Power (P) (watts)"
                    value={this.state.power} />

                <View style={styles.row}>
                    <View style={styles.btnView}>
                        <CustomButton style={styles.btn} label="Calculate" onPress={this.calc} />
                    </View>
                    <View style={styles.btnView}>
                        <CustomButton style={styles.btn} mode="clear" label="Clear" onPress={this.onClear} />
                    </View>
                </View>
                <View style={[styles.row, { marginTop: 40 }]}>
                    <CustomButton style={styles.btn} mode="link" label="Save to Project" onPress={this.onSaveToProject} />
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
        marginBottom: 10,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 5,
        marginTop: 15,
        borderBottomColor: AppStyle.colorSet.lightGreyColor,
        borderBottomWidth: 2,
    },
    btnView: {
        flex: 1,
    },
    btn: {
        alignSelf: 'center',
    },
    wattsLabel: {
        fontSize: AppStyle.fontSet.middle,
    },
    wattsValue: {
        fontSize: AppStyle.fontSet.middle,
        color: AppStyle.colorSet.blackColor
    },
    phaseLabel: {
        color: AppStyle.colorSet.darkGreyColor,
        fontSize: AppStyle.fontSet.small,
    },
    phaseSelect: {
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

const mapStateToProps = state => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(OhmsLawScreen);

