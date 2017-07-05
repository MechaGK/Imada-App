import React, {Component} from 'react';
import {View, Button} from 'react-native';
import {NavigationActions} from 'react-navigation';
import UserManager from '../helpers/UserManager';

export default class SettingsScreen extends Component {
    static navigationOptions = {
        title: 'Settings',
    };

    render() {
        return (
            <View style={{ padding: 12, backgroundColor: 'white', flex: 1, }}>
                <Button
                    title="Sign out"
                    onPress={async () => {
                        await UserManager.userSignOut();
                        const backAction = NavigationActions.back({
                            key: 'Profile'
                        });
                        this.props.navigation.dispatch(backAction);
                    }}/>
            </View>
        );
    }
}
