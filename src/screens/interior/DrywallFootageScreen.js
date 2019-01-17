import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import { CustomButton, CustomInput, CustomModalInput } from '../../components';

class DrywallFootageScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'Drywall Footage',
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
            wall1_length: '',
            wall2_length: '',
            wall3_length: '',
            wall4_length: '',
            wall_height: '',
            ceiling_length: '',
            ceiling_width: '',
            avg_window_height: '',
            avg_window_width: '',
            number_of_windows: '',
            avg_door_height: '',
            avg_door_width: '',
            number_of_doors: '',
            wastage_percentage: '',
            drywall_sheet_square_footage: '32',
            screws_per_sheet_of_drywall: '28',
            total_surface_square_footage: '',
            total_sheets_of_drywall: '',
            total_screws: '',
        };
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
            this.props.navigation.dispatch({ type: 'Project', routeName: this.props.navigation.state.routeName, calculation: 'ScrewRoomFootage' });
        } else {
            this.props.navigation.dispatch({ type: 'GoToProject', routeName: this.props.navigation.state.routeName, calculation: 'ScrewRoomFootage' });
            this.props.navigation.navigate('Login');
        }
    }

    onCalc = () => {
        let sumLength = 0;
        const wall1_length = AppStyle.checkValue(this.state.wall1_length);
        if (wall1_length) {
            sumLength += wall1_length;
        }
        const wall2_length = AppStyle.checkValue(this.state.wall2_length);
        if (wall2_length) {
            sumLength += wall2_length;
        }
        const wall3_length = AppStyle.checkValue(this.state.wall3_length);
        if (wall3_length) {
            sumLength += wall3_length;
        }
        const wall4_length = AppStyle.checkValue(this.state.wall4_length);
        if (wall4_length) {
            sumLength += wall4_length;
        }
        const wall_height = AppStyle.checkValue(this.state.wall_height);
        if (!wall_height) {
            return;
        }

        let ceiling_length = AppStyle.checkValue(this.state.ceiling_length);
        if (!ceiling_length) {
            ceiling_length = 0;
        }

        let ceiling_width = AppStyle.checkValue(this.state.ceiling_width);
        if (!ceiling_width) {
            ceiling_width = 0;
        }

        let avg_window_height = AppStyle.checkValue(this.state.avg_window_height);
        if (!avg_window_height) {
            avg_window_height = 0;
        }
        let avg_window_width = AppStyle.checkValue(this.state.avg_window_width);
        if (!avg_window_width) {
            avg_window_width = 0;
        }
        let number_of_windows = AppStyle.checkValue(this.state.number_of_windows);
        if (!number_of_windows) {
            number_of_windows = 0;
        }

        let avg_door_height = AppStyle.checkValue(this.state.avg_door_height);
        if (!avg_door_height) {
            avg_door_height = 0;
        }
        let avg_door_width = AppStyle.checkValue(this.state.avg_door_width);
        if (!avg_door_width) {
            avg_door_width = 0;
        }
        let number_of_doors = AppStyle.checkValue(this.state.number_of_doors);
        if (!number_of_doors) {
            number_of_doors = 0;
        }
        let wastage_percentage = AppStyle.checkValue(this.state.wastage_percentage);
        if (!wastage_percentage) {
            wastage_percentage = 0;
        }
        let drywall_sheet_square_footage = AppStyle.checkValue(this.state.drywall_sheet_square_footage);
        if (!drywall_sheet_square_footage) {
            drywall_sheet_square_footage = 32;
            this.setState({ drywall_sheet_square_footage: AppStyle.formatValue(drywall_sheet_square_footage, 0) });
        }
        let screws_per_sheet_of_drywall = AppStyle.checkValue(this.state.screws_per_sheet_of_drywall);
        if (!screws_per_sheet_of_drywall) {
            screws_per_sheet_of_drywall = 28;
            this.setState({ screws_per_sheet_of_drywall: AppStyle.formatValue(screws_per_sheet_of_drywall, 0) });
        }

        const total_surface_square_footage = (sumLength * wall_height +
            ceiling_length * ceiling_width -
            avg_window_height * avg_window_width * number_of_windows -
            avg_door_height * avg_door_width * number_of_doors) / (12 * 12);

        const total_sheets = (total_surface_square_footage * (100 + wastage_percentage) / 100) / drywall_sheet_square_footage;
        const toall_screws = total_sheets * screws_per_sheet_of_drywall;

        this.setState({
            total_surface_square_footage: AppStyle.formatValue(total_surface_square_footage, 2),
            total_sheets_of_drywall: AppStyle.formatValue((0.5 + total_sheets), 0),
            total_screws: AppStyle.formatValue((0.5 + toall_screws), 0)
        });
    }

    onClear = () => {
        this.setState({
            wall1_length: '',
            wall2_length: '',
            wall3_length: '',
            wall4_length: '',
            wall_height: '',
            ceiling_length: '',
            ceiling_width: '',
            avg_window_height: '',
            avg_window_width: '',
            number_of_windows: '',
            avg_door_height: '',
            avg_door_width: '',
            number_of_doors: '',
            drywall_sheet_square_footage: '',
            screws_per_sheet_of_drywall: '',
            total_surface_square_footage: '',
            total_sheets_of_drywall: '',
            total_screws: '',
        });
    }

    createMessage = () => {
        let message = '';

        message += 'Wall 1 Length = ' + this.state.wall1_length + '\n';
        message += 'Wall 2 Length = ' + this.state.wall2_length + '\n';
        message += 'Wall 3 Length = ' + this.state.wall3_length + '\n';
        message += 'Wall 4 Length = ' + this.state.wall4_length + '\n';
        message += 'Wall height = ' + this.state.wall_height + '\n';
        message += 'Ceiling Length = ' + this.state.ceiling_length + '\n';
        message += 'Ceiling Width = ' + this.state.ceiling_width + '\n';
        message += 'Avg Window Height = ' + this.state.avg_window_height + '\n';
        message += 'Avg Window Width = ' + this.state.avg_window_width + '\n';
        message += 'Number of Windows = ' + this.state.number_of_windows + '\n';
        message += 'Avg Door Height = ' + this.state.avg_door_height + '\n';
        message += 'Avg Door Width = ' + this.state.avg_door_width + '\n';
        message += 'Number of Doors = ' + this.state.number_of_doors + '\n';
        message += 'Wastage Percentage = ' + this.state.wastage_percentage + '%\n';
        message += 'Drywall Sheet Square Footage = ' + this.state.drywall_sheet_square_footage + '\n';
        message += 'Screws Per Sheet of Drywall = ' + this.state.screws_per_sheet_of_drywall + '\n\n';
        message += 'Total Surface Square Footage (Minus Windows/Doors) = ' + this.state.total_surface_square_footage + '\n';
        message += 'Total Sheets of Drywall = ' + this.state.total_sheets_of_drywall + '\n';
        message += 'Total Screws = ' + this.state.total_screws + '\n';

        return message;
    }

    onEmail = () => {
        AppStyle.onEmail('Drywall Footage', this.createMessage());
    }

    onShare = () => {
        AppStyle.onShare('Drywall Footage', this.createMessage());
    }

    onSaveRoom = () => {
        const payload = {
            name: 'New Room',
            total_sheets_of_drywall: this.state.total_sheets_of_drywall,
            total_surface_square_footage: this.state.total_surface_square_footage,
            total_screws: this.state.total_screws
        }
        this.props.navigation.dispatch({ type: 'addScrewRoom', newRoom: payload });
    }

    onViewAllRooms = () => {
        this.props.navigation.navigate('ScrewRoomFootage');
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.description}>Enter the measurements to calculate the total drywall square footage of the room. All measurements in feet.</Text>
                <Text style={styles.sectionTitle}>Wall and Ceiling Measurements</Text>
                <View style={styles.row}>
                    <CustomModalInput
                        style={styles.input}
                        label="Wall 1 Length"
                        number={true}
                        value={this.state.wall1_length}
                        onChangeText={(text) => { this.setState({ 'wall1_length': text }) }} />
                    <View style={styles.seperator}></View>
                    <CustomModalInput
                        style={styles.input}
                        label="Wall 2 Length"
                        number={true}
                        value={this.state.wall2_length}
                        onChangeText={(text) => { this.setState({ 'wall2_length': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomModalInput
                        style={styles.input}
                        label="Wall 3 Length"
                        number={true}
                        value={this.state.wall3_length}
                        onChangeText={(text) => { this.setState({ 'wall3_length': text }) }} />
                    <View style={styles.seperator}></View>
                    <CustomModalInput
                        style={styles.input}
                        label="Wall 4 Length"
                        number={true}
                        value={this.state.wall4_length}
                        onChangeText={(text) => { this.setState({ 'wall4_length': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomModalInput
                        style={styles.input}
                        label="Wall height"
                        number={true}
                        value={this.state.wall_height}
                        onChangeText={(text) => { this.setState({ 'wall_height': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomModalInput
                        style={styles.input}
                        label="Ceiling Length"
                        number={true}
                        value={this.state.ceiling_length}
                        onChangeText={(text) => { this.setState({ 'ceiling_length': text }) }} />
                    <View style={styles.seperator}></View>
                    <CustomModalInput
                        style={styles.input}
                        label="Ceiling Width"
                        number={true}
                        value={this.state.ceiling_width}
                        onChangeText={(text) => { this.setState({ 'ceiling_width': text }) }} />
                </View>
                <Text style={styles.sectionTitle}>Window and Door Measurements (optional)</Text>
                <View style={styles.row}>
                    <CustomModalInput
                        style={styles.input}
                        label="Avg Window Height"
                        number={true}
                        value={this.state.avg_window_height}
                        onChangeText={(text) => { this.setState({ 'avg_window_height': text }) }} />
                    <View style={styles.seperator}></View>
                    <CustomModalInput
                        style={styles.input}
                        label="Avg Window Width"
                        number={true}
                        value={this.state.avg_window_width}
                        onChangeText={(text) => { this.setState({ 'avg_window_width': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Number of Windows"
                        returnKeyType="next"
                        onSubmitEditing={() => { this.doorsInput.focus(); }}
                        number={true}
                        value={this.state.number_of_windows}
                        onChangeText={(text) => { this.setState({ 'number_of_windows': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomModalInput
                        style={styles.input}
                        label="Avg Door Height"
                        number={true}
                        value={this.state.avg_door_height}
                        onChangeText={(text) => { this.setState({ 'avg_door_height': text }) }} />
                    <View style={styles.seperator}></View>
                    <CustomModalInput
                        style={styles.input}
                        label="Avg Door Width"
                        number={true}
                        value={this.state.avg_door_width}
                        onChangeText={(text) => { this.setState({ 'avg_door_width': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Number of Doors"
                        returnKeyType="next"
                        inputRef={(c) => this.doorsInput = c}
                        onSubmitEditing={() => { this.wastageInput.focus(); }}
                        number={true}
                        value={this.state.number_of_doors}
                        onChangeText={(text) => { this.setState({ 'number_of_doors': text }) }} />
                </View>
                <Text style={styles.sectionTitle}>Additional Info (optional)</Text>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Wastage Percentage (%)"
                        number={true}
                        returnKeyType="next"
                        inputRef={(c) => this.wastageInput = c}
                        onSubmitEditing={() => { this.sheetInput.focus(); }}
                        value={this.state.wastage_percentage}
                        onChangeText={(text) => { this.setState({ 'wastage_percentage': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Drywall Sheet Square Footage (4'x 8'=32 square feet)"
                        number={true}
                        returnKeyType="next"
                        inputRef={(c) => this.sheetInput = c}
                        onSubmitEditing={() => { this.screwsInput.focus(); }}
                        value={this.state.drywall_sheet_square_footage}
                        onChangeText={(text) => { this.setState({ 'drywall_sheet_square_footage': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomInput
                        style={styles.input}
                        label="Screws Per Sheet of Drywall"
                        number={true}
                        inputRef={(c) => this.screwsInput = c}
                        value={this.state.screws_per_sheet_of_drywall}
                        onChangeText={(text) => { this.setState({ 'screws_per_sheet_of_drywall': text }) }} />
                </View>
                <View style={styles.row}>
                    <CustomButton style={styles.btn} label="Calculate" onPress={this.onCalc} />
                    <View style={styles.btnSeperator}></View>
                    <CustomButton style={styles.btn} mode="clear" label="Clear" onPress={this.onClear} />
                </View>
                <View style={[styles.row, { marginTop: 10 }]}>
                    <Text style={styles.resultLabel}>Total Surface Square Footage {'\n'}(Minus Windows/Doors)</Text>
                    <Text style={styles.resultValue}>{this.state.total_surface_square_footage}</Text>
                </View>
                <View style={[styles.row, { marginTop: 10 }]}>
                    <Text style={styles.resultLabel}>Total Sheets of Drywall</Text>
                    <Text style={styles.resultValue}>{this.state.total_sheets_of_drywall}</Text>
                </View>
                <View style={[styles.row, { marginTop: 10 }]}>
                    <Text style={styles.resultLabel}>Total Screws</Text>
                    <Text style={styles.resultValue}>{this.state.total_screws}</Text>
                </View>
                <View style={styles.row}>
                    <CustomButton style={styles.btn} mode="link" label="Save Room" onPress={this.onSaveRoom} />
                    <View style={styles.btnSeperator}></View>
                    <CustomButton style={styles.btn} mode="link" label="View All Rooms" onPress={this.onViewAllRooms} />
                </View>
                <View style={styles.row}>
                    <CustomButton style={styles.btn} mode="link" label="Share" onPress={this.onShare} />
                </View>
                <View style={styles.emptyRow}>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    description: {
        marginBottom: 25,
    },
    sectionTitle: {
        color: AppStyle.colorSet.blackColor,
        marginBottom: 20,
    },
    emptyRow: {
        height: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'center',
    },
    seperator: {
        flex: 1,
    },
    input: {
        flex: 2,
        borderBottomColor: AppStyle.colorSet.lightGreyColor,
        borderBottomWidth: 2,
    },
    btn: {
        alignSelf: 'center',
    },
    btnSeperator: {
        width: 30,
    },
    resultLabel: {
        flex: 2,
        fontSize: AppStyle.fontSet.normal,
    },
    resultValue: {
        flex: 1,
        fontSize: AppStyle.fontSet.middle,
        color: AppStyle.colorSet.blackColor,
        textAlign: 'right',
    },

});

const mapStateToProps = state => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(DrywallFootageScreen);

