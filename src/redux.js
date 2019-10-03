import {createStore,applyMiddleware} from 'redux';
  import thunk from 'redux-thunk';
  import axios from "axios";
  import {composeWithDevTools} from 'redux-devtools-extension';
  import _ from 'lodash';
  let key="FYIKAC4JIOX2S1M5";
  let fiveStocks=["NYT","NTDOY","NFLX","FB"];
  const initialState = {
    pending: false,
    stocks: [ ],
    error: null
  }
  const reducer = (state = initialState, action) => {
    let updatedState = _.cloneDeep(state);
    switch (action.type) {
      case "FETCH_PENDING":
        updatedState.pending = state.pending = true;
        return updatedState;
        case "FETCH_SUCCESS":
        updatedState.pending = state.pending = false;
        if(updatedState.stocks.length<4){
          updatedState.stocks.push(action.payload);
        }
        console.log("updatedState.stocks",updatedState.stocks);
        return updatedState;
        case "FETCH_ERROR":
        updatedState.pending = state.pending = false;
        updatedState.error = state.error = action.error;        
        return updatedState;
      default:
        return state;
    }
  }
  export function fetchingPending() {
    return {
      type: "FETCH_PENDING"
    }
  }
  export function fetchingFiveStocks() {
    return (dispatch) => {
      dispatch(fetchingPending());
      for (let i = 0; i<fiveStocks.length; i++){            
        axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol='+fiveStocks[i]+'&apikey='+{key})
        .then((response) => {
          dispatch({
            type: "FETCH_SUCCESS",
            payload: response.data
          });
        })
        .catch((err) => {
          
          dispatch({
            type: "FETCH_ERROR",
            payload: err,
        
          })
        
        })
      }
    }
  }

  export const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

