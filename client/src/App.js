import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./Components/Layout/Navbar";
import Landing from "./Components/Layout/Landing";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Alert from "./Components/Layout/Alert";
import "./App.css";

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <>
                    <Navbar />
                    <Route exact path='/' component={Landing} />
                    <section className='container'>
                        <Alert />
                        <Switch>
                            <Route
                                exact
                                path='/register'
                                component={Register}
                            />
                            <Route exact path='/login' component={Login} />
                        </Switch>
                    </section>
                </>
            </Router>
        </Provider>
    );
};

export default App;
