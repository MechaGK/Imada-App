import React from 'react-native';

export default function (scene) {
    const componentMap = {
        "HomeNavigator": {
            title: 'HomeNavigator',
            id: 'HomeNavigator'
        },
        'Settings': {
            title: 'Settings',
            id: 'Settings'
        },
    };

    return componentMap[scene];
};
