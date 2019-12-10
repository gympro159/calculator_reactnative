const React = require('react-native');
const { StyleSheet } = React;

export default {

    container: {
        flex:1,
    },

    txtDefault: {
        color: '#000',
        fontFamily: 'Helvetica-Light',
        fontSize: 20
    },

    txtDefault2: {
        color: '#ff630b',
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Light',
        fontSize: 20
    },

    txtDefault3: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Light',
        fontSize: 20
    },

    contRow: {
        flex: 1,
        flexDirection: 'row'
    },

    contButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#ecf0f1'
    },

    contButton2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#ecf0f1',
        backgroundColor: '#ff630b',
        borderRadius: 100
    },

    contButton3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#ecf0f1',
        backgroundColor: '#5f0cff',
        //borderRadius: 100
    }
};