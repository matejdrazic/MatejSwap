import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
let web3 = new Web3(Web3.givenProvider);

export default function InputField(props) {
    return (
        <div class="row">
            <div class="col s12 font">{props.text}</div>
            <div class="col s10">
                <form>
                    <div class="input-field">
                        <input value={props.value} onChange={props.input} placeholder="0.0" disabled={props.disabled} type="number" min="0" step=".01" class="validate" />
                        <span class="helper-text" data-error="wrong">Balance ETH: {web3.utils.fromWei(props.balances.eth_balance, 'ether')} </span>                        </div>
                </form>
            </div>

            <div class="col s2"><img src="eth.png" class="fill" alt="Italian Trulli" /> </div>
        </div>
    );

}