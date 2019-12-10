//React Modules
import React, { Component } from 'react';
import axios from 'axios'
import {View,Text,ToastAndroid, ScrollView, Image} from 'react-native';
import $ from 'jquery';


//Styles
import styles from './styles';

//Custom Components
import NumberButtons from './components/NumberButtons';
import HistoryView from './components/HistoryView'

//constants
const buttons = [
    ['√x','%', 'sin','cos', 'tan'],
    ['xʸ','AC', 'C','(', ')'],
    ['|x|','7', '8', '9', '÷'],
    ['e','4', '5', '6', 'x'],
    ['п','1', '2', '3', '+'],
    ['฿','.', '0', '=','-']
];

const buttons2 = [
    ['USD','7', '8', '9'],
    ['JPY','4', '5', '6'],
    ['VND','1', '2', '3'],
    ['฿','.', '0', 'AC']
];

const initialOutput = '0';
const maxLength = 57;
const date= new Date();

//Serves as the Container Class
export default class App extends Component {
    //Initialization
    constructor(props){
        super(props);
        this.state = {
            _output: initialOutput,
            _resultAuto : initialOutput,
            _mathExpression: '',
            _history: [],
            listMoney: [],
            _numBtn: 0,
            _isMoney: false,
            _isFetched: false,
            _rateUSD: 0,
            _rateJPY: 0,
            _isVND: true,
            _isUSD: false,
            _isJPY: false,
            _VND: initialOutput,
            _USD: initialOutput,
            _JPY: initialOutput
        };
        this._handleEvent = this._handleEvent.bind(this);
        this._clearHistory = this._clearHistory.bind(this);
    }

    componentDidMount() {
        axios.get('http://www.dongabank.com.vn/exchange/export')
            .then(res =>{
                const str = res.data.slice(10,res.data.length-2);
                const listMoney = JSON.parse(str);
                this.setState({
                    listMoney,
                    _isFetched: true
                });
                //this._showToast(this.state._isFetched.toString());
                if(this.state._isFetched){
                    //console.log(this.state.listMoney);
                    for(let i=0; i<this.state.listMoney.length;i++){
                        let lm = this.state.listMoney[i];
                        if(lm.type==="USD"){
                            let _rateUSD = lm.muatienmat;
                            this.setState({
                                _rateUSD
                            })
                        }
                        if(lm.type==='JPY') {
                            let _rateJPY = lm.muatienmat;
                            this.setState({
                                _rateJPY
                            })
                        }
                    }
                }

            });
    }

