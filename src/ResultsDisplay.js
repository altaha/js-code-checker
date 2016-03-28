import React from 'react'

import checkRules from './CheckRulesLib'


class ResultsDisplay extends React.Component {
    static propTypes = {
        estree: React.PropTypes.object.isRequired,
        rules: React.PropTypes.object.isRequired
    }

    render() {
        let result = ''
        let passed = false

        const estree = this.props.estree
        const rules = this.props.rules
        if (estree.hasOwnProperty('error')) {
            result = estree.error
        } else if (rules.hasOwnProperty('error')) {
            result = rules.error
        } else {
            const checkResult = checkRules(estree, rules)
            if (checkResult.hasOwnProperty('error')) {
                result = checkResult.error
            } else {
                passed = checkResult
            }
        }

        const passString = passed ? 'Passed' : 'Failed'
        const className = 'results-display ' + passString.toLowerCase()
        const detailString = result === '' ? null : (
            <h4>
               <span>{result}</span>
            </h4>
        )

        return (
            <div className={className}>
                <h3>
                    <span>{passString}</span>
                </h3>
                {detailString}
            </div>
       )
    }
}

export default ResultsDisplay
