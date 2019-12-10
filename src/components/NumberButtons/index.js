//React Modules
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableNativeFeedback
} from 'react-native';

//Styles
import styles from './styles';

export default class NumberButtons extends Component {
    constructor(props){
        super(props);
    };

    //This is for optimization
    //Component should render only once
    shouldComponentUpdate(nextProps, nextState){
        return false;
    }

    //This will call the bound function from its parent component
    //to handle button press action/event
    _handleOnPress = (value) => {
        requestAnimationFrame(() => {
            this.props.onBtnPress(value);
        });
    };

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.buttons.map((row, index) => (
                        <View key={index} style={styles.contRow}>
                            {
                                row.map((col,index) => (
                                    <TouchableNativeFeedback
                                        key={index}
                                        onPress={() => this._handleOnPress(col)}
                                        background={TouchableNativeFeedback.SelectableBackground()}>
                                        <View style={(col==='=')?styles.contButton2:((col==='฿')?styles.contButton3:styles.contButton)}>
                                            <Text
                                                style={(col==='='||col==='฿')? styles.txtDefault3:((col==='AC'||col==='C')?(styles.txtDefault2 ):styles.txtDefault)}>{col}</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                ))
                            }
                        </View>
                    ))
                }
            </View>
        );
    }
}