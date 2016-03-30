import React from 'react'
import 'operative'

import CodeInput from './CodeInput'
import EstreeDisplay from './EstreeDisplay'
import ResultsDisplay from './ResultsDisplay'
import RulesInput from './RulesInput'


class MainController extends React.Component {
    constructor() {
        super()

        this.state = {
            estree: {},
            rules: {}
        }
        this.isParsingCode = false
        this.codePending = false
        this.worker = null
    }

    render() {
        return (
            <div className='main-container'>
                <CodeInput
                    onCodeChange={this.updateCode}
                />
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

    updateRules = (rules) => {
        this.setState({rules})
    }

    updateCode = (code) => {
        if (this.isParsingCode) {
            this.codePending = code
            return
        }
        this.isParsingCode = true
        this.codePending = false

        this.worker = operative({
            parseCode
        }, [
            'esprima.js'
        ])
        this.worker.parseCode(code, this.onParseCompletion)
    }

    onParseCompletion = (estree) => {
        this.isParsingCode = false
        this.setState({
            estree
        })
        if (this.worker) {
            this.worker.terminate()
            this.worker = null
        }
        if (this.codePending) {
            this.updateCode(this.codePending)
        }
    }
}


function parseCode(code, doneCallback) {
    let estree = {error: 'Whatever'}
    try {
        estree = esprima.parse(code)
    }
    catch (err) {
        const error = `Invalid JS Code: ${err.description} at line ${err.lineNumber}`
        estree = {error}
    }
    finally {
        doneCallback(estree)
    }
}

export default MainController