    //Handles actions on button press
    _handleEvent = (value) => {
        this.setState({
            _numBtn: this.state._numBtn +1
        });
        //console.log(this.state._numBtn);
        if(value === '฿') {
            this.setState( (prevState) => ({
                _isMoney: !prevState._isMoney,
                _output: initialOutput,
                _resultAuto: initialOutput
            }));
        }
        else if(value === 'USD') {
            this.setState({
                _isUSD: true,
                _isVND: false,
                _isJPY: false
            })
        }
        else if(value === 'JPY') {
            this.setState({
                _isUSD: false,
                _isVND: false,
                _isJPY: true
            })
        }
        else if(value === 'VND') {
            this.setState({
                _isUSD: false,
                _isVND: true,
                _isJPY: false
            })
        }
        else if(!isNaN(value) || value=== '(' || value === ')'
            || value === 'e' || value === 'п' || value ==='%'){
            this._moneyOutput(value);
            this._concatToOutput(value);
            this._evaluateResult();
        }
        else{
            switch(value) {

                case 'AC':
                    this._initOutput();
                    this.setState({
                        _numBtn: initialOutput
                    });
                    break;

                case 'C':
                    this.setState({
                        _numBtn: (this.state._numBtn===1)? initialOutput:this.state._numBtn-1
                    });
                    if (this.state._output.length === 1){
                        this._initOutput();
                    }
                    else {
                        //this._showToast(this.state._output.slice(-2));
                        if(this.state._output.slice(-2)==='s('||this.state._output.slice(-2)==='n(')
                        {
                            if (this.state._output.length === 4){
                                this._initOutput();
                            }
                            else {
                                this._replaceLastIndex('');
                                this._replaceLastIndex('');
                                this._replaceLastIndex('');
                                this._replaceLastIndex('');
                            }
                        }
                        else if(this.state._output.slice(-2)==='√(')
                        {
                            if (this.state._output.length === 2){
                                this._initOutput();
                            }
                            else {
                                this._replaceLastIndex('');
                                this._replaceLastIndex('');
                            }
                        }
                        else if(this.state._output.slice(-3)==='NaN')
                        {
                            this._initOutput();
                        }
                        else if(this.state._output.slice(-8)==='Infinity')
                        {
                            this._initOutput();
                        }
                        else this._replaceLastIndex('');
                    }
                    this._evaluateResult();
                    break;

                case buttons[5][3]:
                    this._evaluate();
                    this.setState({
                        _numBtn: this.state._numBtn +1
                    });
                    break;

                case buttons[2][4]: case buttons[3][4]: case buttons[4][4]: case buttons[5][4]: case buttons[5][1]: case buttons[1][0]:
                    let strLastChar = this.state._output.slice(-1);
                    //this._showToast(strLastChar.toString());
                    if(this.state._isMoney) this._moneyOutput(value);
                    if(strLastChar==='+'||strLastChar==='-'||strLastChar==='x'||strLastChar==='÷'||strLastChar==='^'||strLastChar==='.'){
                        this._replaceLastIndex(value);
                    }
                    else{
                        this._concatToOutput(value);
                    }
                    break;

                default:
                    this._concatToOutput(value);
                    break;
            }
        }
    };

    //Function to concat user input to output screen
    _concatToOutput = (value) => {
        if(this.state._output.length>=maxLength){
            this._showToast('Maximum Expression Length of ' + maxLength + ' is reached.');
        }
        else{
            let value2 = value;
            if(value==='sin') value2= 'sin(';
            if(value==='cos') value2= 'cos(';
            if(value==='tan') value2= 'tan(';
            if(value==='√x') value2= '√(';
            if(value==='xʸ') value2= '^';
            if(value==='|x|') value2= 'abs(';
            if (this.state._output === initialOutput && value2!=='.') {
                this.setState({_output: value2 + ''})
            } else {
                this.setState({_output: this.state._output + '' + value2 + ''})
            }
        }
    };

    _moneyOutput = (value) => {
        if(this.state._isMoney){
            if(this.state._isVND){
                this.setState({
                    _VND: (this.state._VND === initialOutput && value!=='.') ? value + '' : this.state._VND + '' + value + '',
                });
                this.setState({
                    _USD: this.state._VND/this.state._rateUSD,
                    _JPY: this.state._VND/this.state._rateJPY
                });
            }
            else if(this.state._isUSD){
                this.setState({
                    _USD: (this.state._USD === initialOutput && value!=='.') ? value + '' : this.state._USD + '' + value + '',
                });
                this.setState({
                    _VND: this.state._USD*this.state._rateUSD,
                    _JPY: this.state._USD*this.state._rateUSD/this.state._rateJPY
                })
            }
            else if(this.state._isJPY){
                this.setState({
                    _JPY: (this.state._JPY === initialOutput && value!=='.') ? value + '' : this.state._JPY + '' + value + '',
                });
                this.setState({
                    _VND: this.state._JPY*this.state._rateJPY,
                    _USD: this.state._JPY*this.state._rateJPY/this.state._rateUSD
                })
            }
        }
    };

    //Function to replace the last index of the output
    _replaceLastIndex = (value) => {
        if(value==='xʸ') value= '^';
        var str1 = this.state._output.replace(/.$/,value);
        this.setState({
            _output: str1
        })
    };

