import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, ActivityIndicator, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { CustomInput, CustomButton } from '../../components/';
import AppStyle from '../../AppStyle';
import firebase from 'react-native-firebase';


class EditProjectScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Save Project',
        headerRight:
            <TouchableOpacity onPress={() => { navigation.state.params.onSave() }} >
                <Text style={AppStyle.styleSet.rightNavButton}>SAVE</Text>
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);

        let project = props.navigation.getParam('data');

        if (!project) {
            project = {
                calculation: '',
                name: '',
                customer_name: '',
                notes: '',
            }
        }

        this.state = project;

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
        const data = {
            ...this.state,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            user_id: this.props.user.id
        };

        delete data.loading;

        this.setState({ loading: true });

        if (!this.state.id) {
            firebase.firestore().collection('projects').add(data).then((docRef) => {
                this.setState({ loading: false });
                this.props.navigation.goBack();
            }).catch(error => {
                this.setState({ loading: false });
                alert(error);
            });
        } else {
            delete data.id;

            firebase.firestore().collection('projects').doc(this.state.id).set(data).then((docRef) => {
                this.setState({ loading: false });
                this.props.navigation.goBack();
            }).catch(error => {
                this.setState({ loading: false });
                alert(error);
            });
        }
    }

    render() {
        return (
            <ScrollView>
                <CustomInput
                    style={styles.input}
                    label="Calculation"
                    editable={false}
                    value={AppStyle.getCalculationLabel(this.state.calculation)} />
                <CustomInput
                    style={styles.input}
                    label="Project Name"
                    returnKeyType="next"
                    onSubmitEditing={() => { this.customerInput.focus(); }}
                    inputRef={(c) => this.resInput = c}
                    value={this.state.name}
                    onChangeText={(text) => this.setState({ name: text })} />
                <CustomInput
                    style={styles.input}
                    label="Customer Name (optional)"
                    returnKeyType="next"
                    onSubmitEditing={() => { this.notesInput.focus(); }}
                    inputRef={(c) => this.customerInput = c}
                    value={this.state.customer_name}
                    onChangeText={(text) => this.setState({ customer_name: text })} />
                <CustomInput
                    style={styles.input}
                    label="Notes"
                    inputRef={(c) => this.notesInput = c}
                    value={this.state.notes}
                    onChangeText={(text) => this.setState({ notes: text })} />

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

export default connect(mapStateToProps)(EditProjectScreen);

