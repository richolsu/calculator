import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';


const WIRE_SIZE_TABLE = [
    { awg: '14', copper: 15, aluminum: '-' },
    { awg: '12', copper: 20, aluminum: '15' },
    { awg: '10', copper: 30, aluminum: '25' },
    { awg: '8', copper: 50, aluminum: '40' },
    { awg: '6', copper: 65, aluminum: '50' },
    { awg: '4', copper: 85, aluminum: '65' },
    { awg: '3', copper: 100, aluminum: '75' },
    { awg: '2', copper: 115, aluminum: '90' },
    { awg: '1', copper: 130, aluminum: '100' },
    { awg: '1/0', copper: 150, aluminum: '120' },
    { awg: '2/0', copper: 175, aluminum: '135' },
    { awg: '3/0', copper: 200, aluminum: '155' },
    { awg: '4/0', copper: 230, aluminum: '180' },
    { awg: '250 kcmil', copper: 255, aluminum: '205' },
    { awg: '300', copper: 285, aluminum: '230' },
    { awg: '350', copper: 310, aluminum: '250' },
    { awg: '400', copper: 355, aluminum: '270' },
    { awg: '500', copper: 380, aluminum: '310' },
    { awg: '600', copper: 420, aluminum: '340' },
    { awg: '700', copper: 460, aluminum: '375' },
]

class AmpsByWireSizeScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Amps by Wire Size',
        headerLeft:
            <TouchableOpacity onPress={() => { navigation.toggleDrawer() }} >
                <Icon style={AppStyle.styleSet.menuButton} name="ios-menu" size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.whiteColor} />
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);
    }

    componentDidMount() {
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

    render() {
        const rowArray = WIRE_SIZE_TABLE.map((record) => {
            return (
                <View style={styles.row}>
                    <Text style={styles.awg}>{record.awg}</Text>
                    <Text style={styles.copper}>{record.copper}</Text>
                    <Text style={styles.aluminum}>{record.aluminum}</Text>
                </View>
            )
        })
        return (
            <ScrollView style={styles.container}>
                <View style={styles.row}>
                    <View style={styles.empty}></View>
                    <Text style={styles.temperature}>75°C (167°F)</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.header}>AWG</Text>
                    <Text style={styles.header}>Copper</Text>
                    <Text style={styles.header}>Aluminum</Text>
                </View>
                {rowArray}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    empty: {
        flex: 1
    },
    temperature: {
        fontWeight: 'bold',
        flex: 2,
        textAlign: 'center',
        color: AppStyle.colorSet.blackColor,
    },
    row: {
        flexDirection: 'row',
        marginTop: 10,
    },
    header: {
        fontWeight: 'bold',
        color: AppStyle.colorSet.blackColor,
        flex: 1,
        textAlign: 'center',
    },
    awg: {
        fontWeight: 'bold',
        color: AppStyle.colorSet.blackColor,
        flex: 1,
        textAlign: 'center',
    },
    copper: {
        flex: 1,
        textAlign: 'center',
    },
    aluminum: {
        flex: 1,
        textAlign: 'center',
    }

});

const mapStateToProps = state => ({
    user: state.auth.user,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(AmpsByWireSizeScreen);

