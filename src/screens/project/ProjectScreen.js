import Moment from 'moment';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import firebase from 'react-native-firebase';
import ModalSelector from 'react-native-modal-selector';
import { TabBar, TabView } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';

class ProjectScreen extends React.Component {


    static navigationOptions = ({ navigation }) => ({
        title: 'My Projects',
        headerLeft:
            <TouchableOpacity onPress={() => { navigation.toggleDrawer() }} >
                <Icon style={AppStyle.styleSet.menuButton} name="ios-menu" size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.whiteColor} />
            </TouchableOpacity>,
        headerRight:
            <TouchableOpacity onPress={() => { navigation.navigate('Search') }} >
                <Icon style={AppStyle.styleSet.rightNavButton} name="ios-search" size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.whiteColor} />
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);

        this.calculationList = AppStyle.routeLabel.map(item => {
            return { key: item.route, label: item.label };
        });

        let initCalculation = props.navigation.getParam('calculation');
        this.hasCalculation = false;
        if (!initCalculation) {
            initCalculation = this.calculationList[0];
        } else {
            this.hasCalculation = true;
            const filteredItems = this.calculationList.filter(item => item.key == initCalculation);
            if (filteredItems.length > 0) {
                initCalculation = filteredItems[0];
            } else {
                initCalculation = this.calculationList[0];
            }
        }

        this.state = {
            loading: false,
            projects: [],
            index: this.hasCalculation ? 1 : 0,
            calculation: initCalculation,
            routes: [
                { key: 'first', title: 'All' },
                { key: 'second', title: 'By Calculator' },
            ],
        };

        this.projectsRef = firebase.firestore().collection('projects');

        this.projectsRefUnsubscribe = null;
    }

    componentDidMount() {
        this.loadData(this.state.index, this.state.calculation.key);
        this.props.navigation.dispatch({ type: 'SaveRouteName', routeName: this.props.navigation.state.routeName, calculation: 'ProjectScreen' });
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }
    
    componentWillUnmount() {
        this.projectsRefUnsubscribe();
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onBack = () => {
        this.props.navigation.dispatch({ type: 'Back', lastScreenRoute: this.props.prevScreenRoute });
        return true;
    }

    loadData = (index, calculation) => {
        if (this.props.user) {
            this.setState({ loading: true });
            if (index == 1) {
                this.projectsRefUnsubscribe = this.projectsRef.where('calculation', '==', calculation).where('user_id', '==', this.props.user.id).orderBy('date', 'desc').onSnapshot(this.onProjectsCollectionUpdate);
            } else {
                this.projectsRefUnsubscribe = this.projectsRef.where('user_id', '==', this.props.user.id).orderBy('date', 'desc').onSnapshot(this.onProjectsCollectionUpdate);
            }

        }
    }


    onProjectsCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const project = doc.data();
            project.id = doc.id;
            data.push(project);
        });


        this.setState({ projects: data, loading: false });
    }

    onPress = (item) => {
        this.props.navigation.navigate('EditProject', { data: item });
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



    _onChangeCalculation = (option) => {
        this.setState({ calculation: option });
        this.loadData(1, option.key);
    }

    _renderTabBar = props => {
        return (
            <TabBar
                {...props}
                getLabelText={({ route }) => route.title}
                indicatorStyle={styles.indicator}
                renderIcon={this._renderIcon}
                labelStyle={styles.tabTitle}
                style={styles.tabbar}
            />
        );
    };


    _renderScene = ({ route }) => {
        if (this.state.loading) {
            return (
                <View style={AppStyle.styleSet.indicator}>
                    <View style={AppStyle.styleSet.indicatorBox}>
                        <ActivityIndicator size="large" color={AppStyle.colorSet.mainColor} />
                    </View>
                </View>
            )
        } else {
            if (route.key == 'second') {
                return (
                    <View style={styles.calcPage}>
                        <ModalSelector
                            touchableActiveOpacity={0.9}
                            data={this.calculationList}
                            animationType={'fade'}
                            sectionTextStyle={styles.sectionTextStyle}
                            optionTextStyle={styles.optionTextStyle}
                            optionContainerStyle={styles.optionContainerStyle}
                            cancelContainerStyle={styles.cancelContainerStyle}
                            cancelTextStyle={styles.cancelTextStyle}
                            selectedItemTextStyle={styles.selectedItemTextStyle}
                            backdropPressToClose={true}
                            cancelText={'Cancel'}
                            initValue={this.state.calculation.label}
                            onChange={this._onChangeCalculation}>
                            <View style={styles.selectView}>
                                <Text style={styles.selectText}>{this.state.calculation.label}</Text>
                                <Icon style={styles.selectIcon} name={'md-arrow-dropdown'} size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.blackColor} />
                            </View>

                        </ModalSelector>
                        <FlatList
                            style={styles.list}
                            data={this.state.projects}
                            renderItem={this.renderItem}
                            keyExtractor={item => `${item.id}`}
                        />
                    </View>
                )
            } else {
                return (
                    < FlatList
                        data={this.state.projects}
                        renderItem={this.renderItem}
                        keyExtractor={item => `${item.id}`}
                    />
                )
            }

        }
    };

    _onIndexChange = (index) => {
        this.setState({ projects: [] });
        this.setState({ index });
        this.loadData(index, this.state.calculation.key);
    }

    render() {
        return (
            <TabView
                style={styles.tabStyle}
                navigationState={this.state}
                renderScene={this._renderScene}
                onTabLongPress={this._onTabLongPress}
                renderTabBar={this._renderTabBar}
                onTabPress={this._onTabPress}
                onIndexChange={index => { this._onIndexChange(index) }}
                initialLayout={{ height: 0, width: AppStyle.windowW }}
            />
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    calcPage: {
        height: '100%',
        width: '100%',
    },
    selectView: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    selectText: {
        fontWeight: 'bold',
        color: AppStyle.colorSet.mainColor
    },
    selectIcon: {
        color: AppStyle.colorSet.mainColor,
        marginLeft: 10,
    },
    list: {
        flex: 1,
    },
    tabTitle: {
        color: AppStyle.colorSet.whiteColor,
        fontSize: AppStyle.fontSet.normal,
    },
    tabbar: {
        backgroundColor: AppStyle.colorSet.mainColor,
    },
    indicator: {
        backgroundColor: AppStyle.colorSet.pinkColor
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
    },
    container: {
        marginTop: 15,
    },
    label: {
        color: AppStyle.colorSet.darkGreyColor,
        fontSize: AppStyle.fontSet.small,
    },
    text: {
        paddingTop: 10,
        paddingBottom: 10,
        color: AppStyle.colorSet.blackColor,
        fontSize: AppStyle.fontSet.normal,
        borderBottomColor: AppStyle.colorSet.lightGreyColor,
        borderBottomWidth: 2,
    },
    optionTextStyle: {
        color: AppStyle.colorSet.blackColor,
        fontSize: 16,
    },
    selectedItemTextStyle: {
        fontSize: 18,
        color: AppStyle.colorSet.mainColor,
        fontWeight: 'bold',
    },
    optionContainerStyle: {
        backgroundColor: AppStyle.colorSet.whiteColor
    },
    cancelContainerStyle: {
        backgroundColor: AppStyle.colorSet.whiteColor,
        borderRadius: 10,
    },
    sectionTextStyle: {
        fontSize: 21,
        color: AppStyle.colorSet.blackColor,
        fontWeight: 'bold',
    },
    cancelTextStyle: {
        fontSize: 21,
        color: AppStyle.colorSet.mainColor
    }
});

const mapStateToProps = state => ({
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    prevScreenRoute: state.screen.prevScreenRoute,
});

export default connect(mapStateToProps)(ProjectScreen);

