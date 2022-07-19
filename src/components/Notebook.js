import React from 'react';
import { nanoid } from 'nanoid'

class Notebook extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.object.id,
            title: this.props.object.title === null ? '' : this.props.object.title,
            notes: this.props.object.notes,
            inputting: this.props.object.title === null ? true : false,
            showControls: false
        }
        this.textInput = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.startInputting = this.startInputting.bind(this);
        this.stopInputting = this.stopInputting.bind(this);
        this.showControls = this.showControls.bind(this);
        this.handleKey = this.handleKey.bind(this);
    }

    handleChange(e) {
        this.setState((prevState) => ({
            ...prevState,
            title: e.target.value
        }));
    }
    
    startInputting() {
        this.setState((prevState) => ({...prevState, inputting: true}), () => {
            this.textInput.current.focus();
        });
    }
    
    stopInputting() {
        this.setState((prevState) => ({
            ...prevState,
            inputting: false
        }), () => {
            this.props.updateNotebook(this.state);
        });
    }

    showControls(e) {
        switch(e.type) {
            case 'mouseenter':
                this.setState((prevState) => ({...prevState, showControls: true}));
            break;
            case 'mouseleave':
                this.setState((prevState) => ({...prevState, showControls: false}));
            break;
            default:;
        }
    }


    handleKey(e) {
        if(e.code === "Enter") {
            this.textInput.current.blur();
        }
    }

    render() {

        return (
            <div 
                className={this.props.isSelected ? 'notebook-div-selected' : 'notebook-div'}
                onMouseEnter={this.showControls}
                onMouseLeave={this.showControls}
                onClick={this.props.openNotebook}
                data-object={JSON.stringify(this.state)}
            >
                <input
                    type='text'
                    value={this.state.title}
                    className={this.state.inputting ? 'notebook-input' : 'hidden'}
                    onChange={this.handleChange}
                    ref={this.textInput}
                    autoFocus
                    onBlur={this.stopInputting}
                    data-object={JSON.stringify(this.state)}
                    onKeyDown={this.handleKey}
                />

                <button 
                    className={this.state.showControls && !this.state.inputting ? 'notebook-controls' : 'hidden'}
                    onClick={this.props.deleteNotebook}
                    data-object={JSON.stringify(this.state)}
                >
                    🗑
                </button>

                <p
                    className={this.state.inputting ? 'hidden' : 'notebook-title'}
                    data-object={JSON.stringify(this.state)}>
                    {this.state.title}
                </p>

                <button 
                    className={this.state.showControls && !this.state.inputting ? 'notebook-controls' : 'hidden'}
                    onClick={this.startInputting}
                    data-object={JSON.stringify(this.state)}
                >
                    🖉
                </button>


            </div>
        ) 
    }
}

export default Notebook;