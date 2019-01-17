import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CalcInput, NumpadButton } from '../../components';

const signArray = ['+', '-', 'x', '÷'];

class FractionCalcultorScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Fraction Calculator',
        headerLeft:
            <TouchableOpacity onPress={() => { navigation.toggleDrawer() }} >
                <Icon style={AppStyle.styleSet.menuButton} name="ios-menu" size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.whiteColor} />
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);

        this.state = {
            integer: 'x',
            numerator: 'x',
            denominator: 'x',
            inputField: 'integer',
            roundValue: '1/16',
            result: null,
            inputs: [],
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
            integer: 'x',
            numerator: 'x',
            inputField: 'integer',
            denominator: 'x',
        });
    }

    onClearAll = () => {
        this.setState({
            integer: 'x',
            numerator: 'x',
            denominator: 'x',
            result: null,
            inputField: 'integer',
            inputs: []
        });
    }

    getNumber(key) {
        let number = this.state[key];
        if (!number || !number.trim() || number == 'x') {
            number = '';
        }

        if (key == 'integer' && number) {
            number = number + ' ';
        }

        return number;
    }

    getFractionString() {
        const integer = this.getNumber('integer');
        const numerator = this.getNumber('numerator');
        const denominator = this.getNumber('denominator');

        if (numerator && denominator) {
            return integer + numerator + '/' + denominator;
        } else {
            return integer;
        }
    }

    canEnterSign() {
        return this.state.inputs.length > 0 && signArray.indexOf(this.state.inputs[this.state.inputs.length - 1]) == -1;
    }

    canEnterFraction() {
        return this.state.inputs.length == 0 || signArray.indexOf(this.state.inputs[this.state.inputs.length - 1]) >= 0;
    }

    calcFraction(item) {

        let subItems = item.split(' ');

        if (subItems.length > 1) {
            return '(' + subItems[0] + '+' + (subItems[1] ? subItems[1] : 0) + ')';
        } else {
            return '(' + subItems[0] + ')';
        }
    }

    onEnter = () => {
        let lastFraction = false;
        if (this.canEnterFraction()) {
            const currentFraction = this.getFractionString();
            if (currentFraction.trim()) {
                lastFraction = currentFraction;
            }
        }
        let lastInputs = this.state.inputs;
        if (lastFraction) {
            lastInputs = [...this.state.inputs, lastFraction];
            this.setState({ inputs: lastInputs });
        }
        let result = 0;
        let calcString = '';

        for (let i = 0; i < lastInputs.length; i++) {
            let item = lastInputs[i];
            if (signArray.indexOf(item) >= 0) {
                if (i < lastInputs.length - 1) {
                    calcString += item;
                }
            } else {
                calcString += this.calcFraction(item);
            }
        }

        calcString = calcString.replace(/x/g, '*').replace(/÷/g, '/');

        result = eval(calcString);

        result = AppStyle.decimalToFraction(result, 16);
        this.setState({ result: result.result, roundValue: (result.bottom > 0 ? '1/' + result.bottom : '0') });
    }

    onClickNum = (key) => {
        if (!this.state.inputField) {
            alert('Please click a part to fill out.');
            return;
        }

        let newValue = this.state[this.state.inputField];
        if (newValue && newValue != 'x') {
            newValue += key.toString();
        } else {
            newValue = key.toString();
        }

        this.setState({ [this.state.inputField]: newValue });
    }

    onClickOperator = (key) => {
        let newFraction = false;
        if (this.canEnterFraction()) {
            const currentFraction = this.getFractionString();
            if (currentFraction.trim()) {
                newFraction = currentFraction;
            }
        }

        if (this.canEnterSign()) {
            this.setState({ inputs: [...this.state.inputs, key] });
            this.onClear();
        } else if (newFraction) {
            this.setState({ inputs: [...this.state.inputs, newFraction, key] });
            this.onClear();
        } else {
            alert('Please input fraction first');
            return;
        }
    }

    onClickField = (key) => {
        this.setState({ inputField: key, [key]: '' });
        if (key != 'integer' && this.state.integer == '') {
            this.setState({ integer: 'x' });
        } else if (key != 'numerator' && this.state.numerator == '') {
            this.setState({ numerator: 'x' });
        } else if (key != 'denominator' && this.state.denominator == '') {
            this.setState({ denominator: 'x' });
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>Click the part of the number/fraction to fill out, and then add, subtract, multipy, or divide the fraction to calculate a result. Rounded to nearest {this.state.roundValue}.</Text>
                <View style={styles.fieldRow} >
                    <View style={[styles.input, { flex: 5 }]}>
                        <CalcInput
                            containerStyle={{ alignSelf: 'flex-end', marginRight: 10 }}
                            style={{ fontSize: AppStyle.fontSet.xlarge }}
                            label={this.state.integer}
                            selected={this.state.inputField == 'integer'}
                            onPress={() => { this.onClickField('integer') }} />
                    </View>
                    <View style={[styles.input, { flex: 3 }]}>
                        <View style={{ alignSelf: 'flex-start' }}>
                            <View style={styles.row}>
                                <CalcInput
                                    label={this.state.numerator}
                                    selected={this.state.inputField == 'numerator'}
                                    onPress={() => { this.onClickField('numerator') }} />
                            </View>
                            <View style={styles.seperator}></View>
                            <View style={styles.row}>
                                <CalcInput
                                    label={this.state.denominator}
                                    selected={this.state.inputField == 'denominator'}
                                    onPress={() => { this.onClickField('denominator') }} />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.input, { flex: 2 }]}>
                        <CustomButton containerStyle={{ borderRadius: 10, minWidth: 0 }} style={{ fontSize: AppStyle.fontSet.small }} mode={'clear'} label={'Clear'} onPress={this.onClear}></CustomButton>
                    </View>
                </View>

                <View style={styles.divider}></View>
                <View style={styles.resultRow}>
                    <Text style={styles.result}>{this.state.result}</Text>
                    <Text style={styles.inputList}>{this.state.inputs.join(' ')}</Text>
                </View>
                <View style={styles.padRow}>
                    <NumpadButton label={'Clear All'} onPress={this.onClearAll} />
                    <NumpadButton label={'Enter'} backgroundColor={AppStyle.colorSet.btnGery} textColor={AppStyle.colorSet.whiteColor} onPress={this.onEnter} />
                </View>

                <View style={styles.padRow}>
                    <NumpadButton label={7} onPress={() => { this.onClickNum(7) }} />
                    <NumpadButton label={8} onPress={() => { this.onClickNum(8) }} />
                    <NumpadButton label={9} onPress={() => { this.onClickNum(9) }} />
                    <NumpadButton label={'÷'} textColor={AppStyle.colorSet.whiteColor} backgroundColor={AppStyle.colorSet.pink} onPress={() => this.onClickOperator('÷')} />
                </View>
                <View style={styles.padRow}>
                    <NumpadButton label={4} onPress={() => { this.onClickNum(4) }} />
                    <NumpadButton label={5} onPress={() => { this.onClickNum(5) }} />
                    <NumpadButton label={6} onPress={() => { this.onClickNum(6) }} />
                    <NumpadButton label={'x'} textColor={AppStyle.colorSet.whiteColor} backgroundColor={AppStyle.colorSet.blue} onPress={() => { this.onClickOperator('x') }} />
                </View>
                <View style={styles.padRow}>
                    <NumpadButton label={1} onPress={() => { this.onClickNum(1) }} />
                    <NumpadButton label={2} onPress={() => { this.onClickNum(2) }} />
                    <NumpadButton label={3} onPress={() => { this.onClickNum(3) }} />
                    <NumpadButton label={'-'} textColor={AppStyle.colorSet.whiteColor} backgroundColor={AppStyle.colorSet.red} onPress={() => { this.onClickOperator('-') }} />
                </View>
                <View style={styles.padRow}>
                    <NumpadButton />
                    <NumpadButton label={0} onPress={() => { this.onClickNum(0) }} />
                    <NumpadButton />
                    <NumpadButton label={'+'} textColor={AppStyle.colorSet.whiteColor} backgroundColor={AppStyle.colorSet.green} onPress={() => { this.onClickOperator('+') }} />
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
    fieldRow: {
        flexDirection: 'row',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultRow: {
        flexDirection: 'row',
        padding: 20,
        minHeight: 80,
    },
    result: {
        textAlign: 'left',
        fontSize: AppStyle.fontSet.large,
    },
    inputList: {
        flex: 1,
        fontSize: AppStyle.fontSet.normal,
        textAlign: 'right',
    },
    input: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    seperator: {
        minWidth: 80,
        height: 2,
        alignSelf: 'center',
        backgroundColor: AppStyle.colorSet.darkGreyColor
    },
    divider: {
        height: 2,
        backgroundColor: AppStyle.colorSet.darkGreyColor
    },
    padRow: {
        flexDirection: 'row',
        marginTop: 10,
        marginRight: -5,
    }
});

const mapStateToProps = state => ({
    user: state.auth.user,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(FractionCalcultorScreen);

