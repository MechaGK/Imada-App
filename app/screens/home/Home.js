import React, {Component} from 'react';
import {
    Alert,
    Image,
    View,
    Text,
} from 'react-native';
import {DrawerNavigator, StackNavigator} from 'react-navigation';

import Menu from '../../components/DrawerMenu/Menu';
import MyButton from '../../components/MyButton/MyButton';
import styles from './styles';

import colors from '../../config/colors';
import ActivityList from '../../components/ActivityList';
import UserManager from '../../helpers/UserManager';

import SettingsScreen from '../SettingsScreen';

var mainNavigator;

export class Home extends Component {
    static navigationOptions = {
        title: 'Home',
    };

    state = {
        greetingTest: 'what',
        latestActivity: [],
        account: 0,
        signInVisible: false,
        registerVisible: false,
        working: false,
        username: '',
    };

    constructor(props) {
        super(props);

        this._beerPressed = this._beerPressed.bind(this);
        this._sodaPressed = this._sodaPressed.bind(this);

        mainNavigator = this.props.navigation;
    }

    async componentDidMount() {
        const user = await UserManager.getCurrentUser();
        this.setState({
            username: user.username,
            balance: user.balance,
        });
    }

    _updateActivities(itemId) {
        const newActivities = this.state.latestActivity.slice();
        newActivities.unshift(itemId);
        this.setState({latestActivity: newActivities});
    }

    _sodaPressed() {
        this._updateActivities(Date.now());
    }

    _beerPressed() {
        this._updateActivities(Date.now());
    }

    render() {
        return (
            <View style={styles.backgroundImageStyle}>
                <View style={{backgroundColor: 'transparent', flexDirection: 'row',}}>
                    <Text style={styles.saldoText}>
                        {this.state.balance} kr
                    </Text>
                </View>
                <ActivityList
                    itemList={this.state.latestActivity}/>
                <View style={{height: 150}}>
                    <View style={styles.buttonContainer}>
                        <MyButton
                            text="Sodavand"
                            style={{backgroundColor: colors.secondary}}
                            onPress={this._sodaPressed}/>
                        <MyButton
                            text="Øl"
                            style={{backgroundColor: colors.secondaryDark}}
                            onPress={this._beerPressed}/>
                    </View>
                </View>
            </View>
        );
    }
}

const Stack = StackNavigator({
    Home: {
        screen: Home,
    },
    Settings: {
        screen: SettingsScreen,
    },
}, {
    initialRouteName: 'Home',
});

export const HomeNavigator = DrawerNavigator({
    Home: {
        screen: Stack,
    },
    Settings: {
        screen: SettingsScreen,
    },
}, {
    contentComponent: props => <Menu items={props} getNavigator={() => mainNavigator}/>,
});


