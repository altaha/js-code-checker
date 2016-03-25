require('codemirror/mode/javascript/javascript')

import React from 'react'

import checkRules from './CheckRulesLib'


class RulesChecker extends React.Component {
    static propTypes = {
        estree: React.PropTypes.object
    }

    static defaultProps = {
        estree: null
    }

    state = {
        result: false,
        rulesString: ''
    }

    render() {
        const style = {width: 400, height: 300}
        return (
            <div>
                <textarea
                    className='rules-input-textarea'
                    ref='rulesInput'
                    style={style}
                />
                <button
                    onClick={this.updateRulesString}
                >
                    Set Rules
                </button>
                <p>
                    {`Result: ${this.state.result.toString()}`}
                </p>
            </div>
       )
    }

    updateRulesString = () => {
        const rulesString = this.refs.rulesInput.value
        const estree = this.props.estree
        const result = estree ? checkRules(estree, rulesString) : false
        this.setState({result, rulesString})
    }
}

export default RulesChecker
