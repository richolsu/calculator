import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View } from 'react-native';
import ExpanableList from 'react-native-expandable-section-list';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppStyle from '../AppStyle';
import Storage from '../Storage';
import PopupMenu from './PopupMenu';
import { SafeAreaView } from 'react-navigation';
import ActionSheet from 'react-native-actionsheet'

const FAVORITES_MENU_TITLE = 'Favorites';



class DrawerContainer extends React.Component {

  constructor(props) {
    super(props);

    const map = new Map();
    AppStyle.MenuData.map((item, i) => map.set(i.toString(), true));

    this.state = {
      openState: map,
      openOptions: [],
      menuData: [...AppStyle.MenuData],
    };
  }

  componentDidMount() {
    this.loadFavorites();
  }

  componentDidUpdate() {
    if (this.props.favoritesChanged) {
      this.loadFavorites();
    }
  }

  loadFavorites = () => {
    Storage.loadMenuOpenState((value) => {
      let menuOpenState = [false, false, false, false, false];
      if (value) {
        menuOpenState = JSON.parse(value);
      }

      Storage.loadFavorites((menuData, stores) => {
        const favoriteMenuItems = [];
        stores.map(store => {
          const key = store[0];
          const value = store[1];
          menuData.forEach(menu => {
            if (menu.route == key && value) {
              favoriteMenuItems.push(menu);
            }
          });
        });

        const favoriteMenu = {
          title: FAVORITES_MENU_TITLE,
          member: favoriteMenuItems
        };

        const newMenuData = [favoriteMenu, ...AppStyle.MenuData];
        const map = new Map();

        const openOptions = [];
        newMenuData.map((item, i) => {
          const value = menuOpenState[i];
          if (value) {
            openOptions.push(i);
          }
          map.set(i.toString(), value);
        });

        this.setState({
          openState: map,
          menuData: newMenuData,
          openOptions: openOptions,
        });

        this.props.navigation.dispatch({ type: 'loadedFavorites' });
      });
    });
  }

  showAccount = () => {
    if (!this.props.user) {
      alert("Please login first");
      return;
    }
    this.props.navigation.navigate('EditAccount');
  }

  showSetting = () => {
    this.props.navigation.navigate('Favorite');
  }

  onPressItem = (item) => {

    this.props.navigation.closeDrawer();
    if (item.route == 'SimplySend') {
      AppStyle.onSimplySend();
    } else {
      if (this.props.isLoggedIn) {
        this.props.navigation.navigate(item.route, { data: null });
      } else {
        this.props.navigation.dispatch({ type: item.route, routeName: this.props.navigation.state.routeName });
      }
    }
  }

  onProjects = () => {
    if (this.props.isLoggedIn) {
      this.props.navigation.dispatch({ type: 'Project', routeName: this.props.navigation.state.routeName });
    } else {
      this.props.navigation.dispatch({ type: 'GoToProject', routeName: this.props.navigation.state.routeName });
      this.props.navigation.navigate('Login');
    }
  }

  onSettingActionDone = (index) => {
    if (this.props.isLoggedIn) {
      if (index == 0) {
        this.showAccount();
      } else if (index == 1) {
        this.showSetting();
      } else if (index == 2) {
        this.props.navigation.closeDrawer();
        this.props.navigation.dispatch({ type: 'Logout' })
      }
    } else {
      if (index == 0) {
        this.showSetting();
      }
    }

  }

  onPopupEvent = () => {
    this.settingActionSheet.show();
  }

  getActionSheetOptions = () => {
    if (this.props.isLoggedIn) {
      return { items: ['My Account', 'Settings', 'Log Out', 'Cancel'], canacelIndex: 3 };
    } else {
      return { items: ['Settings', 'Cancel'], canacelIndex: 1 };
    }
  }



  headerOnPress = (index, openState) => {
    this.state.openState.set(index.toString(), openState);

    const currentOpenState = [];
    this.state.openState.forEach((value, key) => {
      currentOpenState[key] = value;
    });

    Storage.saveMenuOpenState(currentOpenState);
    this.loadFavorites();

  }

  renderSection = (section, sectionId) => {
    const iconName = this.state.openState.get(sectionId) ? 'md-arrow-dropdown' : 'md-arrow-dropright';
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{section}</Text>
        <Icon style={styles.iconArrow} name={iconName} size={AppStyle.iconSizeSet.normal} color={AppStyle.colorSet.blackColor} />
      </View>
    );
  }

  renderItem = (item, rowId) => {
    return (
      <TouchableOpacity key={rowId} onPress={() => { this.onPressItem(item) }} >
        <Text style={styles.menuTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.props.favoritesChanged) {
      return (<View></View>);
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.avatar}><Icon style={styles.avatarIcon} name="ios-person" size={AppStyle.iconSizeSet.large} color={AppStyle.colorSet.mainColor} /></View>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.username}>{this.props.user && this.props.user.name ? this.props.user.name : 'Anonymous'}</Text>
            {/* <PopupMenu style={styles.icon} actions={this.props.isLoggedIn ? ['My Account', 'Settings'] : ['Settings']} onPress={this.onPopupEvent} /> */}
            <TouchableOpacity onPress={this.onPopupEvent}>
              <Icon
                style={styles.icon}
                name='md-more'
                size={AppStyle.iconSizeSet.normal}
                color={AppStyle.colorSet.whiteColor} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scroll}>
            <TouchableOpacity onPress={() => { this.onProjects() }} >
              <Text style={styles.ProjectStackTitle}>My Projects</Text>
            </TouchableOpacity>
            <ExpanableList
              style={styles.list}
              dataSource={this.state.menuData}
              headerKey="title"
              memberKey="member"
              ref={instance => this.ExpandableList = instance}
              openOptions={this.state.openOptions}
              renderRow={this.renderItem}
              headerOnPress={this.headerOnPress}
              renderSectionHeaderX={this.renderSection}
            />
            <TouchableOpacity onPress={AppStyle.onLinkWeb} >
              <Text style={styles.footerTitle}>Learn more about FieldPulse</Text>
            </TouchableOpacity>
          </ScrollView>
          <ActionSheet
            ref={o => this.settingActionSheet = o}
            options={this.getActionSheetOptions().items}
            cancelButtonIndex={this.getActionSheetOptions().canacelIndex}
            // destructiveButtonIndex={0}
            onPress={(index) => { this.onSettingActionDone(index) }}
          />
        </SafeAreaView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    backgroundColor: AppStyle.colorSet.mainColor,
    height: 55,
    paddingLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppStyle.colorSet.whiteColor,
    justifyContent: 'center',
  },
  username: {
    flex: 1,
    color: AppStyle.colorSet.whiteColor,
    fontSize: AppStyle.fontSet.middle,
    marginLeft: 30,
  },
  avatarIcon: {
    alignSelf: 'center',
  },
  icon: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  scroll: {
    flex: 1,
  },
  list: {
    flex: 1
  },
  sectionContainer: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
  },
  sectionTitle: {
    flex: 1,
    marginLeft: 10,
  },
  iconArrow: {
    marginRight: 30,
  },
  menuTitle: {
    margin: 15,
    color: AppStyle.colorSet.blackColor,
    marginLeft: 100,
  },
  ProjectStackTitle: {
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  footerTitle: {
    padding: 10,
    margin: 10,
    color: AppStyle.colorSet.mainColor
  }
});

const mapStateToProps = state => ({
  user: state.auth.user,
  isLoggedIn: state.auth.isLoggedIn,
  favoritesChanged: state.favorites.changed,
});

export default connect(mapStateToProps)(DrawerContainer);

