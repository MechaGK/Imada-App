import React, {Component} from 'react';
import {Image, Text, View, ListView, StyleSheet} from 'react-native';

import Button from 'react-native-button';

const itemConfig = {
    label: 'One mark',
    price: 5,
};

export default class ActivityList extends Component {
    props: {
        itemList: Array<number>,
        style: ?StyleSheet,
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

    _renderMenuItem(itemId: number) {
        const undoable = Date.now() - itemId < 10000;
        return (
            <View style={styles.item}>
                <Text style={{ fontFamily: 'monospace' }}>{this.formatDate(new Date(itemId))} - {itemConfig.price}kr</Text>
                <Button
                    title={undoable ? 'Undo' : ''}
                    onPress={() => {
                        const itemList = this.props.itemList;
                        const index = itemList.indexOf(itemId);
                        itemList.splice(index, 1);
                        const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
                        this.setState({
                            dataSource: dataSource.cloneWithRows(itemList),
                        });
                    }}>
                    {undoable ? 'Undo' : ''}
                </Button>
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
