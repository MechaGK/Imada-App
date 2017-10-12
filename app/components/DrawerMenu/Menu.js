import React, {Component} from 'react';
import {Image, Text, View, Alert} from 'react-native';
import {DrawerItems, NavigationActions} from 'react-navigation';

import Button from 'react-native-button';

import styles from './styles';
import images from '../../config/images';

import UserManager from '../../helpers/UserManager';

export default class Menu extends Component {
    props: {
        items: any,
        getNavigator: Object,
    };

    constructor(props) {
        super(props);

        this.state = {
            userName: 'no user',
            userEmail: 'not signed in',
            eventSubscription: null
        }

        this.onUserChanged = this.onUserChanged.bind(this);        
    }

    async componentWillMount() {
        this.onUserChanged(await UserManager.getCurrentUser());

        let sub = UserManager.addListener((user) => this.onUserChanged(user));

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

    onUserChanged(newUser) {
        if (newUser !== null) {
            this.setState({
                userName: newUser.username,
                userEmail: newUser.email,
            });
        } else {
            this.setState({
                userName: '',
                userEmail: 'not signed in',
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={images.imadaLogo} style={styles.userInfoContainer}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerName}>
                            {this.state.userName}
                        </Text>
                        <Text style={styles.headerExtra}>
                            {this.state.userEmail}
                        </Text>
                    </View>
                </Image>
                <DrawerItems {...{
                    ...this.props.items,
                    onItemPress: (route) => {
                        console.log(route);
                        const navigation = this.props.getNavigator();

                        if (route.focused) {
                            navigation.navigate('DrawerClose');
                            return;
                        }

                        var resetAction = {};
                        if (route.route.routeName === 'Home') {
                            resetAction = NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({routeName: 'Home'})
                                ]
                            });
                        } else {
                            resetAction = NavigationActions.reset({
                                index: 1,
                                actions: [
                                    NavigationActions.navigate({routeName: 'Home'}),
                                    NavigationActions.navigate({routeName: route.route.routeName})
                                ]
                            });
                        }

                        console.log(navigation);

                        navigation.dispatch(resetAction);
                    }
                }} />
            </View>
        );
    }
}

module.exports = Menu;
