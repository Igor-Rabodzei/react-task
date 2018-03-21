import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import {Icon} from 'react-fa'
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import Websocket from 'react-websocket';

var LineChart = require("react-chartjs").Line;

console.log(LineChart);

const moment = extendMoment(Moment);

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

const headerStyle = {
  marginTop: '20px',
  textAlign: 'center'
};

const currencyItem = {
  textAlign: 'center',  
  marginTop: '10px',
}
  
const currencyName = {
}

const buttonBlock = {
  marginTop: '20px'
}

const calcTitle = {
  textAlign: 'center',
  marginBottom: '20px'
}

const exchangeIcon = {
  textAlign: 'center'
}

const panel = {
  marginTop: '60px',
  paddingBottom: '20px',
  backgroundColor: '#f5f5f5',
  border: '1px solid #e3e3e3',
  textAlign: "center"
}

const exchangeButton = {
  outline: 'none',
  margin: 10
}

const chartsContainer = {
  boxSizing: "border-box",
  padding: "10px",
  width: "100%",
  height: "400px",
  backgroundColor: "#fff",
  textAlign: "center"
}


const options={
  legend: {
     display: false
  },
  tooltips: {
     enabled: false
  }
}

const rand = (min, max) => {
  return Math.random() * (max - min) + min;
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currency: [],
      value: 'select',
      currentCurency: 'usd',
      exchangeArray: [],
      calc: {
        amount: 0,
        crypto: 'bitcoin',
        currency: 'USD',
        value: 0
      },
      data : {
        labels: ["January", "February", "March", "April", "May", "June", "July", "April", "May", "June", "July"],
        datasets: [
          {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90, 19, 86, 27, 90]
          }
        ]
      },
      realTimedata : {
        labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        datasets: [
          {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          }
        ]
      }
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    const self = this;
    axios.get(`https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=6`)
    .then(res => {
      const currency = res.data.map(obj => obj);
      self.setState({ currency });
    });
  }

  change (event){
    const currency = event.target.value;
    let url = 'https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=6';
    switch (currency) {
      case 'usd':
        url = 'https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=6';
        break;
      case 'eur':
        url = 'https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=6';
        break;
      case 'rub':
        url = 'https://api.coinmarketcap.com/v1/ticker/?convert=RUB&limit=6';
        break;  
      default:
        url = 'https://api.coinmarketcap.com/v1/ticker/?convert=RUB&limit=6';
        break;    
    }

    const self = this;
    self.setState({ currentCurency:  currency});
    axios.get(url)
    .then(res => {
      const currency = res.data.map(obj => obj);
      self.setState({ currency });
    });
  }

  changeCrypto (event){
    const self = this;
    let calc = Object.assign({}, this.state.calc);
    calc.crypto = event.target.value;
    this.setState({calc});
  }

  changeCurrency (event){
    const self = this;
    let calc = Object.assign({}, this.state.calc);
    calc.currency = event.target.value;
    this.setState({calc});
  }

  handleClick (crypto, currency){
    axios.get(`https://api.coinmarketcap.com/v1/ticker/${this.state.calc.crypto}/?convert=${this.state.calc.currency}`)
    .then(res => {
      const rate = res.data[0][`price_${(this.state.calc.currency).toLocaleLowerCase()}`];
      if(this.state.calc.amount > 0) {
        const value = this.state.calc.amount * rate;
        let calc = Object.assign({}, this.state.calc);
        calc.value = value.toFixed(2);
        this.setState({calc});
      }
    });
  } 

  handleChange(event) {
    let calc = Object.assign({}, this.state.calc);
    calc.amount = event.target.value;
    this.setState({calc});
  }

  periodChange(event) {
    const period = event.target.value;

    let interval = '';
    let rangeValue = '';
    let format = '';
    const count = -1;
    let labelFormat = '';

    let labels = [];
    let values = [];

    switch(period) {
      case 'year':
        interval = 'year';
        rangeValue = 'month';
        format = 'YYYY-MM-DD';
        labelFormat = 'YYYY-MM';
        break;
      case 'month':
        interval = 'month';
        rangeValue = 'days';
        format = 'YYYY-MM-DD';
        labelFormat = 'MM-DD';
        break;
      case 'day':
        interval = 'day';
        rangeValue = 'hours';
        format = 'YYYY-MM-DDTHH:MM:SSZ';
        labelFormat = 'HH:MM';
        break;      
    }

    const range = moment.rangeFromInterval(interval, count);
    for (let month of range.by(rangeValue)) {
      let timestamp = new Date(month).getTime();
      timestamp = parseInt(timestamp/1000);
      values.push(parseInt(rand(1000, 340000)));
      labels.push(month.format(labelFormat));
      let dataCharts = Object.assign({}, this.state.data);
      dataCharts.datasets[0].data = values;
      dataCharts.labels = labels;
      this.setState({data: dataCharts});
    }
  }

  handleData(data) {
    data = JSON.parse(data);
    if(data.events) {
      let dataCharts = Object.assign({}, this.state.realTimedata);
      let currentArr = dataCharts.datasets[0].data;
      let el = currentArr.shift();
      currentArr.push(parseInt(data.events[0].price));      
      this.setState({realTimedata: dataCharts});
    }
    
  }

  render() {
    return (
      <div className="container">
        <Websocket url='wss://api.gemini.com/v1/marketdata/btcusd' onMessage={this.handleData.bind(this)} timeout={10000} />
        <div className="row" style={headerStyle}> 
          <div className="col-md-6 col-md-offset-3">
            <select className="form-control" onChange={this.change.bind(this)}>
              <option disabled>Value: </option>
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="rub">RUB</option>
            </select>
          </div>
        </div>
        {
          this.state && this.state.currency && 
          <div className="row"> 
              {this.state.currency.map((item,i) => 
                <div style={currencyItem} key={i} className="col-md-2">
                  <span style={currencyName}>{item.name} : </span>
                  <span>{item[`price_${this.state.currentCurency}`]}</span>
                </div>
              )}
          </div>
        }

        <div className="row">
        
          <div className="col-md-8 col-md-offset-2">

            <div className="panel panel-default" style={panel}>
              <div className="panel-body">
              <h1 style={calcTitle}>Change</h1>
              <div className="row">
                <div className="col-md-5">
                    <input type="number" className="form-control" autoComplete="false" id="amount" placeholder="Enter Amount to Convert" value={this.state.calc.amount} onChange={this.handleChange}/>
                </div>
              </div>

              <div className="row" style={buttonBlock}>
                <div className="col-md-5">
                  <select className="form-control" onChange={this.changeCrypto.bind(this)}>
                  {this.state.currency.map((item,i) => 
                    <option key={i} value={item.id}>{item.name}</option>
                  )}
                  </select>
                </div>
                <div className="col-md-2" style={exchangeIcon}>
                    <button type="button" className="btn btn-success" style={exchangeButton} onClick={this.handleClick.bind(this)}>Convert</button>
                </div>
                <div className="col-md-5">
                  <select className="form-control" onChange={this.changeCurrency.bind(this)}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                  </select>
                </div>
              </div>


              <div className="row" style={buttonBlock}>
                <div className="col-md-5" style={exchangeIcon}>
                  <b> {this.state.calc.value} {this.state.calc.currency} </b>
                </div>
              </div>


              </div>
            </div>  
             
          </div>
        </div>

        <div className="row"> 
          <div className="col-md-10 col-md-offset-1">
            <select className="form-control" onChange={this.periodChange.bind(this)}>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
            </select>
          </div>
        </div>

        <div className="row" style={chartsContainer}>
        <h1> Bitcoin dynamic </h1>
          <LineChart data={this.state.data} width={1800} height={300}/>
        </div>

        <div className="row" style={chartsContainer}>
          <h1> Websocket data </h1>
          <LineChart data={this.state.realTimedata} width={1800} height={250} options={options}/>
          <br/>
        </div>
      </div>
    );
  }

}

export default App;
