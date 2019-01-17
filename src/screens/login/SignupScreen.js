import React from 'react';
import { StyleSheet, Text, ScrollView, TextInput, View, ActivityIndicator, BackHandler } from 'react-native';
import Button from 'react-native-button';
import AppStyle from '../../AppStyle';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';

class SignupScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Create new account',
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            name: '',
            email: '',
            password: '',
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onBack = () => {
        this.props.navigation.goBack();
        return true;
    }

    onRegister = () => {
        if (!this.state.email) {
            alert('Please input email');
            return;
        }

        if (!this.state.name) {
            alert('Please input user name');
            return;
        }

        if (!this.state.password) {
            alert('Please input password');
            return;
        }

        this.setState({ loading: true });
        const { email, password } = this.state;
        const that = this;

        firebase.auth().createUserWithEmailAndPassword(email, password).then((response) => {
            const { navigation, lastScreenRoute } = this.props;
            user_uid = response.user._user.uid;

            const { name, phone, email } = this.state;
            const data = {
                name: name,
                email: email,
                userID: user_uid,
            };

            firebase.firestore().collection('users').doc(user_uid).set(data);
            firebase.firestore().collection('users').doc(user_uid).get().then(function (user) {
                that.setState({ loading: false });
                navigation.dispatch({ type: 'LoginSucceed', user: { ...user.data(), id: user.id }, lastScreenRoute: lastScreenRoute });
            }).catch(function (error) {
                that.setState({ loading: false });
                const { code, message } = error;
                alert(message);
            });

        }).catch((error) => {
            this.setState({ loading: false });
            const { code, message } = error;
            alert(message);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.title}>Sign Up</Text>
                    <View style={styles.InputContainer}>
                        <TextInput
                            style={styles.body}
                            placeholder="E-mail Address"
                            keyboardType={'email-address'}
                            returnKeyType="next"
                            onSubmitEditing={() => { this.usernameInput.focus(); }}
                            onChangeText={(text) => this.setState({ email: text })}
                            value={this.state.email}
                            underlineColorAndroid='transparent' />
                    </View>
                    <View style={styles.InputContainer}>
                        <TextInput
                            style={styles.body}
                            placeholder="User Name"
                            returnKeyType="next"
                            onSubmitEditing={() => { this.passwordInput.focus(); }}
                            ref={(c) => this.usernameInput = c}
                            onChangeText={(text) => this.setState({ name: text })}
                            value={this.state.name}
                            underlineColorAndroid='transparent' />
                    </View>
                    <View style={styles.InputContainer}>
                        <TextInput
                            style={styles.body}
                            ref={(c) => this.passwordInput = c}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({ password: text })}
                            value={this.state.password}
                            underlineColorAndroid='transparent' />
                    </View>
                    <Button containerStyle={[styles.loginContainer, { marginTop: 30 }]} style={styles.loginText} onPress={() => this.onRegister()}>Sign Up</Button>
                </ScrollView>
                {this.state.loading &&
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
        height: '100%',
    },
    contentContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: AppStyle.fontSet.xlarge,
        fontWeight: 'bold',
        color: AppStyle.colorSet.mainColor,
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'stretch',
        textAlign: 'center',
    },
    content: {
        paddingLeft: 50,
        paddingRight: 50,
        textAlign: 'center',
        fontSize: AppStyle.fontSet.middle,
        color: AppStyle.colorSet.mainColor,
    },
    loginContainer: {
        width: '80%',
        backgroundColor: AppStyle.colorSet.mainColor,
        borderRadius: 25,
        padding: 10,
        marginTop: 30,
    },
    loginText: {
        color: AppStyle.colorSet.whiteColor
    },
    placeholder: {
        color: 'red'
    },
    InputContainer: {
        width: '80%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: AppStyle.colorSet.mainColor,
        borderStyle: 'solid',
        borderRadius: 25
    },
    body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyle.colorSet.mainColor
    },

});

const mapStateToProps = state => ({
    lastScreenRoute: state.screen.lastScreenRoute
});

export default connect(mapStateToProps)(SignupScreen);