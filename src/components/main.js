import React, { Component } from 'react';
import'../style/main.scss'
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {fetchingFiveStocks} from '../redux';
import {Line as LineChart} from 'react-chartjs';
import Radio from '@material-ui/core/Radio';
import Switch from '@material-ui/core/Switch';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import '../style/main.css';

const metadata = "Meta Data";
const symbol = "2. Symbol"
const weeklyTimeSeries = "Weekly Time Series";
const options = {
 maintainAspectRatio: false ,
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 2,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
}
const styles = {
  root: {
  color: 'blue',
  },
  graphContainer: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    height:'500px',
  }
}
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
     currentStockParameter: "4. close",
     presentedStocks: ['NYT', 'NTDOY', 'NFLX', 'FB']
    };
  }
  componentDidMount(stocksArr) {
    if(!stocksArr){
      this.props.makeRequest();
    }
  }
  getChartData() {
    const {stocksArr} = this.props;
    const stock = stocksArr.find(st=>st[metadata][symbol] === "NYT");
      let nytStockDates = [ ];
      if (stock) {
        nytStockDates = Object.keys(stock[weeklyTimeSeries]);
        for( let i = 0; i < nytStockDates.length; i++){ 
          if ( i% 2 ===0) {
            nytStockDates.splice(i, 40); 
          }
       }
      }
      let plottedStocks = [ ];
      stocksArr.forEach(stp=>{
        if (this.state.presentedStocks.includes(stp[metadata][symbol])) {
          plottedStocks.push(this.getStockDataSet(stp[metadata][symbol]));
        }
      });
    return {
      labels: nytStockDates,
      datasets: plottedStocks   
    } 
  }
  getStockPlotSeries(stockSymbol) {
  const parameter = this.state.currentStockParameter;
  const {stocksArr} = this.props;
  const index = stocksArr.findIndex(st=>st[metadata][symbol] === stockSymbol);
  let stockToPlot;
  let stockPlotSeries =[ ]; 
  let parameterValue =[ ];
    if (index !== -1) {
      stockToPlot = stocksArr[index];
      let seriesKeys = Object.keys(stockToPlot[weeklyTimeSeries]); 
      seriesKeys.forEach((key)=>{        
        parameterValue.push(stockToPlot[weeklyTimeSeries][key][parameter]);
      })
      for( let i = 0; i < parameterValue.length; i++){ 
        if ( i % 2 ===0) {  
          parameterValue.splice(i, 40); 
        }
        stockPlotSeries=parameterValue;
     }   
 } 
    return stockPlotSeries;
  }



  getStockDataSet(stockSymbol) {   
    switch (stockSymbol) {
      case "NTDOY":
        return ( {
          label: 'nintendo',
          fillColor: 'rgba(255, 179, 179,0.2)',
          strokeColor: '#ff0000',
          pointColor: 'rgba(255, 179, 179,0.75)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: '#ffb3b3',
          data: this.getStockPlotSeries(stockSymbol),
        }) 
      case "NYT":
        return ({
          label: 'nyt',
          fillColor: ' rgba(204, 204, 255,0.2)',
          strokeColor: '#3333ff',
          pointColor: ' rgba(204, 204, 255,0.75)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: this.getStockPlotSeries(stockSymbol),
        }) 
      case "FB": 
      return ({
        label: 'facebook',
        fillColor: 'rgba(204, 230, 255,0.2)',
        strokeColor: ' #0066cc',
        pointColor: 'rgba(204, 230, 255,0.75)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: this.getStockPlotSeries(stockSymbol),
      })
      case "NFLX": 
      return ({
        label: 'netflix',
        fillColor: ' rgba(255, 255, 179,0.2)',
        strokeColor: ' #ffff00',
        pointColor: 'rgba(255, 255, 179,0.75)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: this.getStockPlotSeries(stockSymbol),
      })
  
  default:
    break;
    }
  }

  toggleCheckboxState(checkBoxName) {
    let presented = this.state.presentedStocks;
    if (presented.includes(checkBoxName)){
        presented = presented.filter(st=>st !== checkBoxName);
    } else {
      presented.push(checkBoxName);
    }
    this.setState({
      presentedStocks: presented
    })
  }
  
    render() {   
      return (
        <div className="mainDiv">
      <div className="graphDiv" > 
           <div style={styles.graphContainer}>
          <LineChart data={this.getChartData()}
          height={350}
          width={850}
            options={options}
          redraw />
        </div>
        </div>
           <RadioGroup  className="singleStockButtons" row onChange={(e)=>{
            this.setState({
              currentStockParameter: e.target.value
            });

          }}>
          <FormControlLabel  control={<Radio color="primary" />} value="3. low" name="parameter"/><p className ="parameterP">Low</p> 
          <FormControlLabel  control={<Radio color="primary" />} value="2. high" name="parameter"/><p className ="parameterP" >High</p> 
          <FormControlLabel  control={<Radio color="primary" />} value="1. open" name="parameter"/><p className ="parameterP" >Open</p>
          <FormControlLabel  control={<Radio color="primary" />} value="4. close" name="parameter"/><p className ="parameterP" >Close</p>
          <FormControlLabel  control={<Radio color="primary" />} value="5. volume" name="parameter"/><p className ="parameterP" >Volume</p>
         </RadioGroup>
          <div className="stocksToChooseBox" onChange={(e)=>{this.toggleCheckboxState(e.target.value)}}>  
          <div className="switchDiv  ">
          <Switch style={styles.root} type="checkbox" value="NTDOY" checked={this.state.presentedStocks.includes("NTDOY")}/>
          <p className="stockSymbol">Symbol: NTDOY</p>
          <NavLink className="navLinkMain " to={`stock/NTDOY`} >
          nintendo
          </NavLink>
          </div>
          <div className="switchDiv">
          <Switch style={styles.root} type="checkbox" value="NFLX" checked={this.state.presentedStocks.includes("NFLX")}/>
          <p className="stockSymbol">Symbol: NFLX</p>
          <NavLink  className="navLinkMain" to={`stock/NFLX`}>netflix
          </NavLink>
          </div>
          <div className="switchDiv"> 
          <Switch style={styles.root} type="checkbox" value="FB" checked={this.state.presentedStocks.includes("FB")}/>
          <p className="stockSymbol">Symbol: FB</p>
          <NavLink  className="navLinkMain"  to={`stock/FB`}>
          facebook
          </NavLink>
          </div>
          <div className="switchDiv" >
          <Switch style={styles.root} type="checkbox" value="NYT" checked={this.state.presentedStocks.includes("NYT")}/>
          <p className="stockSymbol">Symbol: NYT</p>
          <NavLink   className="navLinkMain"  to={`stock/NYT`}>
           New York Times
          </NavLink>
          </div>
          </div>
          </div>
      )
    }
  }
  const mapDispatchToProps = dispatch => {
    return {
      makeRequest: ()=>dispatch(fetchingFiveStocks())
    }
  }
  const mapStateToProps = state => {
    return {
      stocksArr: state.stocks
    }
  }
  export const MainContainer = connect(mapStateToProps,mapDispatchToProps)(Main)

