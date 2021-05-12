import React from 'react';
import ReactDOM from 'react-dom';
import M from 'materialize-css';

setTimeout(() => M.AutoInit(), 100)

export default function Instruction(props) {
    return (
        <div class="card divPriceRight z-depth-3">
            <div class="card-content">
                <p>Here are the instructions for properly using MatejSwap.</p>
            </div>
            <div class="card-tabs">
                <ul class="tabs tabs-fixed-width">
                    <li class="tab"><a class="active" href="#test4">Step #1</a></li>
                    <li class="tab"><a href="#test5">Step #2</a></li>
                    <li class="tab"><a href="#test6">Step #3</a></li>
                </ul>
            </div>
            <div class="card-content grey lighten-4">
                <div id="test4">Make sure you have MetaMask installed. If you don't, clicking on the 'Connect Wallet' button will take you to the MetaMask website.</div>
                <div id="test5">When you do, go to <a href="https://faucet.ropsten.be/" target="_blank">this link</a> to get some ropsten ethereum. Paste your address from MetaMask (make sure you're on the Ropsten network) and get some ethereum.</div>
                <div id="test6">From here it's really simple. You can buy, sell or provide liquidity to the pool. <br /> <b>#NOTE</b> Providing liquidity will get you LP tokens which make you eligable for claiming liquidity from the Pool contract.</div>
            </div>
        </div>
    )
}
