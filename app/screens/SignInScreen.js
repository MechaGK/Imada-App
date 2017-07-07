import React, {Component} from 'react';
import {
    Alert,
    View,
    Text,
    TextInput,
    Button
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import colors from '../config/colors';

import UserManager from '../helpers/UserManager';
import RegistrationScreen from '../screens/RegisterScreen';

export class SignInScreen extends Component {
    static navigationOptions = {
        title: 'Sign In',
    };

    state = {
        visible: false,
        username: '',
        password: '',
        state: '',
    };

    constructor(props) {
        super(props);

        this.usernameInputChanged = this.usernameInputChanged.bind(this);
        this.passwordInputChanged = this.passwordInputChanged.bind(this);
        this.loginButtonPressed = this.loginButtonPressed.bind(this);
    }

    usernameInputChanged(text) {
        this.setState({
            username: text,
        });
    }

    passwordInputChanged(text) {
        this.setState({
            password: text,
        });
    }

    async loginButtonPressed(username, password) {
        if (username === '') {
            Alert.alert('Sign in failed', 'Email required');
            return;
        } else if (password === '') {
            Alert.alert('Sign in failed', 'Password required');
            return;
        }

        this.setState({
            working: true,
        });

        let response = await UserManager.userSignIn(username, password);

        this.setState({
            working: false,
        });

        if (response.code === 'SUCCESS') {
            return;
        }

        let message = '';

        if (response.code === 'LOGIN_FAILED') {
            message = 'Wrong email or password';
        }

        Alert.alert('Sign in failed', message);
    }

    render() {
        return (
            <View style={{padding: 12, backgroundColor: colors.background, flex: 1,}}>
                <Text>Username</Text>
                <TextInput
                    value={this.state.username}
                    onChangeText={this.usernameInputChanged}
                    keyboardType={'email-address'}
                    height={48}
                    autoCapitalize={'none'}
                    placeholder={'abcde12'}
                />
                <Text>Password</Text>
                <TextInput
                    value={this.state.password}
                    onChangeText={this.passwordInputChanged}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    height={48}
                    placeholder={'hunter2'}
                    autoCorrect={false}
                />

                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button title="Register" onPress={() =>{
                        this.props.navigation.navigate('Register');
                    }}
                            style={{flex: 1,}} disabled={this.state.working}
                            color={colors.secondary}
                    />
                    <Button title="Log ind" onPress={() => this.loginButtonPressed(this.state.username, this.state.password)}
                            style={{flex: 1,}} disabled={this.state.working}
                            color={colors.secondary}
                    />
                </View>

                <Text style={{fontSize: 14, color: 'black'}}>
                    {this.state.status}
                </Text>
            </View>
        )
    }
}

export const SignInNavigator = StackNavigator({
    SignIn: {
        screen: SignInScreen,
    },
    Register: {
        screen: RegistrationScreen,
    },
});
