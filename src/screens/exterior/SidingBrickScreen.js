import React from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomButton, CustomInput, CustomModalInput, DialogInput } from '../../components';
import AppStyle from '../../AppStyle';

class SidingBrickScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Siding and Brick',
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
            records: [
                {
                    name: 'Wall 1',
                    length: '',
                    height: '',
                    type: 'wall',
                },
            ],
            isWallNameDialogVisible: false,
            isGableNameDialogVisible: false,
            percent_wastage: '',
            square_feet_per_panel: '',
            price_per_panel: '',
            total_square_footage: null,
            number_of_panels_including_wastage: null,
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
            this.props.navigation.dispatch({ type: 'Project', routeName: this.props.navigation.state.routeName, calculation: 'SidingBrick' });
        } else {
            this.props.navigation.dispatch({ type: 'GoToProject', routeName: this.props.navigation.state.routeName, calculation: 'SidingBrick' });
            this.props.navigation.navigate('Login');
        }
    }

    onCalc = () => {
        let total_square_footage = 0;
        for (let i = 0; i < this.state.records.length; i++) {
            const record = this.state.records[i];
            if (record.height && record.length) {
                let multiplier = 1;
                if (record.type == 'gable') {
                    multiplier = 0.5;
                }
                total_square_footage += AppStyle.checkValue(record.height) * AppStyle.checkValue(record.length) * multiplier;
            }
        }
        total_square_footage = total_square_footage / (12 * 12);
        let number_of_panels_including_wastage = 0;
        if (AppStyle.checkValue(this.state.square_feet_per_panel)) {
            number_of_panels_including_wastage = (AppStyle.checkValue(total_square_footage) * (100 + AppStyle.checkValue(this.state.percent_wastage)) / 100) / AppStyle.checkValue(this.state.square_feet_per_panel);
        }

        const total_price = AppStyle.checkValue(AppStyle.formatValue(number_of_panels_including_wastage, 0)) * AppStyle.checkValue(this.state.price_per_panel);
        this.setState({
            total_square_footage: AppStyle.formatValue(total_square_footage, 2),
            number_of_panels_including_wastage: AppStyle.formatValue(number_of_panels_including_wastage, 0),
            total_price: AppStyle.formatValue(total_price, 2),
        });
    }

    onClear = () => {
        this.setState({
            records: [],
            percent_wastage: '10',
            square_feet_per_panel: 0.2,
            price_per_panel: '1',
            total_square_footage: null,
            number_of_panels_including_wastage: null,
            total_price: null,
        });

    }

    onSaveToProject = () => {

        const data = { ...this.state };

        delete data.currentName;
        delete data.currentIndex;
        delete data.isWallNameDialogVisible;
        delete data.isGableNameDialogVisible;

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
        this.state.records.map(record => {
            message += record.name + '=' + record.length + ' x ' + record.height + '\n';
        });

        message += 'Percent Wastage % = ' + this.state.percent_wastage + '\n';
        message += 'Square Feet Per Panel/Brick = ' + this.state.square_feet_per_panel + '\n';
        message += 'Price Per Panel/Brick = ' + this.state.price_per_panel + '\n\n';

        message += 'Total Surface Footage = ' + this.state.total_square_footage + '\n';
        message += 'Total Number of Panels/Brick = ' + this.state.number_of_panels_including_wastage + '\n';
        message += 'Total Price = ' + this.state.total_price + '\n';

        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Siding and Brick', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Siding and Brick', this.createMessage());
    }

    onInput = (index, key, value) => {
        this.state.records[index][key] = value;
        this.setState({ records: this.state.records });
    }

    onSelect = (index, option) => {
        this.state.records[index].pitch = option.key;
        this.state.records[index].multiplier = option.multiplier;
        this.setState({ records: this.state.records });
    }

    addGable = () => {
        this.setState({ records: [...this.state.records, { name: 'New Gable', type: 'gable' }] });
    }

    addWall = () => {
        this.setState({ records: [...this.state.records, { name: 'New Wall', type: 'wall' }] });
    }

    renameRecord = (record, index) => {
        this.setState({ currentIndex: index, currentName: record.name });
        if (this.state.records[index].type == 'wall') {
            this.showWallNameDialog(true);
        } else {
            this.showGableNameDialog(true);
        }
    }

    showWallNameDialog = (show) => {
        this.setState({ isWallNameDialogVisible: show });
    }

    showGableNameDialog = (show) => {
        this.setState({ isGableNameDialogVisible: show });
    }

    onSubmitName = (text) => {
        const newRecords = this.state.records.map((room, index) => {
            if (index == this.state.currentIndex) {
                room.name = text;
            }
            return room;
        });

        this.setState({ records: newRecords });
        this.showWallNameDialog(false);
        this.showGableNameDialog(false);
    }

    deleteRecord = (index) => {
        this.state.records.splice(index, 1);
        this.setState({ records: this.state.records });
    }

    render() {

        const rows = this.state.records.map((record, index) => {
            let multiplier = 1;
            if (record.type == 'gable') {
                multiplier = 0.5;
            }
            let suqare_feet = AppStyle.checkValue(record.height) * AppStyle.checkValue(record.length) * multiplier / (12 * 12);
            suqare_feet = suqare_feet ? AppStyle.formatValue(suqare_feet, 2) : '';

            return (
                <View style={styles.row} key={index}>
                    <View style={styles.titleView}>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.renameRecord(record, index) }} >
                            <Text style={styles.recordLabel}>{record.name}</Text>
                            <Icon style={{ marginLeft: 20 }} name="md-create" size={AppStyle.iconSizeSet.small} color={AppStyle.colorSet.mainColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.deleteRecord(index) }} >
                            <Icon style={{ marginLeft: 20 }} name="ios-remove-circle" size={AppStyle.iconSizeSet.small} color={AppStyle.colorSet.mainColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.calc}>
                        <CustomModalInput
                            style={styles.input}
                            label="Length"
                            number={true}
                            center={true}
                            value={record.length}
                            onChangeText={(text) => { this.onInput(index, 'length', text) }} />
                        <Text style={styles.seperator}>X</Text>
                        <CustomModalInput
                            style={styles.input}
                            label="Height"
                            number={true}
                            center={true}
                            value={record.height}
                            onChangeText={(text) => { this.onInput(index, 'height', text) }} />
                        <Text style={styles.seperator}>=</Text>
                        <CustomInput
                            style={styles.input}
                            label="Square Feet"
                            number={true}
                            editable={false}
                            center={true}
                            value={suqare_feet} />
                    </View>

                </View>
            )
        });

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>Enter the length and height of each wall to get the square footage.</Text>
                {rows}
                <View style={[styles.calc, { marginTop: 30 }]}>
                    <View style={styles.btnGroup}>
                        <CustomButton style={styles.btn} mode="clear" label="Add Wall" onPress={this.addWall} />
                    </View>
                    <View style={styles.btnGroup}>
                        <CustomButton style={styles.btn} mode="clear" label="Add Gable" onPress={this.addGable} />
                    </View>
                </View>
                <View style={[styles.calc, { marginTop: 20 }]}>
                    <CustomButton style={styles.btn} mode="clear" label="Clear" onPress={this.onClear} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Percent Wastage % (optional)"
                        number={true}
                        returnKeyType="next"
                        onSubmitEditing={() => { this.squareFeetInput.focus(); }}
                        value={this.state.percent_wastage}
                        onChangeText={(text) => { this.setState({ 'percent_wastage': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Square Feet Per Panel/Brick (optional)"
                        number={true}
                        returnKeyType="next"
                        inputRef={(c) => this.squareFeetInput = c}
                        onSubmitEditing={() => { this.priceInput.focus(); }}
                        value={this.state.square_feet_per_panel}
                        onChangeText={(text) => { this.setState({ 'square_feet_per_panel': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Price Per Panel/Brick (optional)"
                        number={true}
                        inputRef={(c) => this.priceInput = c}
                        value={this.state.price_per_panel}
                        onChangeText={(text) => { this.setState({ 'price_per_panel': text }) }} />
                </View>
                <View style={[styles.calc, { marginTop: 20 }]}>
                    <CustomButton style={styles.btn} label="Calculate" onPress={this.onCalc} />
                </View>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Total Surface Footage</Text>
                    <Text style={styles.resultValue}>{this.state.total_square_footage}</Text>
                </View>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Total Number of Panels/Brick {'\n'}(Including Wastage)</Text>
                    <Text style={styles.resultValue}>{this.state.number_of_panels_including_wastage}</Text>
                </View>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Total Price</Text>
                    <Text style={styles.resultValue}>{this.state.total_price}</Text>
                </View>

                <View style={[styles.calc, { marginTop: 20 }]}>
                    <CustomButton style={styles.btn} mode="link" label="Save to Project" onPress={this.onSaveToProject} />
                    <CustomButton style={styles.btn} mode="link" label="Share" onPress={this.onShare} />
                </View>
                <View style={styles.emptyRow}>
                </View>
                <DialogInput isDialogVisible={this.state.isGableNameDialogVisible}
                    title={'Input Gable Name'}
                    hintInput={'Gable Name'}
                    textInputProps={{ autoCapitalize: 'words' }}
                    submitText={'OK'}
                    submitInput={(inputText) => { this.onSubmitName(inputText) }}
                    closeDialog={() => { this.showGableNameDialog(false) }}>
                </DialogInput>
                <DialogInput isDialogVisible={this.state.isWallNameDialogVisible}
                    title={'Input Wall Name'}
                    hintInput={'Wall Name'}
                    textInputProps={{ autoCapitalize: 'words' }}
                    submitText={'OK'}
                    value={this.state.currentName}
                    submitInput={(inputText) => { this.onSubmitName(inputText) }}
                    closeDialog={() => { this.showWallNameDialog(false) }}>
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
    recordLabel: {
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

export default connect(mapStateToProps)(SidingBrickScreen);

