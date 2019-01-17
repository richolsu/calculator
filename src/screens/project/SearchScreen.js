import Moment from 'moment';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { SearchBar } from "react-native-elements";
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';

class SearchScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        headerTitle:
            <SearchBar
                containerStyle={styles.searchContainer}
                inputStyle={styles.searchInput}
                showLoading
                clearIcon={true}
                searchIcon={true}
                onChangeText={(text) => navigation.state.params.handleSearch(text)}
                // onClear={alert('onClear')}
                placeholder='Search' />,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            projects: [],
            filteredProjects: [],
        };

        if (this.props.user) {

        }

        this.projectsRefUnsubscribe = null;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            handleSearch: this.onSearch
        });
        this.setState({ loading: true });
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
        this.projectsRefUnsubscribe = firebase.firestore().collection('projects').where('user_id', '==', this.props.user.id).orderBy('date', 'desc').onSnapshot(this.onProjectsCollectionUpdate);
    }

    componentWillUnmount() {
        this.projectsRefUnsubscribe();
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onBack = () => {
        this.props.navigation.goBack();
        return true;
    }

    filteredProjects = (keyword) => {
        if (keyword) {
            return this.state.projects.filter(project => {
                return project.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 || project.customer_name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;
            });
        } else {
            return this.state.projects;
        }
    }

    onSearch = (text) => {
        this.setState({ filteredProjects: this.filteredProjects(text) });
    }

    onProjectsCollectionUpdate = (querySnapshot) => {
        this.setState({ loading: true });
        const data = [];
        querySnapshot.forEach((doc) => {
            const project = doc.data();
            project.id = doc.id;
            data.push(project);
        });

        this.setState({ projects: data, filteredProjects: data, loading: false });
    }

    goToDetail = (item) => {
        this.props.navigation.navigate(item.calculation, { data: item });
    }

    dateFormat = (date) => {
        return Moment(date).format('MM/DD/YYYY');
    }

    renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.goToDetail(item)}>
            <View style={styles.row}>
                <View style={styles.leftContent}>
                    <Text style={styles.projectName}>{item.name}</Text>
                    <Text style={styles.customerName}>{item.customer_name}</Text>
                    <Text style={styles.calculationName}>{AppStyle.getCalculationLabel(item.calculation)}</Text>
                </View>
                <View style={styles.seperator}></View>
                <View style={styles.rightContent}>
                    <Text style={styles.date}>{this.dateFormat(item.date)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    render() {
        return (
            <FlatList
                data={this.state.filteredProjects}
                renderItem={this.renderItem}
                keyExtractor={item => `${item.id}`}
            />
        );
    }
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        flex: 1
    },
    searchInput: {
        backgroundColor: AppStyle.colorSet.whiteColor,
        borderRadius: 10,
        color: 'black'
    },
    row: {
        padding: 20,
        paddingRight: 0,
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: AppStyle.colorSet.lightGreyColor
    },
    seperator: {
        height: '100%',
        backgroundColor: AppStyle.colorSet.darkMainColor,
        width: 2
    },
    leftContent: {
        flex: 1
    },
    rightContent: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    projectName: {
        fontSize: AppStyle.fontSet.normal,
        color: AppStyle.colorSet.blackColor
    },
    customerName: {
        marginTop: 3,
        marginBottom: 3,
        color: AppStyle.colorSet.mainColor
    },
    calculationName: {
        color: AppStyle.colorSet.darkGreyColor
    }
});

const mapStateToProps = state => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(SearchScreen);

