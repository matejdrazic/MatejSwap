import React from 'react';
import ReactDOM from 'react-dom';

export default function ButtonOne(props) {
        return (
            <div onClick={(event) => {window.ethereum ? props.onClick(props.amount) : null}} class="row center-align marpad">
                <a class="waves-effect waves-light btn-large col s12">{props.text}</a>
            </div>
        );
    }
