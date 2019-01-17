import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CustomInput, CustomSelect } from '../../components';


class AmpsToWattsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Amps to Watts',
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

        this.project = props.navigation.getParam('data');

        this.state = {
            phase: AppStyle.optionSet.phaseOptions[0],
            factor: '',
            voltage: '',
            amperes: '',
            watts: ''
        };

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
        this.props.navigation.dispatch({ type: 'SaveRouteName', routeName: this.props.navigation.state.routeName, calculation: 'AmpsToWatts' });
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
            this.props.navigation.dispatch({ type: 'Project', routeName: this.props.navigation.state.routeName, calculation: 'AmpsToWatts' });
        } else {
            this.props.navigation.dispatch({ type: 'GoToProject', routeName: this.props.navigation.state.routeName, calculation: 'AmpsToWatts' });
            this.props.navigation.navigate('Login');
        }
    }

    onClear = () => {
        this.setState({
            phase: AppStyle.optionSet.phaseOptions[0],
            factor: null,
            voltage: null,
            amperes: null,
            watts: null
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
        message += 'Phase = ' + this.state.phase.label + '\n';
        message += 'Power Factor = ' + this.state.factor + '\n';
        message += 'Voltage (V) = ' + this.state.voltage + '\n';
        message += 'Amperes (I) = ' + this.state.amperes + '\n\n';
        message += 'Watts (W) = ' + this.state.watts + '\n';

        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Amps to Watts', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Amps to Watts', this.createMessage());
    }

    onInput = (key, value) => {
        this.setState({ [key]: value });
    }


    calc = () => {
        let result = null;
        switch (this.state.phase.key) {
            case 1:
                if (!AppStyle.checkValue(this.state.amperes) || !AppStyle.checkValue(this.state.voltage)) {
                    alert("Please input correct number");
                } else {
                    result = parseFloat(this.state.amperes) * parseFloat(this.state.voltage);
                }
                break;
            case 2:
                if (!AppStyle.checkValue(this.state.factor) || !AppStyle.checkValue(this.state.amperes) || !AppStyle.checkValue(this.state.voltage)) {
                    alert("Please input correct number");
                } else {
                    result = parseFloat(this.state.factor) * parseFloat(this.state.amperes) * parseFloat(this.state.voltage);
                }
                break;
            case 3:
                if (!AppStyle.checkValue(this.state.factor) || !AppStyle.checkValue(this.state.amperes) || !AppStyle.checkValue(this.state.voltage)) {
                    alert("Please input correct number");
                } else {
                    result = Math.pow(3, 1 / 2) * parseFloat(this.state.factor) * parseFloat(this.state.amperes) * parseFloat(this.state.voltage);
                }
                break;
            case 4:
                if (!AppStyle.checkValue(this.state.factor) || !AppStyle.checkValue(this.state.amperes) || !AppStyle.checkValue(this.state.voltage)) {
                    alert("Please input correct number");
                } else {
                    result = 3 * parseFloat(this.state.factor) * parseFloat(this.state.amperes) * parseFloat(this.state.voltage);
                }
                break;
        }
        if (AppStyle.checkValue(result)) {
            result = AppStyle.formatValue(result, 6).toString();
        }
        this.setState({ watts: result });
    }

    render() {

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>Select the phase and enter the power factor, volts, and amperes to calculate the number of watts.</Text>

                <CustomSelect
                    label="Phase"
                    data={AppStyle.optionSet.phaseOptions}
                    initValue={this.state.phase.label}
                    onChange={(option) => { this.setState({ phase: option }); }}
                />

                {this.state.phase.key > 1 &&
                    <CustomInput
                        style={styles.input}
                        number={true}
                        label="Power Factor"
                        returnKeyType="next"
                        onSubmitEditing={() => { this.voltageInput.focus(); }}
                        onChangeText={(text) => { this.onInput('factor', text) }}
                        value={this.state.factor} />
                }
                <CustomInput
                    style={styles.input}
                    inputRef={(c) => this.voltageInput = c}
                    onSubmitEditing={() => { this.amperesInput.focus(); }}
                    label="Voltage (V)"
                    returnKeyType="next"
                    number={true}
                    onChangeText={(text) => { this.onInput('voltage', text) }}
                    value={this.state.voltage} />
                <CustomInput
                    inputRef={(c) => this.amperesInput = c}
                    style={styles.input}
                    number={true}
                    onChangeText={(text) => { this.onInput('amperes', text) }}
                    label="Amperes (I)"
                    value={this.state.amperes} />

                <View style={styles.row}>
                    <View style={styles.btnView}>
                        <CustomButton style={styles.btn} label="Calculate" onPress={this.calc} />
                    </View>
                    <View style={styles.btnView}>
                        <CustomButton style={styles.btn} mode="clear" label="Clear" onPress={this.onClear} />
                    </View>
                </View>
                <View style={[styles.row, { marginTop: 30, justifyContent: 'space-between' }]}>
                    <Text style={styles.wattsLabel}>Watts (W)</Text>
                    <Text style={styles.wattsValue}>{this.state.watts}</Text>
                </View>
                <View style={[styles.row, { marginTop: 40 }]}>
                    <CustomButton style={styles.btn} mode="link" label="Save to Project" onPress={this.onSaveToProject} />
                    <CustomButton style={styles.btn} mode="link" label="Share" onPress={this.onShare} />
                </View>

            </ScrollView >
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
});

const mapStateToProps = state => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(AmpsToWattsScreen);

