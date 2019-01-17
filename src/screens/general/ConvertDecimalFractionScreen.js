import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, Platform, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CustomInput } from '../../components';
import Button from 'react-native-button';

const InputAccessoryView = require('InputAccessoryView')

class ConvertDecimalFractionScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Convert Decimal and Fraction',
        headerLeft:
            <TouchableOpacity onPress={() => { navigation.toggleDrawer() }} >
                <Icon style={AppStyle.styleSet.menuButton} name="ios-menu" size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.whiteColor} />
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);

        this.state = {
            decimal: null,
            fraction: null,
            extra: '1/8'
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
            decimal: null,
            fraction: null,
            extra: '0'
        });
    }

    createMessage = () => {
        let message = '';
        message += 'Decimal = ' + this.state.decimal + '\n';
        message += 'Fraction = ' + this.state.fraction + '\n';

        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Convert Decimal and Fraction', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Convert Decimal and Fraction', this.createMessage());
    }

    calcDecimal = (integer, fraction) => {
        if (fraction.charAt(0) != '/' && fraction.charAt(fraction.length - 1) != '/') {
            let decimal = 0;
            try {
                decimal = eval(fraction);
            } catch (error) {
                console.log(error);
            }

            if (fraction && isNaN(decimal)) {
                alert("Please input correct fraction." + decimal);
                return '';
            } else {
                return AppStyle.formatValue(integer + decimal, 2);
            }
        }
    };

    onInput = (key, value) => {
        this.setState({ [key]: value });
        if (key == 'decimal') {
            value = AppStyle.checkValue(value);
            const fraction = AppStyle.decimalToFraction(value, 8);
            this.setState({ 'fraction': fraction.result });

        } else {
            let integer = 0;
            let fraction = '';
            const itemList = value.split(' ');
            if (itemList.length == 1) {
                if (itemList[0].indexOf('/') > 0) {
                    fraction = itemList[0];
                } else {
                    integer = itemList[0];
                }
            } else if (itemList.length == 2) {
                integer = parseInt(itemList[0]);
                fraction = itemList[1];
            } else {
                alert("Please input correct fraction.");
                return;
            }

            const result = this.calcDecimal(integer, fraction);
            this.setState({ 'decimal': result });

        }
    }

    onFractionInput = () => {
        this.onInput('fraction', this.state.fraction + '/');
        this.fractionInput.focus();
    }

    render() {
        const inputAccessoryViewID = "uniqueID";
        return (
            <View>
                <ScrollView style={styles.container}>
                    <Text style={styles.description}>Enter a value into the 'Decimal' or 'Fraction' field to automatically calculate the other.</Text>
                    <View style={styles.row}>
                        <CustomInput
                            style={styles.input}
                            label="Decimal"
                            number={true}
                            center={true}
                            value={this.state.decimal}
                            onChangeText={(text) => { this.onInput('decimal', text) }} />
                    </View>
                    <View style={styles.seperator}></View>
                    <View style={styles.row}>
                        <CustomInput
                            style={styles.input}
                            label="Fraction"
                            number={true}
                            selectTextOnFocus={false}
                            inputRef={(c) => this.fractionInput = c}
                            inputAccessoryViewID={inputAccessoryViewID}
                            center={true}
                            value={this.state.fraction}
                            onChangeText={(text) => { this.onInput('fraction', text) }} />
                        <Text style={styles.extra}>Rounded to nearest 1/8</Text>
                    </View>
                    <View style={[styles.row, { marginTop: 50 }]}>
                        <CustomButton style={styles.btn} mode="clear" label="Clear" onPress={this.onClear} />
                        {Platform.OS !== 'ios' &&
                            <CustomButton containerStyle={{ marginLeft: 30 }} mode="clear" label="/" onPress={() => this.onFractionInput()} />
                        }
                    </View>
                    <View style={[styles.row, { marginTop: 20 }]}>
                        <CustomButton style={styles.btn} mode="link" label="Share" onPress={this.onShare} />
                    </View>

                </ScrollView>
                {Platform.OS === 'ios' &&
                    <InputAccessoryView backgroundColor={AppStyle.colorSet.lightGreyColor} style={styles.fractionInput} nativeID={inputAccessoryViewID}>
                        <View>
                            <Button
                                containerStyle={styles.fractionBtn}
                                style={styles.fractionBtnText}
                                onPress={() => this.onInput('fraction', this.state.fraction + '/')}>/</Button>
                        </View>
                    </InputAccessoryView>
                }
            </View>
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
    fractionInput: {
        alignSelf: 'flex-end',
        marginRight: 20,
    },
    fractionBtn: {
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginRight: 10,
    },
    fractionBtnText: {
        color: 'black',
        fontSize: 18,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    seperator: {
        width: 160,
        height: 2,
        alignSelf: 'center',
        backgroundColor: AppStyle.colorSet.darkGreyColor
    },
    input: {
        width: 150,
        marginTop: 15,
    },
    btn: {
        alignSelf: 'center',
    },
    btnSeperator: {
        width: 30,
    },
    extra: {
        position: 'absolute',
        fontSize: AppStyle.fontSet.xsmall,
        right: 0,
        bottom: 10,
    }
});

const mapStateToProps = state => ({
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(ConvertDecimalFractionScreen);

