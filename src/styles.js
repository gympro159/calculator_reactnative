const React = require('react-native');
const { StyleSheet } = React;

export default {

    container: {
        flex:1,
        flexDirection: 'column'
    },

    contHistory:{
        flex: 0.35,
        borderBottomWidth: 1,
        borderColor: '#000',
    },

    contOutput:{
        flex: 0.25,
    },

    contButtons:{
        flex: 0.4,
        backgroundColor: '#f1f8fc'
    },

    placeHolderOutput: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 15,
        paddingLeft: 15
    },

    txtMini: {
        color: '#727272',
        fontFamily: 'Helvetica-Light',
        fontSize: 12,
        backgroundColor: 'white'
    },

    txtDefault: {
        color: '#000',
        fontFamily: 'Helvetica-Light',
        fontSize: 30
    },

    txtDefault2: {
        color: 'red',
        fontFamily: 'Helvetica-Light',
        fontSize: 40
    },

    txtDefault3: {
        color: 'red',
        fontFamily: 'Helvetica-Light',
        fontSize: 30
    }

};