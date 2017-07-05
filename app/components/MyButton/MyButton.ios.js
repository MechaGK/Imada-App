import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableHighlight,
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
            <View style={{flex: 1,}}>
                <TouchableHighlight style={[styles.buttonStyle, this.props.style]} onPress={this.props.onPress}>
                    <Text style={[styles.buttonTextStyle, this.props.textStyle]}>{formattedText}</Text>
                </TouchableHighlight>
            </View>
        );
    }
}