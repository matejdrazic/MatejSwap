import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
let web3 = new Web3(Web3.givenProvider);

export default function PriceAndInfoSideDiv(props) {
        return (
            <div class="divPrice z-depth-5">
                Price: <br />
                {props.eth/props.fesb} ETH/FESB <br />
                {props.fesb/props.eth} FESB/ETH <br /><br />

                Pool info:<br />
                {web3.utils.fromWei(props.fesb, 'ether')} FESB <br />
                {web3.utils.fromWei(props.eth, 'ether')} ETH <br /><br />
                Price may vary because of slippage
            </div>
        );
    }
