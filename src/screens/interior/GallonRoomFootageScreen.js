import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CustomInput, DialogInput } from '../../components';


class GallonRoomFootageScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Room Footage',
        headerRight:
            <TouchableOpacity onPress={() => { navigation.state.params.onSave() }} >
                <Text style={AppStyle.styleSet.rightNavButton}>SAVE</Text>
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);

        this.state = {
            rooms: props.rooms,
            isNameDialogVisible: false,
            currentIndex: 0,
            total_square_footage: 0,
            total_gallons_of_paint: 0,
            price_per_foot: 0,
            total_price: 0,
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
            onSave: this.onSave
        });
        this.calcSum(this.state.price_per_foot);
        this.props.navigation.dispatch({ type: 'SaveRouteName', routeName: this.props.navigation.state.routeName });
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onBack = () => {
        this.props.navigation.goBack();
        return true;
    }

    calcSum(newPrice) {
        let total_square_footage = 0;
        let total_gallons_of_paint = 0;
        for (let i = 0; i < this.state.rooms.length; i++) {
            total_square_footage += AppStyle.checkValue(this.state.rooms[i].surface_square_footage);
            total_gallons_of_paint += AppStyle.checkValue(this.state.rooms[i].gallons_of_paint);
        }

        const total_price = AppStyle.checkValue(newPrice) * total_square_footage;
        this.setState({
            total_square_footage: AppStyle.formatValue(total_square_footage, 2),
            total_gallons_of_paint: AppStyle.formatValue(total_gallons_of_paint, 2),
            total_price: AppStyle.formatValue(total_price, 2),
        })

    }

    onInputPrice = (value) => {
        this.setState({
            price_per_foot: value,
        });

        this.setState({ price_per_foot: value });
        this.calcSum(value);
    }

    onSave = () => {
        const data = {
            price_per_foot: this.state.price_per_foot,
            rooms: this.state.rooms
        }

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
        const rooms = this.state.rooms.map(item => {
            return item.name + " : Surface Square Footage=" + item.surface_square_footage + '  Gallons of Paint=' + item.gallons_of_paint;
        });
        message = rooms.join('\n') + '\n\n';

        message += 'Surface Square Footage = ' + this.state.total_gallons_of_paint + '\n';
        message += 'Gallons of Paint = ' + this.state.total_gallons_of_paint + '\n\n';

        message += 'Price Per Foot ($) = ' + this.state.price_per_foot + '\n';
        message += 'Total Price ($) = ' + this.state.total_price + '\n';

        return message;
    }


    onEmail = () => {
        AppStyle.onEmail('Room Footage', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Room Footage', this.createMessage());
    }

    deleteRoom = (index) => {
        this.state.rooms.splice(index, 1);
        this.setState({ rooms: this.state.rooms });

        this.props.navigation.dispatch({ type: 'setGallonRooms', rooms: this.state.rooms });
    }

    renameRoom = (room, index) => {
        this.setState({ currentIndex: index, currentName: room.name });
        this.showNameDialog(true);
    }

    showNameDialog = (show) => {
        this.setState({ isNameDialogVisible: show });
    }

    onSubmitName = (text) => {
        const newRooms = this.state.rooms.map((room, index) => {
            if (index == this.state.currentIndex) {
                room.name = text;
            }
            return room;
        });

        this.setState({ rooms: newRooms });
        this.props.navigation.dispatch({ type: 'setGallonRooms', rooms: newRooms });
        this.showNameDialog(false);
    }

    render() {
        const rows = this.state.rooms.map((room, index) => {
            return (
                <View style={styles.roomRow} key={index}>
                    <View style={styles.titleView}>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.renameRoom(room, index) }} >
                            <Text style={styles.roomLabel}>{room.name}</Text>
                            <Icon style={{ marginLeft: 20 }} name="md-create" size={AppStyle.iconSizeSet.small} color={AppStyle.colorSet.mainColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.deleteRoom(index) }} >
                            <Icon style={{ marginLeft: 20 }} name="ios-remove-circle" size={AppStyle.iconSizeSet.small} color={AppStyle.colorSet.mainColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Surface Square Footage</Text>
                        <Text style={styles.resultValue}>{room.surface_square_footage}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Gallons of Paint</Text>
                        <Text style={styles.resultValue}>{room.gallons_of_paint}</Text>
                    </View>
                </View>
            )
        });

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>All of your saved rooms are totaled for a project.</Text>
                {rows}
                <View style={styles.divider}></View>

                <View style={styles.roomRow}>
                    <View style={styles.titleView}>
                        <Text style={styles.roomLabel}>Total</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Surface Square Footage</Text>
                        <Text style={styles.resultValue}>{this.state.total_square_footage}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Gallons of Paint</Text>
                        <Text style={styles.resultValue}>{this.state.total_gallons_of_paint}</Text>
                    </View>
                </View>
                <View style={styles.divider}></View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Price Per Foot ($)"
                        number={true}
                        value={this.state.price_per_foot}
                        onChangeText={(text) => { this.onInputPrice(text) }} />
                    <View style={styles.seperator}></View>
                    <CustomInput
                        style={styles.input}
                        label="Total Price ($)"
                        number={true}
                        editable={false}
                        value={this.state.total_price} />
                </View>
                <View style={[styles.row, { marginTop: 20 }]}>
                    <CustomButton style={styles.btn} mode="link" label="Save Project" onPress={this.onSave} />
                    <CustomButton style={styles.btn} mode="link" label="Share" onPress={this.onShare} />
                </View>
                <View style={styles.emptyRow}>
                </View>
                <DialogInput isDialogVisible={this.state.isNameDialogVisible}
                    title={'Input Room Name'}
                    hintInput={'Room Name'}
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
    roomRow: {
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'center',
    },
    titleView: {
        flexDirection: 'row',
    },
    roomLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    seperator: {
        flex: 1,
    },
    divider: {
        height: 1,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: AppStyle.colorSet.lightGreyColor,
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
    resultRow: {
        marginBottom: 10,
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
    rooms: state.gallonRooms.rooms,
    isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(GallonRoomFootageScreen);

