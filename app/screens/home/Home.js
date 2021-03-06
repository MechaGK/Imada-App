import React, {Component} from 'react';
import {
    Alert,
    Image,
    View,
    Text,
    TouchableOpacity,
    Button
} from 'react-native';
import {DrawerNavigator, StackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Menu from '../../components/DrawerMenu/Menu';
import MyButton from '../../components/MyButton/MyButton';
import DrawerButton from '../../components/DrawerButton';
import styles from './styles';

import colors from '../../config/colors';
import { ActivityList, ItemList } from '../../components/ActivityList';
import UserManager from '../../helpers/UserManager';

import SettingsScreen from '../SettingsScreen';

var mainNavigator;

export class Home extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Home',
        headerLeft:
            <TouchableOpacity
                style={styles.drawerButton}
                onPress={() => navigation.navigate('DrawerOpen')}>
                <Icon name="menu" size={28} color={'black'}/>
            </TouchableOpacity>,
    });

    constructor(props) {
        super(props);

        this.state = {
            greetingTest: 'what',
            latestActivity: [],
            account: 0,
            signInVisible: false,
            registerVisible: false,
            working: false,
            username: '',
            lastPress: 0,
            eventSubscription: null
        };

        this._beerPressed = this._beerPressed.bind(this);
        this._sodaPressed = this._sodaPressed.bind(this);
        this.onUserUpdate = this.onUserUpdate.bind(this);

        mainNavigator = this.props.navigation;
    }

    async componentWillMount() {
        const user = await UserManager.getCurrentUser();
        this.onUserUpdate(user);

        var sub = UserManager.addListener(this.onUserUpdate);
        this.setState({
            eventSubscription: sub
        });
    }

    componentWillUnmount() {
        if (this.state.eventSubscription !== null) {
            this.state.eventSubscription.remove();
            this.setState({
                eventSubscription: null
            });
        }
    }

    onUserUpdate(user) {
        this.setState({
            username: user.username,
            balance: user.balance,
        });
    }

    async _updateActivities(item: ItemList) {
        if (this.state.lastPress > Date.now() - 200) { return; }

        const newActivities = this.state.latestActivity.slice();
        newActivities.unshift(item);
        this.setState({
            latestActivity: newActivities.slice(0, 5),
        });

        this.setState({
            lastPress: Date.now(),
        });

        const balance = this.state.balance;
        this.setState({
            balance: balance - item.amount,
        });

        await UserManager.spendAmount(item.amount);
    }

    async _sodaPressed() {
        await this._updateActivities({
            date: new Date(),
            type: 'soda',
            amount: 5,
        });
    }

    async _beerPressed() {
        await this._updateActivities({
            date: new Date(),
            type: 'beer',
            amount: 5,
        });
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
                <Text style={styles.hintText}>
                    Double tap to set item
                </Text>
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
