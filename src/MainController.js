require('codemirror/mode/javascript/javascript')

import Codemirror from 'react-codemirror'
import Esprima from 'esprima'
import React from 'react'

import RulesChecker from './RulesChecker'


class MainController extends React.Component {
    state = {
        code: '',
        estree: null
    }

    render() {
        const options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'javascript',
            theme: 'monokai'
        }

        const estree = this.state.estree
        const estreeValue = estree === null ?
            '' : JSON.stringify(estree, null, 4)

        return (
            <div>
                <div className='codemirror-container' >
                    <Codemirror
                        onChange={this.updateCode}
                        options={options}
                        ref='codemirror'
                        value={this.state.code}
                    />
                </div>
                <p> Type code above and see parsed output below </p>
                <textarea
                    className='estree-display-textarea'
                    disable={true}
                    value={estreeValue}
                    ref='result'
                />
                <RulesChecker estree={estree} />
            </div>
        )
    }

    updateCode = (code) => {
        let estree
        try {
            estree = Esprima.parse(code)
        }
        catch (err) {
            estree = ['Error parsing JS code', err]
        }
        finally {
            this.setState({
                code,
                estree
            })
        }
    }
}

export default MainController
