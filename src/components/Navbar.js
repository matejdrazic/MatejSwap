import React from 'react';
import ReactDOM from 'react-dom';
import M from 'materialize-css';
import Identicon from 'identicon.js';

class NavBar extends React.Component {

    constructor(props) {
        super(props);

        this.handleSwapClick = this.handleSwapClick.bind(this);
        this.handlePoolClick = this.handlePoolClick.bind(this);

        this.state = ({
            pool: "",
            swap: "active",
            detectedAccount: false
        })

        const navbar = document.querySelector('.swapnpool');
        var instance = M.Sidenav.init(navbar, {});

    }

    handleSwapClick(e) {
        e.preventDefault();
        this.props.swiping(true)
        this.setState({
            pool: "",
            swap: this.props.active,
        })
    }

    handlePoolClick(e) {
        e.preventDefault();
        this.props.swiping(false)
        this.setState({
            pool: this.props.active,
            swap: ""
        })
    }

    render() {

        let options = {
            foreground: [0, 0, 0, 255],
            background: [255, 255, 255, 255],         // rgba white
            margin: 0.1,                              // 20% margin
            size: 40,                                // 420px square
            format: 'svg'                             // use SVG instead of PNG
        };

        return (
            <div>
                <nav>
                    <div class="nav-wrapper pink lighten-3">
                        <a href="#" class="brand-logo center">MatejSwap</a>
                        <ul id="nav-mobile" class="left hide-on-med-and-down swapnpool">
                            <li onClick={this.handleSwapClick} class={this.state.swap}><a href="">Swap</a></li>
                            <li onClick={this.handlePoolClick} class={this.state.pool}><a href="">Pool</a></li>
                        </ul>
                        <ul class="right hide-on-med-and-down">
                            {this.props.detectedAccount ? (<div>
                                <li>
                                    <a>{this.props.network}</a></li>
                                <li margin="10px">
                                    <a>{ethereum.selectedAddress.substring(0, 6)} ... {ethereum.selectedAddress.substring(ethereum.selectedAddress.length - 4)}</a>
                                </li>
                                <li>
                                    <img width="100%" height="100%" src={`data:image/svg+xml;base64,${new Identicon(ethereum.selectedAddress, options).toString()}`} />
                                </li>
                            </div>) : <li onClick={this.props.handleConnect}><a class="waves-effect waves-light btn">Connect Wallet <i class="material-icons right">account_balance_wallet</i></a></li>}
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default NavBar;