import React from 'react';
import ReactDOM from 'react-dom';

export default function ButtonTwo(props) {
        return (
            <div onClick={(event) => {
                event.preventDefault()
                let amountETH = web3.utils.toWei(props.amountETH, 'ether')
                let amountFESB = web3.utils.toWei(props.amountFESB, 'ether')
                props.onClick(amountETH, amountFESB) 
                }} 
                class="row center-align marpad">
                <a class="waves-effect waves-light btn-large col s12">{props.text}</a>
            </div>
        );
    }
