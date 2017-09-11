import React, {Component} from 'react';
import {
    Alert,
    Text,
    TextInput,
    Button,
    View,
} from 'react-native';

import colors from '../config/colors';

import UserManager from '../helpers/UserManager';

export default class RegisterModal extends Component {
    static navigationOptions = {
        title: 'Register',
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            name: '',
            username: '',
            email: '',
            password: '',
            passwordRepeat: '',
            working: false,
        };

        this.nameInputChanged = this.nameInputChanged.bind(this);
        this.emailInputChanged = this.emailInputChanged.bind(this);
        this.usernameInputChanged = this.usernameInputChanged.bind(this);
        this.passwordInputChanged = this.passwordInputChanged.bind(this);
        this.passwordRepeatInputChanged = this.passwordRepeatInputChanged.bind(this);
        this.buttonPressed = this.buttonPressed.bind(this);
    }

    buttonPressed() {
        console.log(this.state);
        this.registerButtonPressed(this.state.name, this.state.username, this.state.email, this.state.password, this.state.passwordRepeat);
    }

    nameInputChanged(text) {
        this.setState({
            name: text,
        });
    }

    emailInputChanged(text) {
        this.setState({
            email: text,
        });
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

    passwordRepeatInputChanged(text) {
        this.setState({
            passwordRepeat: text,
        });
    }

    async registerButtonPressed(name, username, email, password, passwordRepeat) {
        console.log(password + ', ' + passwordRepeat);

        let message = '';
        if (name === '') {
        } else if (email === '') {
            message = 'Email is required';
        } else if (username === '') {
            message = 'Username is required';
        } else if (password === '') {
            message = 'Password is required';
        } else if (passwordRepeat !== password) {
            message = 'Password fields are not identical';
        } else if (password.length < 6) {
            message = 'Password must be at least 6 characters long';
        } else if (!/^.+@.+\..+$/.test(email)){
            message = 'Email is not valid';
        } else {
            this.setState({
                working: true,
            });

            let response = await UserManager.userRegister(name, username, email, password);

            this.setState({
                working: false,
            });

            if (response.error !== undefined) {
                if (response.error.statusCode === 422) {
                    message = 'Account already exists';
                } else {
                    message = 'Unknown error';
                }
                console.log(response);
            } else {
                Alert.alert('Register successful', 'User registered');

                const {goBack} = this.props.navigation;
                goBack();

                return;
            }
        }

        Alert.alert('Register failed', message);
    }

    focusNextField(nextField) {
        this.refs[nextField].focus();
    }

    render() {
        return (
            <View style={{backgroundColor: colors.highBackground, padding: 16, flex: 1,}}>
                <Text>Name</Text>
                <TextInput
                    ref="1"
                    value={this.state.name}
                    onChangeText={this.nameInputChanged}
                    height={48}
                    autoCapitalize={'words'}
                    keyboardType={'default'}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => this.focusNextField('2')}
                />
                <Text>Username</Text>
                <TextInput
                    ref="2"
                    value={this.state.username}
                    onChangeText={this.usernameInputChanged}
                    height={48}
                    autoCapitalize={'none'}
                    keyboardType={'default'}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => this.focusNextField('3')}
                />
                <Text>Email</Text>
                <TextInput
                    ref="3"
                    value={this.state.email}
                    onChangeText={this.emailInputChanged}
                    keyboardType={'email-address'}
                    height={48}
                    autoCapitalize={'none'}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => this.focusNextField('4')}
                />
                <Text>Password</Text>
                <TextInput
                    ref="4"
                    value={this.state.password}
                    onChangeText={this.passwordInputChanged}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    height={48}
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => this.focusNextField('5')}
                />
                <Text>Repeat password</Text>
                <TextInput
                    ref="5"
                    value={this.state.passwordRepeat}
                    onChangeText={this.passwordRepeatInputChanged}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    height={48}
                    autoCorrect={false}
                    returnKeyType="go"
                    blurOnSubmit={false}
                    onSubmitEditing={() => this.buttonPressed()}
                />

                <View style={{padding: 8, }}>
                    <Button title="Register" onPress={this.buttonPressed} style={{flex: 1,}}
                            color={colors.secondary} disabled={this.props.working}/>
                </View>

                <Text style={{fontSize: 14, color: 'black'}}>
                    {this.state.status}
                </Text>
            </View>
        );
    }
}
