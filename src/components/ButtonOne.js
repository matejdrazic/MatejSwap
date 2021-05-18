import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
let web3 = new Web3(Web3.givenProvider);

export default function ButtonOne(props) {
    return (
        <div onClick={(event) => {
            event.preventDefault()
            let amount = web3.utils.toWei(props.amount, 'ether')
            props.address ? props.onClick(amount) : null
        }} class="row center-align marpad">
            <a class="waves-effect waves-light btn-large col s12">{props.text}</a>
        </div>
    );
}
