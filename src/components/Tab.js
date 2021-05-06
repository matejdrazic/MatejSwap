import React from 'react';
import ReactDOM from 'react-dom';

export default function Tab(props) {
    return (
        <li onClick={props.onClick} class="tab col s6"><a href={props.hrefni} >{props.name}</a></li>
    );
}