    _evaluateResult = () => {
        try{
            let strCurOutput = this.state._output;
            //console.log(strCurOutput);
            if(isNaN(strCurOutput)){
                let dEval = eval(this._convertToMathExpression(this.state._output));
                if(dEval!==eval(1/0)){
                    this.setState({
                        _resultAuto: '' + dEval,
                    })
                }
                else{
                    this.setState({
                        _resultAuto: '' + strCurOutput,
                    })
                }
            }
            else{
                this.setState({
                    _resultAuto: '' + strCurOutput,
                })
            }
        }
        catch(exception){
            /* console.log('exception: ' + exception); */
        }
    };

    //Validate and Calculate the output state as a Mathematical expression
    _evaluate = () => {
        try{
            let strCurOutput = this.state._output;
            if(isNaN(strCurOutput)){
                let dEval = eval(this._convertToMathExpression(this.state._output));

                let aHistory = [...this.state._history];
                aHistory.push([strCurOutput, dEval]);

                if(dEval===eval(1/0)){
                    this._showToast('MATH ERROR');
                }
                else {
                    this.setState({
                        _output: '' + dEval,
                        _history: aHistory,
                        _resultAuto: '' + dEval,
                    })
                }
            }
        }
        catch(exception){
            /* console.log('exception: ' + exception); */
            //console.log(this.state._output);
            this._showToast('MATH ERROR');
        }
    };

    //Function to convert the output state into a valid mathematical expression
    _convertToMathExpression = (value) => {
        let strTemp = value.replace(new RegExp(this._escapeRegExp(buttons[2][4]), 'g'), '/');
        strTemp = strTemp.replace(new RegExp(this._escapeRegExp(buttons[3][4]), 'g'), '*');
        strTemp = strTemp.replace(new RegExp(this._escapeRegExp(buttons[0][1]), 'g'), '/100');
        strTemp = strTemp.replace(new RegExp(this._escapeRegExp(buttons[0][2]), 'g'), 'Math.sin');
        strTemp = strTemp.replace(new RegExp(this._escapeRegExp(buttons[0][3]), 'g'), 'Math.cos');
        strTemp = strTemp.replace(new RegExp(this._escapeRegExp(buttons[0][4]), 'g'), 'Math.tan');
        strTemp = strTemp.replace(new RegExp(this._escapeRegExp(buttons[0][0]), 'g'), 'Math.sqrt(');
        strTemp = strTemp.replace(new RegExp(this._escapeRegExp(buttons[2][0]), 'g'), 'Math.abs');
        strTemp = strTemp.replace(new RegExp(this._escapeRegExp(buttons[3][0]), 'g'), 'Math.E');
        strTemp = strTemp.replace(new RegExp(this._escapeRegExp(buttons[4][0]), 'g'), 'Math.PI');

        //strTemp = strTemp.replace('sin(', 'Math.sin(');
        //strTemp = strTemp.replace('cos(', 'Math.cos(');
        //strTemp = strTemp.replace('tan(', 'Math.tan(');
        for(let i =0; i<this.state._numBtn; i++) {
            strTemp = strTemp.replace('√(', 'Math.sqrt(');
            strTemp = strTemp.replace('abs(', 'Math.abs(');
            strTemp = strTemp.replace("PI(", "PI*(");
            strTemp = strTemp.replace("PIMath", "PI*Math");
            strTemp = strTemp.replace(")Ma", ")*Ma");
        }
        //Tính lũy thừa
        for(let i=1; i< strTemp.length; i++){
            let numTemp = 0, dem=0, j;
            if(strTemp[i] === '^') {
                for (j = i - 1; j >= 0; j--) {
                    if (isNaN(strTemp[j])) {
                        //this._showToast(j.toString());
                        break;
                    }
                    numTemp += strTemp[j] * Math.pow(10, dem);
                    dem++;
                    //this._showToast(j.toString());
                }
                j++;
                //this._showToast(j.toString());
                strTemp = strTemp.slice(j);
                //this._showToast(strTemp);
                strTemp = strTemp.replace(numTemp + "^", 'Math.pow(' + numTemp + ',');
                //this._showToast(j.toString());
                //this._showToast(numTemp.toString());
            }
        }

        //Thêm dấu * ở sau ()
        for(let i=0; i<=9; i++) {
            strTemp = strTemp.replace(i+"(", function (x) {
                return x.replace("(", "*(");
            });
            strTemp = strTemp.replace(")"+i, function (x) {
                return x.replace(")", ")*");
            });
            strTemp = strTemp.replace(i+"M", function (x) {
                return x.replace("M", "*M");
            });
            strTemp = strTemp.replace("PI"+i, function (x) {
                return x.replace("PI", "PI*");
            });
        }

        //Bổ sung dấu ( or ) nếu thiếu
        let l = strTemp.split("(").length, r =strTemp.split(")").length;
        if(l===1&&r===2) strTemp = "(" + strTemp;
        if(l > r){
            for(let i=0; i< l-r ; i++){
                strTemp = strTemp + ")";
            }
        }
        else if (l<r){
            for(let i=0; i< r-l ; i++){
                strTemp = "(" + strTemp;
            }
        }

        //this._showToast(strTemp);
        console.log(strTemp);
        return strTemp;
    };

