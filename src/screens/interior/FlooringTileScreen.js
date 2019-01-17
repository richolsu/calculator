import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CustomInput, CustomModalInput, DialogInput } from '../../components';


class FlooringTileScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Flooring & Tile',
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
            areas: [
                {
                    name: 'Area 1',
                    length: '',
                    width: '',
                }
            ],
            currentIndex: 0,
            isNameDialogVisible: false,
            percent_wastage: '',
            price_per_square_foot: '',
            total_square_footage: null,
            total_square_footage_including_wastage: null,
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
            this.props.navigation.dispatch({ type: 'Project', routeName: this.props.navigation.state.routeName, calculation: 'FlooringTile' });
        } else {
            this.props.navigation.dispatch({ type: 'GoToProject', routeName: this.props.navigation.state.routeName, calculation: 'FlooringTile' });
            this.props.navigation.navigate('Login');
        }
    }

    onCalc = () => {
        let total_square_footage = 0;
        for (let i = 0; i < this.state.areas.length; i++) {
            if (this.state.areas[i].width && this.state.areas[i].length) {
                total_square_footage += AppStyle.checkValue(this.state.areas[i].width) * AppStyle.checkValue(this.state.areas[i].length);
            }
        }
        total_square_footage = total_square_footage / (12 * 12);
        total_square_footage_including_wastage = total_square_footage * (100 + AppStyle.checkValue(this.state.percent_wastage)) / 100;
        total_price = total_square_footage_including_wastage * AppStyle.checkValue(this.state.price_per_square_foot);

        this.setState({
            total_square_footage: AppStyle.formatValue(total_square_footage, 2),
            total_square_footage_including_wastage: AppStyle.formatValue(total_square_footage_including_wastage, 2),
            total_price: AppStyle.formatValue(total_price, 2),
        });
    }

    onClear = () => {
        this.setState({
            areas: [],
            percent_wastage: '10',
            price_per_square_foot: '10',
            total_square_footage: null,
            total_square_footage_including_wastage: null,
            total_price: null,
        });

    }

    onSaveToProject = () => {
        const data = { ...this.state };

        delete data.currentIndex;
        delete data.currentName;
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
        const rooms = this.state.areas.map(item => {
            return item.name + " : " + AppStyle.getFeetInchLabel(item.length) + ' x ' + AppStyle.getFeetInchLabel(item.width) + ' = ' + this.calcSquare(item);
        });
        message = rooms.join('\n') + '\n\n';

        message += 'Percent Wastage = ' + this.state.percent_wastage + '%\n';
        message += 'Price Per Square Foot = $' + this.state.price_per_square_foot + '\n\n';

        message += 'Total Surface Square = ' + this.state.total_square_footage + '\n';
        message += 'Total Surface Square Footage(Including Wastage) = ' + this.state.total_square_footage_including_wastage + '\n';

        message += 'Total Price = $' + this.state.total_price + '\n';

        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Flooring & Tile', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Flooring & Tile', this.createMessage());
    }

    onInput = (index, key, value) => {
        this.state.areas[index][key] = value;
        this.setState({ areas: this.state.areas });
    }

    calcSquare = (room) => {
        if (room.width && room.length) {
            const square = parseFloat(room.width) * parseFloat(room.length) / (12 * 12);
            return AppStyle.formatValue(square, 5);
        }
    }

    calcSum = () => {
        let sum = 0;
        for (let i = 0; i < this.state.areas.length; i++) {
            if (this.state.areas[i].width && this.state.areas[i].length) {
                sum += parseFloat(this.state.areas[i].width) * parseFloat(this.state.areas[i].length) / (12 * 12);
            }
        }
        return AppStyle.formatValue(sum, 5);
    }

    addArea = () => {
        this.setState({ areas: [...this.state.areas, { name: 'New Area', }] });
    }

    deleteArea = (index) => {
        this.state.areas.splice(index, 1);
        this.setState({ areas: this.state.areas });
    }

    renameArea = (room, index) => {
        this.setState({ currentIndex: index, currentName: room.name });
        this.showNameDialog(true);
    }

    showNameDialog = (show) => {
        this.setState({ isNameDialogVisible: show });
    }

    onSubmitName = (text) => {
        const newAreas = this.state.areas.map((area, index) => {
            if (index == this.state.currentIndex) {
                area.name = text;
            }
            return area;
        });

        this.setState({ areas: newAreas });
        this.showNameDialog(false);
    }

    render() {
        const rows = this.state.areas.map((room, index) => {
            return (
                <View style={styles.row} key={index}>
                    <View style={styles.titleView}>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.renameArea(room, index) }} >
                            <Text style={styles.roomLabel}>{room.name}</Text>
                            <Icon style={{ marginLeft: 20 }} name="md-create" size={AppStyle.iconSizeSet.small} color={AppStyle.colorSet.mainColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.deleteArea(index) }} >
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
                        <Text style={styles.seperator}>=</Text>
                        <CustomInput
                            editable={false}
                            style={styles.input}
                            label="Square Feet"
                            center={true}
                            value={this.calcSquare(room)} />
                    </View>

                </View>
            )
        });

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>Enter the length and width in feet of each room to get the square footage.</Text>
                {rows}
                <View style={[styles.calc, { marginTop: 50 }]}>
                    <View style={styles.btnGroup}>
                        <CustomButton style={styles.btn} mode="clear" label="Clear" onPress={this.onClear} />
                    </View>
                    <View style={styles.btnGroup}>
                        <CustomButton style={styles.btn} mode="clear" label="Add Area" onPress={this.addArea} />
                    </View>
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Percent Wastage (%)"
                        number={true}
                        returnKeyType="next"
                        onSubmitEditing={() => { this.priceInput.focus(); }}
                        value={this.state.percent_wastage}
                        onChangeText={(text) => { this.setState({ 'percent_wastage': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Price Per Square Foot ($)"
                        number={true}
                        inputRef={(c) => this.priceInput = c}
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
                    <Text style={styles.resultLabel}>Total Surface Square Footage {'\n'}(Including Wastage)</Text>
                    <Text style={styles.resultValue}>{this.state.total_square_footage_including_wastage}</Text>
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
                    title={'Input Area Name'}
                    hintInput={'Area Name'}
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

export default connect(mapStateToProps)(FlooringTileScreen);

