import { AsyncStorage } from 'react-native';
import AppStyle from './AppStyle';


const _saveFavorites = (menuItems) => {
  const saveData = menuItems.map(menu => {
    return [menu.route, menu.checked ? 'checked' : ''];
  });

  try {
    AsyncStorage.multiSet(saveData);
  } catch (error) {
    console.log(error);
  }
}
const _getSubMenuItems = () => {
  const newMenuData = [];
  AppStyle.MenuData.map(menu => {
    menu.member.map(subItem => {
      newMenuData.push(subItem);
    });
  });

  return newMenuData;
}

const _loadFavorites = (callback) => {
  const menuData = _getSubMenuItems();

  const keys = menuData.map(menu => {
    return menu.route;
  });

  try {
    AsyncStorage.multiGet(keys, (err, stores) => {
      callback(menuData, stores);
    });
  } catch (error) {
    callback([]);
    console.log(error);
  }

}

const _saveLoginInfo = (email, password) => {
  try {
    AsyncStorage.multiSet([['email', email], ['password', password], ['autoLogin', '1']]);
  } catch (error) {
    console.log(error);
  }
}

const _loadLoginInfo = (callback) => {

  try {
    AsyncStorage.multiGet(['email', 'password', 'autoLogin'], (err, stores) => {
      callback(stores);
    });
  } catch (error) {
    console.log(error);
    callback([]);
  }
}

const _removeAutoLogin = () => {

  try {
    AsyncStorage.multiSet([['autoLogin', '0']], (err, stores) => {
    });
  } catch (error) {
    console.log(error);
  }
}

const MENU_OPEN_STATE_KEY = 'menu_open_state';

const _saveMenuOpenState = (state) => {
  try {
    AsyncStorage.setItem(MENU_OPEN_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.log(error);
  }
}

const _loadMenuOpenState = (callback) => {
  try {
    AsyncStorage.getItem(MENU_OPEN_STATE_KEY, (err, result) => {
      callback(result);
    });
  } catch (error) {
    console.log(error);
    callback(null);
  }
}

const Storage = {
  saveFavorites: _saveFavorites,
  loadFavorites: _loadFavorites,
  saveLoginInfo: _saveLoginInfo,
  loadLoginInfo: _loadLoginInfo,
  saveMenuOpenState: _saveMenuOpenState,
  loadMenuOpenState: _loadMenuOpenState,
  removeAutoLogin: _removeAutoLogin,
}
export default Storage;

