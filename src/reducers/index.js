import { NavigationActions } from 'react-navigation';
import { combineReducers } from 'redux';
import { RootNavigator } from '../navigations/AppNavigation';
import firebase from 'react-native-firebase';
import Storage from '../Storage';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = RootNavigator.router.getActionForPathAndParams('DrawerStack');
const initialNavState = RootNavigator.router.getStateForAction(
  firstAction
);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'LoginSucceed':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.lastScreenRoute, params: { calculation: action.calculation, data: action.lastData } }),
        state
      );
      break;
    case 'Login':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state
      );
      break;
    case 'Logout':
      nextState = initialNavState;
      break;
    case 'EditProject':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'EditProject', params: { data: action.payload } }),
        state
      );
      break;
    case 'Back':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.lastScreenRoute }),
        state
      );
      break;
    case 'Project':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.type, params: { calculation: action.calculation } }),
        state
      );
      break;
    case 'SquareFootage':
    case 'ConvertDecimalFraction':
    case 'FractionCalcultor':
    case 'MeasurementConversion':
    case 'AmpsToWatts':
    case 'OhmsLaw':
    case 'WireSize':
    case 'AmpsByWireSize':
    case 'WallFootage':
    case 'DrywallFootage':
    case 'FlooringTile':
    case 'RoofCalculator':
    case 'RoofPitch':
    case 'SidingBrick':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.type }),
        state
      );
      break;
    default:
      nextState = RootNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const initialAuthState = { isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'UserUpdated':
      return { ...state, user: action.user };
    case 'LoginSucceed':
      return { ...state, isLoggedIn: true, user: action.user };
    case 'Logout':
      try {
        Storage.removeAutoLogin();
        firebase.auth().signOut();
      } catch (e) {
        console.log(e);
      }
      return { ...state, isLoggedIn: false, user: {} };
    default:
      return state;
  }
}

const initialScreenState = {
  lastScreenRoute: 'SquareFootage',
  prevScreenRoute: 'SquareFootage',
  calculation: ''
};

function screen(state = initialScreenState, action) {

  switch (action.type) {
    case 'GoToProject':
      return { ...state, calculation: action.calculation, prevScreenRoute: action.routeName, lastScreenRoute: 'Project' };
    case 'SaveRouteName':
      return { prevScreenRoute: state.lastScreenRoute, lastScreenRoute: action.routeName };
    case 'SaveToProject':
      return { ...state, prevScreenRoute: action.routeName, lastScreenRoute: 'EditProject', lastData: action.payload };
    default:
      return state;
  }
}

const initialGallonRoomsState = { rooms: [] };

function gallonRooms(state = initialGallonRoomsState, action) {
  switch (action.type) {
    case 'setGallonRooms':
      return { rooms: action.rooms };
    case 'addGallonRoom':
      return { rooms: [...state.rooms, action.newRoom] };
    default:
      return state;
  }
}

const initialScrewRoomsState = { rooms: [] };

function screwRooms(state = initialScrewRoomsState, action) {
  switch (action.type) {
    case 'setScrewRooms':
      return { rooms: action.rooms };
    case 'addScrewRoom':
      return { rooms: [...state.rooms, action.newRoom] };
    case 'deleteScrewRoom':
      state.rooms.splice(action.index, 1);
      return state;
    default:
      return state;
  }
}

const initialFavoriteState = { changed: false };

function favorites(state = initialFavoriteState, action) {
  switch (action.type) {
    case 'savedFavorites':
      return { changed: true };
    case 'loadedFavorites':
      return { changed: false };
    default:
      return state;
  }
}

const initialFirstShowState = { isFirst: true };

function firstShow(state = initialFirstShowState, action) {
  switch (action.type) {
    case 'showed':
      return { isFirst: false };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  nav,
  auth,
  screen,
  gallonRooms,
  screwRooms,
  favorites,
  firstShow,
});

export default AppReducer;
