import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableNativeFeedback,
    TouchableHighlight,
    Platform,
} from 'react-native';

import styles from './styles';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

export default class MyButton extends Component {
    props: {
        text: string,
        onPress: () => void,
    };

    static defaultProps = {
        ...Component.defaultProps,
        doublePressTimeout: 400,
    }

    state = {
        lastPress: 0,
        buttonText: this.props.text,
        timerId: null,
    };

    _onButtonPressed() {
        console.log(Date.now(), this.state.lastPress, this.props.doublePressTimeout);
        if (Date.now() - this.state.lastPress > this.props.doublePressTimeout) {
            console.log('beginning double tap...');
            this._setState(true);
            const timerId = this.setTimeout(
                () => {
                    this._setState(false);
                },
                this.props.doublePressTimeout
            );
            this.setState({
                lastPress: Date.now(),
                timerId: timerId,
            });
        }
        else {
            this.props.onPress();
            this.clearTimeout(this.state.timerId);
            this._setState(false);
        }
    }

    _setState(doublePressing: boolean) {
        console.log('setting state', doublePressing);
        var buttonText = this.props.text;

        if (doublePressing) {
            // TODO: Find a place for hard coded string
            buttonText = 'Tap again to confirm';
        }

        this.setState({
            buttonText: buttonText,
        });
    }

    render() {
        const formattedText = this.state.buttonText.toUpperCase();

        if (Platform.OS === 'android') {
            return (
                <TouchableNativeFeedback onPress={() => this._onButtonPressed()}>
                    <View style={[styles.buttonStyle, this.props.style]}>
                        <Text style={[styles.buttonTextStyle, this.props.textStyle]}>{formattedText}</Text>
                    </View>
                </TouchableNativeFeedback>
            );
        }
        else {
            return (
                <View style={{flex: 1,}}>
                    <TouchableHighlight style={[styles.buttonStyle, this.props.style]} onPress={() => this._onButtonPressed()}>
                        <Text style={[styles.buttonTextStyle, this.props.textStyle]}>{formattedText}</Text>
                    </TouchableHighlight>
                </View>
            );
        }
        
    }
}

reactMixin(MyButton.prototype, TimerMixin);
