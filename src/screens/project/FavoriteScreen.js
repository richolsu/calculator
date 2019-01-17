import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../../AppStyle';
import Storage from '../../Storage';


class FavoriteScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Favorites',
        }
    };

    constructor(props) {
        super(props);

        const newMenuData = [];
        AppStyle.MenuData.map(menu => {
            menu.member.map(subItem => {
                subItem.checked = false;
                newMenuData.push(subItem);
            });
        });

        this.state = {
            menuItems: newMenuData,
        };

        this.loadFavorites();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        this.props.navigation.dispatch({ type: 'savedFavorites' });
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onBack = () => {
        this.props.navigation.goBack();
        return true;
    }

    saveFavorites = (menuItems) => {
        Storage.saveFavorites(menuItems);
    }

    loadFavorites = () => {
        Storage.loadFavorites((menuData, stores) => {
            stores.map(store => {
                const key = store[0];
                const value = store[1];
                this.state.menuItems.forEach(menu => {
                    if (menu.route == key) {
                        menu.checked = value ? true : false;
                    }
                });
            });
            this.setState({ menuItems: this.state.menuItems });
        });
    }

    onCheck = (menuItem) => {
        menuItem.checked = !menuItem.checked;
        const newMenuItems = this.state.menuItems.map(item => {
            if (item.route == menuItem.route) {
                return menuItem;
            } else {
                return item;
            }
        });

        this.saveFavorites(newMenuItems);
        this.setState({ menuItems: newMenuItems });
    }

    renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onCheck(item)}>
            <View style={styles.container}>
                <Text style={styles.name}>{item.title}</Text>
                {item.checked &&
                    <Icon name="ios-checkmark" size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.darkGreyColor} />
                }
            </View>
        </TouchableOpacity>
    );


    render() {
        return (
            <View>
                <FlatList
                    data={this.state.menuItems}
                    renderItem={this.renderItem}
                    keyExtractor={item => `${item.route}`}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        paddingRight: 20,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: AppStyle.colorSet.darkGreyColor,
    },
    name: {
        padding: 20,
        // alignSelf: 'center',
        flex: 1,
    },

});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(FavoriteScreen);
