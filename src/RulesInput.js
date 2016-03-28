import React from 'react'

import {getRulesObject} from './CheckRulesLib'


const defaultRules = {
    relation: 'and',
    rules: [
        {ForStatement:
            {IfStatement: true}
        },
        {FunctionDeclaration: false}
    ]
}

class RulesInput extends React.Component {
    static propTypes = {
        onUpdateRules: React.PropTypes.func.isRequired
    }

    state = {
        rulesString: JSON.stringify(defaultRules, null, 4)
    }

    componentDidMount() {
        this.updateRulesString()
    }

    render() {
        return (
            <div className='rules-input'>
                <h3>
                    Write JS challenge rules as JSON
                </h3>
                <textarea
                    className='rules-input-textarea'
                    defaultValue={this.state.rulesString}
                    ref='rulesInput'
                />
                <button
                    className='rules-input-button'
                    onClick={this.updateRulesString}
                >
                    Update Rules
                </button>
            </div>
       )
    }

    updateRulesString = () => {
        const rulesString = this.refs.rulesInput.value
        this.setState({rulesString})
        const rulesObject = getRulesObject(rulesString)
        this.props.onUpdateRules(rulesObject)
    }
}

export default RulesInput
