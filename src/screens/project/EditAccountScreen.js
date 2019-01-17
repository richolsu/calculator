import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, ActivityIndicator, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { CustomInput, CustomButton } from '../../components';
import AppStyle from '../../AppStyle';
import firebase from 'react-native-firebase';


class EditAccountScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Account Setting',
        headerRight:
            <TouchableOpacity onPress={() => { navigation.state.params.onSave() }} >
                <Text style={AppStyle.styleSet.rightNavButton}>SAVE</Text>
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            password: '',
            confirm: '',
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSave: this.onSave
        });
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onBack = () => {
        this.props.navigation.goBack();
        return true;
    }

    onSave = () => {
        if (!this.state.name) {
            alert('Please input name');
            return;
        }

        if ((this.state.password || this.state.confirm) && this.state.password != this.state.confirm) {
            alert('Password and Confirm not equal');
            return;
        }

        this.setState({ loading: true });
        const that = this;
        const user = this.props.user;
        user.name = this.state.name;

        firebase.firestore().collection('users').doc(user_uid).set(user).then((docRef) => {

            this.props.navigation.dispatch({ type: 'UserUpdated', user: user });

            if (that.state.password) {
                firebase.auth().currentUser.updatePassword(that.state.password).then(function () {
                    that.setState({ loading: false });
                }).catch(function (error) {
                    console.log(error);
                    that.setState({ loading: false });
                });
            } else {
                that.setState({ loading: false });
            }
        }).catch(error => {
            this.setState({ loading: false });
            alert(error);
        });


    }

    render() {
        return (
            <ScrollView>
                <CustomInput
                    style={styles.input}
                    label="Name"
                    returnKeyType="next"
                    value={this.state.name}
                    onChangeText={(text) => this.setState({ name: text })}
                    onSubmitEditing={() => { this.passwordInput.focus(); }} />
                <CustomInput
                    style={styles.input}
                    label="Password"
                    returnKeyType="next"
                    secureTextEntry={true}
                    onSubmitEditing={() => { this.confirmInput.focus(); }}
                    inputRef={(c) => this.passwordInput = c}
                    value={this.state.password}
                    onChangeText={(text) => this.setState({ password: text })} />
                <CustomInput
                    style={styles.input}
                    label="Confirm Password"
                    secureTextEntry={true}
                    inputRef={(c) => this.confirmInput = c}
                    value={this.state.confirm}
                    onChangeText={(text) => this.setState({ confirm: text })} />

                <CustomButton containerStyle={styles.saveBtn} label="Save" onPress={this.onSave} />
                {this.state.loading &&
                    <View style={AppStyle.styleSet.indicator}>
                        <View style={AppStyle.styleSet.indicatorBox}>
                            <ActivityIndicator size="large" color={AppStyle.colorSet.mainColor} />
                        </View>
                    </View>
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        borderBottomColor: AppStyle.colorSet.lightGreyColor,
        borderBottomWidth: 2,
        margin: 20,
    },
    saveBtn: {
        marginTop: 50,
    }
});

const mapStateToProps = state => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(EditAccountScreen);

