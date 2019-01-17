import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { accelerometer } from "react-native-sensors";
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import CustomButton from '../../components/CustomButton';
import TriangleShape from '../../components/TriangleShape';
// import Orientation from 'react-native-orientation-locker';

class RoofPitchScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Roof Pitch',
        headerLeft:
            <TouchableOpacity onPress={() => { navigation.toggleDrawer() }} >
                <Icon style={AppStyle.styleSet.menuButton} name="ios-menu" size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.whiteColor} />
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);

        this.state = {
            angle: 21.690,
        };
    }

    componentDidMount() {
        // Orientation.lockToPortrait();
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

    checkPitch() {
        this.accObservable = accelerometer.subscribe(({ x, y, z, timestamp }) => {
            this.setState({ angle: AppStyle.formatValue(Math.abs(y) * 90 / (Platform.OS === 'ios' ? 1 : 10), 2) });
            this.accObservable.unsubscribe();
        });
    }

    componentWillUnmount() {
        // Orientation.unlockAllOrientations();
        if (this.accObservable) {
            this.accObservable.unsubscribe();
        }
    }

    goPitchTable = () => {
        this.props.navigation.navigate('PitchTable');
    }

    render() {
        let pitch = null;
        let prevRecord = null;

        for (let i = 0; i < AppStyle.pitchTable.length; i++) {
            const temp = AppStyle.pitchTable[i];
            if (this.state.angle <= temp.angle) {
                if (prevRecord) {
                    if (this.state.angle - prevRecord.angle < temp.angle - this.state.angle) {
                        pitch = prevRecord.pitch;
                    } else {
                        pitch = temp.pitch;
                    }
                } else {
                    pitch = temp.pitch;
                }
                break;
            }
            prevRecord = temp;
        }

        return (
            <ScrollView style={styles.container}>
                <TouchableOpacity onPress={() => { this.checkPitch() }} >
                    <Text style={styles.description}>Hold your phone horizontally at the pitch of the roof, and then click the image of the roof to record the roof pitch.</Text>

                    <CustomButton containerStyle={styles.btn} label="Roof Pitch Table" onPress={this.goPitchTable} />
                    <Text style={styles.roof}>{pitch} Roof</Text>

                    <View style={styles.shape}>
                        <TriangleShape
                            angle={this.state.angle}
                            borderWidth={2}
                            width={AppStyle.windowW * 0.8}
                            backgroundColor={AppStyle.colorSet.mainColor}
                            borderColor={AppStyle.colorSet.backgroundColor}>
                        </TriangleShape>
                        <View style={styles.rectangle}></View>
                    </View>
                    <View style={styles.emptyRow}>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    btn: {
        marginTop: 20,
    },
    description: {
        marginBottom: 10,
    },
    test: {
        fontSize: 10,
    },
    roof: {
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 20,
        fontWeight: 'bold',
        fontSize: AppStyle.fontSet.xlarge,
        color: AppStyle.colorSet.blackColor,
    },
    shape: {
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangle: {
        height: 200,
        borderColor: AppStyle.colorSet.blackColor,
        width: AppStyle.windowW * 0.8,
        backgroundColor: AppStyle.colorSet.mainColor
    },
    emptyRow: {
        height: 50,
    },
});

const mapStateToProps = state => ({
    user: state.auth.user,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(RoofPitchScreen);

