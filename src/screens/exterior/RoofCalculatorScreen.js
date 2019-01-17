import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CustomInput, CustomModalInput, CustomSelect, DialogInput } from '../../components';


class RootCalculatorScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Roof Calculator',
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
            gables: [
                {
                    name: 'Gable 1',
                    length: '',
                    width: '',
                    pitch: AppStyle.optionSet.pitchOptions[1].label,
                    multiplier: AppStyle.optionSet.pitchOptions[1].multiplier,
                }
            ],
            isNameDialogVisible: false,
            currentIndex: 0,
            percent_wastage: '',
            price_per_square_foot: '',
            total_square_footage: null,
            number_of_squares_including_wastage: null,
            total_price: null,
        };

        this.project = props.navigation.getParam('data');

        if (this.project) {
            this.state = { ...this.state, ...this.project.data };
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
            this.props.navigation.dispatch({ type: 'Project', routeName: this.props.navigation.state.routeName, calculation: 'RoofCalculator' });
        } else {
            this.props.navigation.dispatch({ type: 'GoToProject', routeName: this.props.navigation.state.routeName, calculation: 'RoofCalculator' });
            this.props.navigation.navigate('Login');
        }
    }

    onCalc = () => {
        let total_square_footage = 0;
        for (let i = 0; i < this.state.gables.length; i++) {
            if (this.state.gables[i].width && this.state.gables[i].length) {
                total_square_footage += AppStyle.checkValue(this.state.gables[i].width) * AppStyle.checkValue(this.state.gables[i].length) * AppStyle.checkValue(this.state.gables[i].multiplier) / (12 * 12);
            }
        }
        const number_of_squares_including_wastage = AppStyle.checkValue(total_square_footage) * (100 + AppStyle.checkValue(this.state.percent_wastage)) / (100 * 100);
        const total_price = AppStyle.checkValue(AppStyle.formatValue(number_of_squares_including_wastage, 0)) * AppStyle.checkValue(this.state.price_per_square_foot);
        this.setState({
            total_square_footage: AppStyle.formatValue(total_square_footage, 2),
            number_of_squares_including_wastage: AppStyle.formatValue(number_of_squares_including_wastage, 0),
            total_price: AppStyle.formatValue(total_price, 2),
        });
    }

    onClear = () => {
        this.setState({
            gables: [],
            percent_wastage: '10',
            price_per_square_foot: '10',
            total_square_footage: null,
            number_of_squares_including_wastage: null,
            total_price: null,
        });

    }


    onSaveToProject = () => {

        const data = { ...this.state };

        delete data.currentName;
        delete data.currentIndex;
        delete data.isNameDialogVisible;

        this.project.data = data;

        if (this.props.isLoggedIn) {
            this.props.navigation.dispatch({ type: 'EditProject', payload: this.project, routeName: this.props.navigation.state.routeName });
        } else {
            this.props.navigation.dispatch({ type: 'SaveToProject', payload: this.project, routeName: this.props.navigation.state.routeName });
            this.props.navigation.navigate('Login');
        }
        
    }

    createMessage = () => {
        let message = '';
        const gables = this.state.gables.map(gable => {
            message += gable.name + ' : ' + AppStyle.getFeetInchLabel(gable.length) + ' x ' + AppStyle.getFeetInchLabel(gable.width) + ' ' + gable.pitch + '\n';
        });

        message += 'Percent Wastage = ' + this.state.percent_wastage + '%\n';
        message += 'Price Per Square = $' + this.state.price_per_square_foot + '\n\n';
        message += 'Total Surface Square Footage = ' + this.state.total_square_footage + '\n';
        message += 'Number of Squares = ' + this.state.number_of_squares_including_wastage + '\n';
        message += 'Total Price = $' + this.state.total_price + '\n';

        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Roof Calculator', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Roof Calculator', this.createMessage());
    }

    onInput = (index, key, value) => {
        this.state.gables[index][key] = value;
        this.setState({ gables: this.state.gables });
    }

    onSelect = (index, option) => {
        this.state.gables[index].pitch = option.key;
        this.state.gables[index].multiplier = option.multiplier;
        this.setState({ gables: this.state.gables });
    }

    addGable = () => {
        this.setState({ gables: [...this.state.gables, { name: 'new gable', pitch: '0/12' }] });
    }

    deleteGable = (index) => {
        this.state.gables.splice(index, 1);
        this.setState({ gables: this.state.gables });
    }

    renameGable = (room, index) => {
        this.setState({ currentIndex: index, currentName: room.name });
        this.showNameDialog(true);
    }

    showNameDialog = (show) => {
        this.setState({ isNameDialogVisible: show });
    }

    onSubmitName = (text) => {
        const newGables = this.state.gables.map((gable, index) => {
            if (index == this.state.currentIndex) {
                gable.name = text;
            }
            return gable;
        });

        this.setState({ gables: newGables });
        this.showNameDialog(false);
    }


    render() {
        const rows = this.state.gables.map((room, index) => {
            return (
                <View style={styles.row} key={index}>
                    <View style={styles.titleView}>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.renameGable(room, index) }} >
                            <Text style={styles.roomLabel}>{room.name}</Text>
                            <Icon style={{ marginLeft: 20 }} name="md-create" size={AppStyle.iconSizeSet.small} color={AppStyle.colorSet.mainColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.deleteGable(index) }} >
                            <Icon style={{ marginLeft: 20 }} name="ios-remove-circle" size={AppStyle.iconSizeSet.small} color={AppStyle.colorSet.mainColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.calc}>
                        <CustomModalInput
                            style={styles.input}
                            label="Length"
                            number={true}
                            center={true}
                            value={room.length}
                            onChangeText={(text) => { this.onInput(index, 'length', text) }} />
                        <Text style={styles.seperator}>X</Text>
                        <CustomModalInput
                            style={styles.input}
                            label="Width"
                            number={true}
                            center={true}
                            value={room.width}
                            onChangeText={(text) => { this.onInput(index, 'width', text) }} />
                        <Text style={styles.seperator}></Text>
                        <CustomSelect
                            label="Roof Pitch"
                            textStyle={styles.selectText}
                            data={AppStyle.optionSet.pitchOptions}
                            initValue={room.pitch}
                            onChange={(option) => { this.onSelect(index, option); }}
                        />
                    </View>

                </View>
            )
        });

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>Take the flat dimensions of a gable roof and roof pitch to calculate the total square feet and square footage.</Text>
                {rows}
                <View style={[styles.calc, { marginTop: 50 }]}>
                    <View style={styles.btnGroup}>
                        <CustomButton style={styles.btn} mode="clear" label="Clear" onPress={this.onClear} />
                    </View>
                    <View style={styles.btnGroup}>
                        <CustomButton style={styles.btn} mode="clear" label="Add Gable" onPress={this.addGable} />
                    </View>
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Percent Wastage % (optional)"
                        number={true}
                        returnKeyType="next"
                        onSubmitEditing={() => { this.priceInput.focus(); }}
                        value={this.state.percent_wastage}
                        onChangeText={(text) => { this.setState({ 'percent_wastage': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        inputRef={(c) => this.priceInput = c}
                        label="Price Per Square $ (optional)"
                        number={true}
                        value={this.state.price_per_square_foot}
                        onChangeText={(text) => { this.setState({ 'price_per_square_foot': text }) }} />
                </View>
                <View style={[styles.calc, { marginTop: 20 }]}>
                    <CustomButton style={styles.btn} label="Calculate" onPress={this.onCalc} />
                </View>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Total Surface Square Footage</Text>
                    <Text style={styles.resultValue}>{this.state.total_square_footage}</Text>
                </View>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Number of Squares {'\n'}(Including Wastage)</Text>
                    <Text style={styles.resultValue}>{this.state.number_of_squares_including_wastage}</Text>
                </View>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Total Price</Text>
                    <Text style={styles.resultValue}>${this.state.total_price}</Text>
                </View>

                <View style={[styles.calc, { marginTop: 20 }]}>
                    <CustomButton style={styles.btn} mode="link" label="Save to Project" onPress={this.onSaveToProject} />
                    <CustomButton style={styles.btn} mode="link" label="Share" onPress={this.onShare} />
                </View>
                <View style={styles.emptyRow}>
                </View>
                <DialogInput isDialogVisible={this.state.isNameDialogVisible}
                    title={'Input Gable Name'}
                    hintInput={'Gable Name'}
                    value={this.state.currentName}
                    textInputProps={{ autoCapitalize: 'words' }}
                    submitText={'OK'}
                    submitInput={(inputText) => { this.onSubmitName(inputText) }}
                    closeDialog={() => { this.showNameDialog(false) }}>
                </DialogInput>
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
    },
    titleView: {
        flexDirection: 'row',
    },
    roomLabel: {
        fontWeight: 'bold'
    },
    calc: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    seperator: {
        flex: 3,
        marginTop: 30,
        textAlign: 'center',
    },
    input: {
        flex: 5,
        marginTop: 15,
        borderBottomColor: AppStyle.colorSet.lightGreyColor,
        borderBottomWidth: 2,
    },
    selectText: {
        color: AppStyle.colorSet.blackColor,
        fontSize: AppStyle.fontSet.middle,
        marginBottom: 5,
        textAlign: 'center',
    },
    btn: {
        alignSelf: 'center',
    },
    btnSeperator: {
        width: 30,
    },
    btnGroup: {
        flex: 2,
        margin: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalView: {
        flex: 1,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultRow: {
        marginTop: 30,
        minHeight: 35,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resultLabel: {
        flex: 2,
        alignSelf: 'center',
        fontSize: AppStyle.fontSet.normal,
    },
    resultValue: {
        flex: 1,
        alignSelf: 'center',
        fontSize: AppStyle.fontSet.middle,
        color: AppStyle.colorSet.blackColor,
        textAlign: 'right',
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

export default connect(mapStateToProps)(RootCalculatorScreen);

