require('codemirror/mode/javascript/javascript')

import Codemirror from 'react-codemirror'
import React from 'react'


class CodeInput extends React.Component {
    static propTypes = {
        onCodeChange: React.PropTypes.func
    }

    state = {
        code: ''
    }

    componentDidMount() {
        this.updateCode(this.state.code)
    }

    render() {
        const options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'javascript'
        }

        return (
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
        )
    }

    updateCode = (code) => {
        this.setState({code})
        if (this.props.onCodeChange) {
            this.props.onCodeChange(code)
        }
    }
}

export default CodeInput
