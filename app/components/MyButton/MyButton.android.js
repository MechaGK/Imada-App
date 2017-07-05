import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableNativeFeedback,
} from 'react-native';

import styles from './styles';

export default class MyButton extends Component {
    props: {
        text: string,
        onPress: () => void,
    };

    render() {
        const formattedText = this.props.text.toUpperCase();
        return (
            <TouchableNativeFeedback onPress={this.props.onPress}>
                <View style={[styles.buttonStyle, this.props.style]}>
                    <Text style={[styles.buttonTextStyle, this.props.textStyle]}>{formattedText}</Text>
                </View>
            </TouchableNativeFeedback>
        );
    }
}