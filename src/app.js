import React from 'react'
import ReactDOM from 'react-dom'

import MainController from './MainController'


export class App extends React.Component {
    render() {
        return (
            <div>
                <div>
                    Simple React + Babel + Webpack
                </div>
                <MainController />
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.querySelector("#myApp"))
