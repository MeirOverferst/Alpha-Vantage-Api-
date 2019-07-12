import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import {MainContainer} from './components/main';
import img5 from './logos/200px-Vue.js_Logo_2.svg.png';
import { NavLink } from 'react-router-dom';
import {CompContainer} from './components/stockcomp';
function App() {
    return (
      <BrowserRouter>
       <div className="App">
        <NavLink to="/">
        <h1 className="mainHead"> 5 Top Companies That Have Trusted <img  className="vueLogo"src={img5}/></h1>
        </NavLink>
          <Route path="/" exact component={MainContainer}/>
          <Route path='/stock/:id' component={CompContainer} />
          </div>
      </BrowserRouter>
    );
 
}

export default App;

