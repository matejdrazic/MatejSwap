import React from 'react';
import ReactDOM from 'react-dom';

export default function Icon(props) {
    return (
        <div class="row center-align">
            <i class="material-icons">{props.arrow}</i>
        </div>
    );
}
