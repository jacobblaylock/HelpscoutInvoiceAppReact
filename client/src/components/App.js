import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Header from './Header'
import Main from './Main'

const Landing = () => <h2>Welcome</h2>

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Header />
                    <Route exact path='/' component={Landing} />
                    <Route exact path='/main' component={Main} />
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App