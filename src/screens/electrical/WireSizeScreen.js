import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CustomInput, CustomSelect } from '../../components';



class WireSizeScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Wire Size',
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
            wiretype: AppStyle.optionSet.wireTypeOptions[0],
            phase: AppStyle.optionSet.simplePhaseOptions[0],
            voltage: AppStyle.optionSet.voltageOptions[0],
            voltage_drop: '',
            input_amps: '',
            distance_one_way: '',
            minimum_size: '',
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
            this.props.navigation.dispatch({ type: 'Project', routeName: this.props.navigation.state.routeName, calculation: 'WireSize' });
        } else {
            this.props.navigation.dispatch({ type: 'GoToProject', routeName: this.props.navigation.state.routeName, calculation: 'WireSize' });
            this.props.navigation.navigate('Login');
        }
    }

    onClear = () => {
        this.setState({
            wiretype: AppStyle.optionSet.wireTypeOptions[0],
            phase: AppStyle.optionSet.wireTypeOptions[0],
            voltage: AppStyle.optionSet.wireTypeOptions[0],
            voltage_drop: null,
            input_amps: null,
            distance_one_way: null,
            minimum_size: null,
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
        const data = {
            'Wire Type': this.state.wiretype.label,
            'Phase': this.state.phase.label,
            'Voltage': this.state.voltage.label,
            'Voltage Drop': this.state.voltage_drop,
            'Input Amps': this.state.input_amps,
            'Distance One Way (feet)': this.state.distance_one_way,
            'Minimum Size': this.state.minimum_size,
        }

        for (const key in data) {
            message += key + ' = ' + data[key] + '\n';
        }

        message += '\n';
        message += 'Minimum Size = ' + this.state.minimum_size;

        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Wire Size', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Wire Size', this.createMessage());
    }

    onInput = (key, value) => {
        this.setState({ [key]: value });
    }


    calc = () => {
        const voltage_drop = AppStyle.checkValue(this.state.voltage_drop);
        if (!voltage_drop) {
            alert("Please input correct number to 'Voltage Drop'.");
            return;
        }
        const voltage = this.state.voltage.key * voltage_drop / 100;

        const input_amps = AppStyle.checkValue(this.state.input_amps);
        if (!input_amps) {
            alert("Please input correct number to 'Input Amps'.");
            return;
        }
        const distance_one_way = AppStyle.checkValue(this.state.distance_one_way);
        if (!distance_one_way) {
            alert("Please input correct number to 'Distance One Way (feet)'.");
            return;
        }

        let minimumSize = null;
        if (this.state.wiretype.key == 1) {
            minimumSize = AppStyle.constant.conductor_resistivity.copper * 2 * input_amps * distance_one_way / voltage;
        } else {
            minimumSize = AppStyle.constant.conductor_resistivity.aluminum * 2 * input_amps * distance_one_way / voltage;
        }

        if (this.state.phase.key == 2) {
            minimumSize = minimumSize * 0.86;
        }

        let max, i, result = 'Unknown';
        for (i = 0; i < AppStyle.wireTable.length; i++) {
            max = (this.state.wiretype.key == 2) ? AppStyle.wireTable[i].amax : AppStyle.wireTable[i].cmax;
            if (minimumSize > AppStyle.wireTable[i].circ || input_amps > max) {
                result = AppStyle.wireTable[i + 1].size;
            }
        }
        this.setState({ minimum_size: result });
    }

    render() {

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>Select the wire type, voltage, and phase and enter in the voltage drop, input amps, and distance to calculate the minimum wire size.</Text>
                <CustomSelect
                    label="Wire Type"
                    data={AppStyle.optionSet.wireTypeOptions}
                    initValue={this.state.wiretype.label}
                    onChange={(option) => { this.setState({ wiretype: option }); }}
                />
                <CustomSelect
                    label="Phase"
                    data={AppStyle.optionSet.simplePhaseOptions}
                    initValue={this.state.phase.label}
                    onChange={(option) => { this.setState({ phase: option }); }}
                />
                <CustomSelect
                    label="Voltage"
                    data={AppStyle.optionSet.voltageOptions}
                    initValue={this.state.voltage.label}
                    onChange={(option) => { this.setState({ voltage: option }); }}
                />

                <CustomInput
                    style={styles.input}
                    label="Voltage Drop (%)"
                    number={true}
                    returnKeyType="next"
                    onSubmitEditing={() => { this.AmpsInput.focus(); }}
                    onChangeText={(text) => { this.onInput('voltage_drop', text) }}
                    value={this.state.voltage_drop} />
                <CustomInput
                    style={styles.input}
                    label="Input Amps"
                    number={true}
                    returnKeyType="next"
                    onSubmitEditing={() => { this.distanceInput.focus(); }}
                    inputRef={(c) => this.AmpsInput = c}
                    onChangeText={(text) => { this.onInput('input_amps', text) }}
                    value={this.state.input_amps} />
                <CustomInput
                    style={styles.input}
                    onChangeText={(text) => { this.onInput('distance_one_way', text) }}
                    label="Distance One Way (feet)"
                    number={true}
                    inputRef={(c) => this.distanceInput = c}
                    value={this.state.distance_one_way} />

                <View style={styles.row}>
                    <View style={styles.btnView}>
                        <CustomButton style={styles.btn} label="Calculate" onPress={this.calc} />
                    </View>
                    <View style={styles.btnView}>
                        <CustomButton style={styles.btn} mode="clear" label="Clear" onPress={this.onClear} />
                    </View>
                </View>
                <View style={[styles.row, { marginTop: 30, justifyContent: 'space-between' }]}>
                    <Text style={styles.wattsLabel}>Minimum Size</Text>
                    <Text style={styles.wattsValue}>{this.state.minimum_size}</Text>
                </View>
                <View style={[styles.row, { marginTop: 40 }]}>
                    <CustomButton style={styles.btn} mode="link" label="Save to Project" onPress={this.onSaveToProject} />
                    <CustomButton style={styles.btn} mode="link" label="Share" onPress={this.onShare} />
                </View>
                <View style={styles.emptyRow}>
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
    emptyRow: {
        height: 50,
    },
});

const mapStateToProps = state => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(WireSizeScreen);

