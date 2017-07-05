import React, {Component} from 'react';
import {Image, Text, View, ListView} from 'react-native';
import {DrawerItems} from 'react-navigation';

import Button from 'react-native-button';

import styles from './styles';
import images from '../../config/images';

import UserManager from '../../helpers/UserManager';

export default class Menu extends Component {
    props: {
        items: any,
    };

    state = {
        userName: 'no user',
        userEmail: 'not signed in',
    }

    constructor(props) {
        super(props);

        this.onUserChanged = this.onUserChanged.bind(this);

        UserManager.addListener((user) => this.onUserChanged(user));
    }

    async componentDidMount() {
        this.onUserChanged(await UserManager.getCurrentUser());
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
                <DrawerItems {...this.props.items} />
            </View>
        );
    }
}

module.exports = Menu;
