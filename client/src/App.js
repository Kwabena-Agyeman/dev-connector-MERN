/** @format */

import { useEffect } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./redux/Auth/AuthActions";

// Redux
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Alert from "./components/layout/Alert";

import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </>
      </Router>
    </Provider>
  );
};

export default App;
