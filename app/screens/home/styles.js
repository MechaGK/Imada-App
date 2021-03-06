import React, {StyleSheet, Platform} from 'react-native';
import colors from '../../config/colors';

export default StyleSheet.create({
    backgroundImageStyle: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'space-between',
    },
    buttonTextStyle: {
        textAlign: 'center',
        color: '#FFFFFF',
        padding: 8,
        fontWeight: '500',
    },
    innerContainer: {
        flex: 1,
        alignItems: 'stretch',
        padding: 8,
        opacity: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 10,
    },
    saldoText: {
        color: colors.primaryText,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingVertical: 16,
        fontSize: 18,
        elevation: 4,
        backgroundColor: '#ffffff',
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        margin: 8,
        elevation: 1
    },
    item: {
        padding: 16,
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    hintText: {
        textAlign: 'center',
    },
    drawerButton: {
        padding: (Platform.OS === 'android') ? 12 : 8,
    }
});