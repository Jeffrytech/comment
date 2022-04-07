import React from 'react';
import './Backdrop.css';

const backdrop = (props) => (
    props.show? <div className='backdrop2' onClick={props.backdropClicked}></div>: null
)

export default backdrop;