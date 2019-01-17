import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomButton, DialogInput, CustomModalInput } from '../../components';
import AppStyle from '../../AppStyle';
import Storage from '../../Storage';
import firebase from 'react-native-firebase';

class SquareFootageScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Square Footage',
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
            isNameDialogVisible: false,
            currentIndex: 0,
            rooms: [{
                name: 'Room 1',
                length: '',
                width: '',
            }],
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

        if (!this.props.isLoggedIn) {
            this.autoLogin();
        }

        if (this.props.isFirst) {
            this.props.navigation.toggleDrawer();
            this.props.navigation.dispatch({ type: 'showed'});
        }
        
    }

    autoLogin = () => {

        Storage.loadLoginInfo(stores => {
            const loginInfo = {};
            stores.map(store => {
                const key = store[0];
                const value = store[1];
                loginInfo[key] = value;
            });

            if (loginInfo.email && loginInfo.password && loginInfo.autoLogin == '1') {
                firebase.auth().signInWithEmailAndPassword(loginInfo.email, loginInfo.password).then((response) => {
                    const { navigation } = this.props;
                    user_uid = response.user._user.uid;
                    firebase.firestore().collection('users').doc(user_uid).get().then(function (user) {
                        if (user.exists) {
                            navigation.dispatch({ type: 'LoginSucceed', user: { ...user.data(), id: user.id } });
                        }
                    });
                });
            }
        });

    }
    
    onProjects = () => {
        if (this.props.isLoggedIn) {
            this.props.navigation.dispatch({ type: 'Project', routeName: this.props.navigation.state.routeName, calculation: 'SquareFootage' });
        } else {
            this.props.navigation.dispatch({ type: 'GoToProject', routeName: this.props.navigation.state.routeName, calculation: 'SquareFootage' });
            this.props.navigation.navigate('Login');
        }
    }

    onClear = () => {
        this.setState({
            rooms: []
        });
    }

    onSaveToProject = () => {
        const data = { rooms: this.state.rooms };

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
        const rooms = this.state.rooms.map(room => {
            return room.name + " : " + AppStyle.getFeetInchLabel(room.length) + ' x ' + AppStyle.getFeetInchLabel(room.width) + ' = ' + this.calcSquare(room);
        });
        message = rooms.join('\n') + '\n\n';

        message += 'Total : ' + this.calcSum();

        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Square Footage', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Square Footage', this.createMessage());
    }

    onInput = (index, key, value) => {
        this.state.rooms[index][key] = value;
        this.setState({ rooms: this.state.rooms });
    }

    calcSquare = (room) => {
        if (room.width && room.length) {
            const square = parseFloat(room.width) * parseFloat(room.length) / (12 * 12);
            return AppStyle.formatValue(square, 2);
        }
    }

    calcSum = () => {
        let sum = 0;
        for (let i = 0; i < this.state.rooms.length; i++) {
            if (this.state.rooms[i].width && this.state.rooms[i].length) {
                sum += parseFloat(this.state.rooms[i].width) * parseFloat(this.state.rooms[i].length) / (12 * 12);
            }
        }
        return AppStyle.formatValue(sum, 2);
    }

    addRoom = () => {
        this.setState({ rooms: [...this.state.rooms, { name: 'New Room' }] });
    }

    deleteRoom = (index) => {
        this.state.rooms.splice(index, 1);
        this.setState({ rooms: this.state.rooms });
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
        this.showNameDialog(false);
    }

    render() {
        const rows = this.state.rooms.map((room, index) => {
            return (
                <View style={styles.row} key={index}>
                    <View style={styles.titleView}>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.renameRoom(room, index) }} >
                            <Text style={styles.roomLabel}>{room.name}</Text>
                            <Icon style={{ marginLeft: 20 }} name="md-create" size={AppStyle.iconSizeSet.small} color={AppStyle.colorSet.mainColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.deleteRoom(index) }} >
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
                        <CustomModalInput
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
                        <CustomButton style={styles.btn} label="Add Room" onPress={this.addRoom} />
                    </View>
                    <View style={styles.totalView}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.total}>{this.calcSum()}</Text>
                    </View>
                </View>
                <View style={[styles.calc, { marginTop: 20 }]}>
                    <CustomButton style={styles.btn} mode="link" label="Save to Project" onPress={this.onSaveToProject} />
                    <CustomButton style={styles.btn} mode="link" label="Share" onPress={this.onShare} />
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
    totalLabel: {
        fontWeight: 'bold'
    },
    total: {
        fontSize: AppStyle.fontSet.middle,
        color: AppStyle.colorSet.blackColor
    }
});

const mapStateToProps = state => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    isFirst: state.firstShow.isFirst,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(SquareFootageScreen);