    _escapeRegExp = (str) => {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };

    //Function to initialize output state
    _initOutput = () => {
        this.setState({
            _output: initialOutput,
            _resultAuto : initialOutput,
            _VND: initialOutput,
            _USD: initialOutput,
            _JPY: initialOutput
        })
    };

    //Function to clear the history
    _clearHistory = () => {
        console.log('inside _clearHistory function');
        const emptyArray = [];
        this.setState({
            _history: emptyArray
        })
    };

    //Function to display an android toast
    _showToast = (value) => {
        ToastAndroid.show(value, ToastAndroid.SHORT);
    };

    render() {
        if (!this.state._isMoney) {
            return (
                <View style={styles.container}>
                    <View style={styles.contHistory}>
                        <HistoryView data={this.state._history} onClear={this._clearHistory}/>
                    </View>
                    <View style={styles.contOutput}>
                        <View style={styles.placeHolderOutput}>
                            <Text style={styles.txtDefault}>{this.state._output}</Text>
                            <Text style={styles.txtDefault2}>{this.state._resultAuto}</Text>
                        </View>
                    </View>
                    <View style={styles.contButtons}>
                        <NumberButtons onBtnPress={this._handleEvent} buttons={buttons}/>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.contOutput}>
                        <View style={styles.placeHolderOutput}>
                            <Image source={require('./usd.png')} style={{width: 46, height: 33}}/>
                            <Text style={(this.state._isUSD)?styles.txtDefault3:styles.txtDefault}>{this.state._USD} $</Text>
                        </View>
                    </View>
                    <View style={styles.contOutput}>
                        <View style={styles.placeHolderOutput}>
                            <Image source={require('./jpy.png')} style={{width: 46, height: 33, borderWidth:0.5, borderColor: '#000'}}/>
                            <Text style={(this.state._isJPY)?styles.txtDefault3:styles.txtDefault}>{this.state._JPY} ¥</Text>
                        </View>
                    </View>
                    <View style={styles.contOutput}>
                        <View style={styles.placeHolderOutput}>
                            <Image source={require('./vnd.png')} style={{width: 46, height: 33}}/>
                            <Text style={(this.state._isVND)?styles.txtDefault3:styles.txtDefault}>{this.state._VND} Đ</Text>
                        </View>
                    </View>
                    <Text style={styles.txtMini}> *Tỷ giá được cung cấp bởi Đông Á Bank tháng {date.getMonth()+1}/{date.getFullYear()}</Text>
                    <View style={styles.contButtons}>
                        <NumberButtons onBtnPress={this._handleEvent} buttons={buttons2}/>
                    </View>
                </View>
            );
        }
    }
}