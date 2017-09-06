import React, {Component} from 'react';
import {
    Button
} from 'react-native';

export class DrawerButton extends Component {
    props: {
        navigation: Object
    }

    openDrawer() {
        this.props.navigation.navigate('DrawerOpen');
    }

    render() {
        return (
            <Button onClick={() => this.openDrawer()}>
                Drawer
            </Button>
        )
    }
}