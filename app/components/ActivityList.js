import React, {Component} from 'react';
import {Image, Text, View, ListView, StyleSheet} from 'react-native';

import Button from 'react-native-button';

const itemConfig = {
    label: 'One mark',
    price: 5,
};

export type ListItem = { date: Date, type: 'soda' | 'beer', amount: number }
export class ActivityList extends Component {
    props: {
        itemList: Array<ListItem>,
    };

    static defaultProps: {
        style: StyleSheet,
    };

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.state = {
            dataSource: dataSource.cloneWithRows(props.itemList),
            navigate: props.navigate,
            selectedItem: 'HomeNavigator',
        };

        this._renderMenuItem = this._renderMenuItem.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.setState({
            dataSource: dataSource.cloneWithRows(nextProps.itemList),
        });
    }

    pad(number: number, padding: string): string {
        return String(padding + number).slice(-padding.length);
    }

    formatDate(date: Date): string {
        const hours = this.pad(date.getHours(), '00');
        const minutes = this.pad(date.getMinutes(), '00');
        const seconds = this.pad(date.getSeconds(), '00');

        return `${hours}:${minutes}:${seconds}`;
    }

    _renderMenuItem(item: ListItem) {
        return (
            <View style={styles.item}>
                <Text style={{ fontFamily: 'monospace' }}>{this.formatDate(item.date)} - {item.amount}kr</Text>
            </View>
        );
    }

    render() {
        return (
            <ListView
                style={[styles.container, this.props.style]}
                dataSource={this.state.dataSource}
                renderRow={this._renderMenuItem}
                scrollEnabled={false}
                enableEmptySections={true}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 8,
        elevation: 1
    },
    item: {
        padding: 16,
        margin: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        elevation: 2,
        alignItems: 'center',
    }
});
