import React from 'react'


class EstreeDisplay extends React.Component {
    static propTypes = {
        estree: React.PropTypes.object.isRequired
    }

    state = {
        showEstree: false
    }

    render() {
        let estreeTextarea = null
        if (this.state.showEstree) {
            const estree = this.props.estree
            const estreeValue = JSON.stringify(estree, null, 4)
            estreeTextarea = (
                <textarea
                    className='estree-display-textarea'
                    readOnly={true}
                    value={estreeValue}
                />
            )
        }

        return (
            <div className='estree-display'>
                <input
                    type='checkbox'
                    checked={this.state.showEstree}
                    onChange={this.toggleEstreeDisplay}
                />
                <span>Show parsed JS code AST</span>
                {estreeTextarea}
            </div>
       )
    }

    toggleEstreeDisplay = () => {
        const showEstree = !this.state.showEstree
        this.setState({showEstree})
    }
}

export default EstreeDisplay
