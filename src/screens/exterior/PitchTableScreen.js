import React from 'react';
import { StyleSheet, ScrollView, Text, View, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';


class PitchTableScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Roof Pitch Table',
    });

    constructor(props) {
        super(props);
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

    render() {
        const rowArray = AppStyle.pitchTable.map((record) => {
            return (
                <View style={styles.row}>
                    <Text style={styles.cell}>{record.pitch}</Text>
                    <Text style={styles.cell}>{record.angle.toFixed(2)}°</Text>
                </View>
            )
        })
        return (
            <ScrollView style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.header}>Roof Pitch(slope)</Text>
                    <Text style={styles.header}>Roof Angle(degree)</Text>
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
    row: {
        flexDirection: 'row',
        marginTop: 10,
    },
    header: {
        fontWeight: 'bold',
        color: AppStyle.colorSet.blackColor,
        flex: 1,
        // textAlign: 'center',
    },
    cell: {
        flex: 1,
        // textAlign: 'center',
    },

});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(PitchTableScreen);

