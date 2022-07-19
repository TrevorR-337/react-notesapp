import React from 'react'

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.object.id,
            title: this.props.object.title,
            body: this.props.object.body,
            dateCreated: this.props.object.dateCreated,
            dateModified: this.props.object.dateModified,
            dateMY: this.props.object.dateMY,
            dateDay: this.props.object.dateDay,
            notebook: this.props.object.notebook
        }
    }

    render() {

        return (
            <div onClick={this.props.openNote} data-object={JSON.stringify(this.props.object)} className='note-div'>
                <div className='note-date-div'>
                    <p className='note-date-my'>{this.props.object.dateMY}</p>
                    <p className='note-date-day'>{this.props.object.dateDay}</p>
                </div>
                <div className='note-preview-wrapper'>
                    <div className='note-preview-div'>
                        <p className='note-preview-title'>{this.props.object.title}</p>
                        <p className='note-preview-body'>{this.props.object.body}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Note;