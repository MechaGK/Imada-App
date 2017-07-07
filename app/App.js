import React, {Component} from 'react';
import {
    View,
    AppRegistry,
    TouchableOpacity,
    Text
} from 'react-native';
import {
    DrawerNavigator,
    StackNavigator,
    NavigationActions
} from 'react-navigation';

import colors from './config/colors';

import Icon from 'react-native-vector-icons/MaterialIcons';

import UserManager from './helpers/UserManager';

import { HomeNavigator } from './screens/home/Home';
import { SignInNavigator } from './screens/SignInScreen';

const createBaseNavigator = currentUser => {
    const navigator = StackNavigator({
        SignIn: {screen: SignInNavigator},
        HomeNavigator: {screen: HomeNavigator},
    }, {
        initialRouteName: currentUser !== null ? 'HomeNavigator' : 'SignIn',
        headerMode: 'none',
    });

    navigator.navigationOptions = {
        headerStyle: {backgroundColor: colors.primary},
        headerTitleStyle: {color: 'white'},
    };

    return navigator;
};



class App extends Component {
    state = {
        currentUser: null,
    };

    constructor(props) {
        super(props);

        this._onUserUpdated = this._onUserUpdated.bind(this);
        UserManager.addListener(this._onUserUpdated);
    }

    _onUserUpdated(user) {
        this.setState({
            currentUser: user,
        });
    }

    async componentDidMount() {
        await UserManager.getCurrentUser();
    }

    render() {
        const Navigator = createBaseNavigator(this.state.currentUser);
        return (
            <Navigator/>
        );
    }
}

AppRegistry.registerComponent('testproject', () => App);