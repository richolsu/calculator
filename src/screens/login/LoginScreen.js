import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, BackHandler } from 'react-native';
import Button from 'react-native-button';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import Storage from '../../Storage';

class LoginScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: 'transparent'
        },
    });

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            email: '',
            password: '',
        };

        let db = firebase.firestore()
        let settings = db.settings
        settings.areTimestampsInSnapshotsEnabled = true
        db.settings = settings
        this.loadLoginInfo();

    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onSignup = () => {
        this.props.navigation.navigate('Signup');
    }

    loadLoginInfo = () => {
        Storage.loadLoginInfo(stores => {
            stores.map(store => {
                const key = store[0];
                const value = store[1];
                this.setState({ [key]: value });
            });
        });
    }

    onBack = () => {
        this.props.navigation.dispatch({ type: 'Back', lastScreenRoute: this.props.prevScreenRoute });
        return true;
    }

    onPressLogin = () => {
        if (!this.state.email) {
            alert('Please input email');
            return;
        }

        if (!this.state.password) {
            alert('Please input password');
            return;
        }

        Storage.saveLoginInfo(this.state.email, this.state.password);

        const { email, password } = this.state;
        const that = this;

        this.setState({ isLoading: true });
        firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {
            const { navigation, lastData, lastScreenRoute, calculation } = this.props;
            user_uid = response.user._user.uid;
            console.log(response.user);
            firebase.firestore().collection('users').doc(user_uid).get().then(function (user) {
                if (user.exists) {
                    navigation.dispatch({ type: 'LoginSucceed', user: { ...user.data(), id: user.id }, lastScreenRoute: lastScreenRoute, calculation: calculation, lastData: lastData });
                } else {
                    alert("user does not exist!");
                }
                that.setState({ isLoading: false });
            }).catch(function (error) {
                that.setState({ isLoading: false });
                const { code, message } = error;
                alert(message);
            });
        }).catch((error) => {
            this.setState({ isLoading: false });
            const { code, message } = error;
            alert(message);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} resizeMode={'contain'} source={AppStyle.iconSet.logo} />
                <View style={styles.content}>
                    <View style={styles.InputContainer}>
                        <TextInput
                            style={styles.body}
                            keyboardType={'email-address'}
                            placeholder="E-mail"
                            returnKeyType="next"
                            onSubmitEditing={() => { this.passwordInput.focus(); }}
                            onChangeText={(text) => this.setState({ email: text })}
                            value={this.state.email}
                            underlineColorAndroid='transparent' />
                    </View>
                    <View style={styles.InputContainer}>
                        <TextInput
                            style={styles.body}
                            secureTextEntry={true}
                            placeholder="Password"
                            ref={(c) => this.passwordInput = c}
                            onChangeText={(text) =>
                                this.setState({ password: text })}
                            value={this.state.password}
                            underlineColorAndroid='transparent' />
                    </View>
                    <View style={styles.btnRow}>
                        <Button containerStyle={styles.loginContainer} style={styles.loginText} onPress={() => this.onPressLogin()}>Log in</Button>
                        <Button containerStyle={styles.signupContainer} style={styles.signupText} onPress={() => this.onSignup()}>Sign up</Button>
                    </View>
                    <View style={styles.btnRow}>
                        <Button containerStyle={styles.backContainer} style={styles.backText} onPress={() => this.onBack()}>Back To Calculator</Button>
                    </View>
                </View>
                <TouchableOpacity onPress={AppStyle.onLinkWeb} >
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Learn more about FieldPulse</Text>
                    </View>
                </TouchableOpacity>
                {this.state.isLoading &&
                    <View style={AppStyle.styleSet.indicator}>
                        <View style={AppStyle.styleSet.indicatorBox}>
                            <ActivityIndicator size="large" color={AppStyle.colorSet.mainColor} />
                        </View>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        width: '50%',
        margin: 40,
    },
    title: {
        fontSize: AppStyle.fontSet.xlarge,
        fontWeight: 'bold',
        color: AppStyle.colorSet.mainColor,
        marginTop: 20,
        marginBottom: 20,
    },
    leftTitle: {
        alignSelf: 'stretch',
        textAlign: 'left',
        marginLeft: 20
    },
    content: {
        flex: 1,
        width: '80%',
    },
    btnRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    loginContainer: {
        width: '45%',
        backgroundColor: AppStyle.colorSet.mainColor,
        borderRadius: 25,
        padding: 10,
        marginTop: 30,
    },
    loginText: {
        color: AppStyle.colorSet.whiteColor
    },
    signupContainer: {
        width: '45%',
        backgroundColor: AppStyle.colorSet.whiteColor,
        borderRadius: 25,
        padding: 10,
        borderWidth: 1,
        borderColor: AppStyle.colorSet.mainColor,
        marginTop: 30,
    },
    signupText: {
        color: AppStyle.colorSet.mainColor
    },
    backContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: AppStyle.colorSet.mainColor,
        borderRadius: 25,
        padding: 10,
        marginTop: 30,
    },
    backText: {
        color: AppStyle.colorSet.mainColor
    },
    placeholder: {
        color: 'red'
    },
    InputContainer: {
        width: '100%',
        marginTop: 30,
        borderWidth: 1,
        borderColor: AppStyle.colorSet.mainColor,
        borderStyle: 'solid',
        borderRadius: 25,
    },
    body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyle.colorSet.mainColor
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        marginBottom: 30,
        color: AppStyle.colorSet.mainColor,
        fontSize: AppStyle.fontSet.xxsmall,
    }
});


const mapStateToProps = state => ({
    lastData: state.screen.lastData,
    lastScreenRoute: state.screen.lastScreenRoute,
    prevScreenRoute: state.screen.prevScreenRoute,
    calculation: state.screen.calculation
});

export default connect(mapStateToProps)(LoginScreen);