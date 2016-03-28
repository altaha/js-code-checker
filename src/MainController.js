require('codemirror/mode/javascript/javascript')

import Codemirror from 'react-codemirror'
import Esprima from 'esprima'
import React from 'react'

import EstreeDisplay from './EstreeDisplay'
import ResultsDisplay from './ResultsDisplay'
import RulesInput from './RulesInput'


class MainController extends React.Component {
    state = {
        code: '',
        estree: {},
        rules: {}
    }

    componentWillMount() {
        this.updateCode(this.state.code)
    }

    render() {
        const options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'javascript'
        }

        return (
            <div className='main-container'>
                <div className='codemirror-container' >
                    <h3>
                        Write JS Code
                    </h3>
                    <div className='codemirror-editor' >
                        <Codemirror
                            onChange={this.updateCode}
                            options={options}
                            ref='codemirror'
                            value={this.state.code}
                        />
                    </div>
                </div>
                <RulesInput
                    onUpdateRules={this.updateRules}
                />
                <ResultsDisplay
                    estree={this.state.estree}
                    rules={this.state.rules}
                />
                <EstreeDisplay
                    estree={this.state.estree}
                />
            </div>
        )
    }

    updateCode = (code) => {
        let estree
        try {
            estree = Esprima.parse(code)
        }
        catch (err) {
            const error = `Invalid JS Code: ${err.description} at line ${err.lineNumber}`
            estree = {error}
        }
        finally {
            this.setState({
                code,
                estree
            })
        }
    }

    updateRules = (rules) => {
        this.setState({rules})
    }
}

export default MainController
