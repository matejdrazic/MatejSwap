import React from 'react';
import ReactDOM from 'react-dom';

export default function ButtonThree(props) {
        return (
            <div onClick={(event) => {props.address ? props.onClick(props.amountLPTokens) : null}} class="row center-align marpad">
                <a class="waves-effect waves-light btn-large col s12">{props.text}</a>
            </div>
        );
    }
