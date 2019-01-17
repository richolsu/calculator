import { Animated, Easing, StyleSheet, Platform } from 'react-native';
import { createDrawerNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import AppStyle from '../AppStyle';
import DrawerContainer from '../components/DrawerContainer';
import { AmpsByWireSizeScreen, AmpsToWattsScreen, ConvertDecimalFractionScreen, DrywallFootageScreen, EditAccountScreen, EditProjectScreen, FavoriteScreen, FlooringTileScreen, FractionCalcultorScreen, GallonRoomFootageScreen, LoginScreen, MeasurementConversionScreen, OhmsLawScreen, PitchTableScreen, ProjectScreen, RoofCalculatorScreen, RoofPitchScreen, ScrewRoomFootageScreen, SearchScreen, SidingBrickScreen, SignupScreen, SquareFootageScreen, WallFootageScreen, WireSizeScreen } from '../screens';




const noTransitionConfig = () => ({
    transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0
    }
})

const middleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
);

const stackOptions = {
    headerMode: 'float',
    headerLayoutPreset: 'left',
    navigationOptions: ({ navigation }) => ({
        headerTintColor: AppStyle.colorSet.whiteColor,
        headerStyle: {
            backgroundColor: AppStyle.colorSet.mainColor,
        },
        headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: AppStyle.colorSet.bgGreyColor },
}

const LoginStack = createStackNavigator({
    Login: { screen: LoginScreen },
    Signup: { screen: SignupScreen },
}, {
        ...stackOptions,
        initialRouteName: 'Login'
    }
);

const ProjectStack = createStackNavigator({
    Project: { screen: ProjectScreen },
    Search: { screen: SearchScreen },
    EditProject: { screen: EditProjectScreen },
    EditAccount: { screen: EditAccountScreen },
    Favorite: { screen: FavoriteScreen },
}, {
        ...stackOptions,
        initialRouteName: 'Project'
    }
);

const MeasurementConversionStack = createStackNavigator({
    MeasurementConversion: { screen: MeasurementConversionScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'MeasurementConversion',
    }
);

const ConvertDecimalFractionStack = createStackNavigator({
    ConvertDecimalFraction: { screen: ConvertDecimalFractionScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'ConvertDecimalFraction',
    }
);


const SquareFootageStack = createStackNavigator({
    SquareFootage: { screen: SquareFootageScreen },
    Project: { screen: ProjectScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'SquareFootage',
    }
);

const AmpsToWattsStack = createStackNavigator({
    AmpsToWatts: { screen: AmpsToWattsScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'AmpsToWatts',
    }
);

const OhmsLawStack = createStackNavigator({
    OhmsLaw: { screen: OhmsLawScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'OhmsLaw',
    }
);

const WireSizeStack = createStackNavigator({
    WireSize: { screen: WireSizeScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'WireSize',
    }
);

const AmpsByWireSizeStack = createStackNavigator({
    AmpsByWireSize: { screen: AmpsByWireSizeScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'AmpsByWireSize',
    }
);

const WallFootageStack = createStackNavigator({
    WallFootage: { screen: WallFootageScreen },
    GallonRoomFootage: { screen: GallonRoomFootageScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'WallFootage',
    }
);

const DrywallFootageStack = createStackNavigator({
    DrywallFootage: { screen: DrywallFootageScreen },
    ScrewRoomFootage: { screen: ScrewRoomFootageScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'DrywallFootage',
    }
);

const FlooringTileStack = createStackNavigator({
    FlooringTile: { screen: FlooringTileScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'FlooringTile',
    }
);

const RoofCalculatorStack = createStackNavigator({
    RoofCalculator: { screen: RoofCalculatorScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'RoofCalculator',
    }
);

const SidingBrickStack = createStackNavigator({
    SidingBrick: { screen: SidingBrickScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'SidingBrick',
    }
);

const RoofPitchStack = createStackNavigator({
    RoofPitch: { screen: RoofPitchScreen },
    PitchTable: { screen: PitchTableScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'RoofPitch',
    }
);

const FractionCalcultorStack = createStackNavigator({
    FractionCalcultor: { screen: FractionCalcultorScreen },
    Favorite: { screen: FavoriteScreen },
    EditAccount: { screen: EditAccountScreen },
}, {
        ...stackOptions,
        initialRouteName: 'FractionCalcultor',
    }
);

// drawer stack
const DrawerStack = createDrawerNavigator({
    ProjectStack: ProjectStack,
    MeasurementConversionStack: MeasurementConversionStack,
    ConvertDecimalFractionStack: ConvertDecimalFractionStack,
    SquareFootageStack: SquareFootageStack,
    AmpsToWattsStack: AmpsToWattsStack,
    OhmsLawStack: OhmsLawStack,
    WireSizeStack: WireSizeStack,
    AmpsByWireSizeStack: AmpsByWireSizeStack,
    WallFootageStack: WallFootageStack,
    DrywallFootageStack: DrywallFootageStack,
    FlooringTileStack: FlooringTileStack,
    RoofCalculatorStack: RoofCalculatorStack,
    SidingBrickStack: SidingBrickStack,
    RoofPitchStack: RoofPitchStack,
    FractionCalcultorStack: FractionCalcultorStack,
}, {
        drawerPosition: 'left',
        initialRouteName: 'SquareFootageStack',
        drawerWidth: AppStyle.windowW - 50,
        drawerBackgroundColor: AppStyle.colorSet.greyColor,
        contentComponent: DrawerContainer,
    })

// Manifest of possible screens
const RootNavigator = createSwitchNavigator({
    DrawerStack: { screen: DrawerStack },
    LoginStack: { screen: LoginStack },
}, {
        // Default config for all screens
        headerMode: 'none',
        initialRouteName: 'LoginStack',
        transitionConfig: noTransitionConfig,
        navigationOptions: ({ navigation }) => ({
            color: 'black',
        })
    })

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
    state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

const styles = StyleSheet.create({
    headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'left',
        alignSelf: 'center',
        color: AppStyle.colorSet.whiteColor,
        flex: 1,
        marginLeft: Platform.OS === 'ios' ? 30 : 0,
    },
})

export { RootNavigator, AppNavigator, middleware };

