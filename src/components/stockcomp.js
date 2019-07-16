import React, { Component } from 'react';
import { connect } from 'react-redux';
import { VictoryChart,VictoryZoomContainer,VictoryBrushContainer,VictoryAxis,VictoryLine } from 'victory';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import '../style/comp.css';

const metadata = "Meta Data";
const symbol = "2. Symbol";
const weeklyTimeSeries = "Weekly Time Series";

class Comp extends Component {
  constructor(props) {
    super(props);
    this.state = {
     currentStockParameter: "4. close"
    };
  }
 handleZoom(domain) {
   this.setState({selectedDomain: domain});
 }
 handleBrush(domain) {
   this.setState({zoomDomain: domain});
 }

   render() {
    const {id} = this.props.match.params;
     let stockName=id;
     const {stocksArr} = this.props;
     const parameter = this.state.currentStockParameter;
     let dataSeriesArr=[];
     let stock = null;
     const stockIndex = stocksArr.findIndex(st=>st[metadata][symbol] === stockName);  
     if (stockIndex !== -1) {
       stock = stocksArr[stockIndex]
     }
     const dates = Object.keys(stock[weeklyTimeSeries]);
     dates.forEach((date)=>{
       const parameterValue = stock[weeklyTimeSeries][date][parameter];
      let datum=new Date (date)
       const newChartEntry = {
         x:  datum ,
         y: parseInt(parameterValue) 
       }
       dataSeriesArr.push(newChartEntry);
     });
     return (
      <div className="big" >
       <div >
       <h1 className="pageTitel" >Symbol: {stockName}</h1>
         <div className="bigSingleGraph" >
         <VictoryChart width={850} height={550} scale={{x: "time"}}
           containerComponent={
             <VictoryZoomContainer responsive={false}
               zoomDimension="x"
               zoomDomain={this.state.zoomDomain}
               onZoomDomainChange={this.handleZoom.bind(this)}
             />
           }
         >
           <VictoryLine
             style={{data: {stroke: "#132040"}}}
             data={dataSeriesArr} />
         </VictoryChart>

         <VictoryChart

           padding={{top: 0, left: 50, right: 50, bottom: 30}}
           width={800} height={150} scale={{x: "time"}}
           containerComponent={
             <VictoryBrushContainer responsive={false}
               brushDimension="x"
               brushDomain={this.state.selectedDomain}
               onBrushDomainChange={this.handleBrush.bind(this)}
             />}>

             <VictoryAxis
             tickValues={[
               new Date(2000, 1, 1),
               new Date(2005, 1, 1),
               new Date(2010, 1, 1),
               new Date(2015, 1, 1),
               new Date(2020, 1, 1)
             ]}
             tickFormat={(x) => new Date(x).getFullYear()}
           />
           <VictoryLine
             style={{
               data: {stroke: "#132040"}
             }}
             data={dataSeriesArr}
           />
         </VictoryChart>
     </div>
       </div>
       <RadioGroup className="singleStockButtons" row onChange={(e)=>{
        this.setState({
          currentStockParameter: e.target.value
        });
  
      }}>
      <FormControlLabel control={<Radio color="primary" />} value="3. low" name="parameter"/><p className ="parameterP">Low</p> 
      <FormControlLabel  control={<Radio color="primary" />} value="2. high" name="parameter"/><p className ="parameterP" >High</p> 
      <FormControlLabel  control={<Radio color="primary" />} value="1. open" name="parameter"/><p className ="parameterP" >Open</p>
      <FormControlLabel  control={<Radio color="primary" />} value="4. close" name="parameter"/><p className ="parameterP" >Close</p>
      <FormControlLabel  control={<Radio color="primary" />} value="5. volume" name="parameter"/><p className ="parameterP" >Volume</p>
  
     </RadioGroup>
     </div>
     )
   }
 }

  const mapStateToProps = state => {
    return {
      stocksArr: state.stocks
    }
  }
  export const CompContainer = connect(mapStateToProps,null)(Comp)