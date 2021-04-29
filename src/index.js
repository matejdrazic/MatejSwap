import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import M, { updateTextFields } from 'materialize-css';
import './index.css';
import FesbToken from './build/FesbToken.json';
import MatejSwap from './build/MatejSwap.json';
import MatejSwapLP from './build/MatejSwapLP.json'
import Identicon from 'identicon.js';
import DialogBox from './components/AlertDialog'
import AlertDialog from './components/AlertDialog';
import PriceAndInfoSideDiv from './components/PriceAndInfoSideDiv';
import Icon from './components/Icon';
import ButtonOne from './components/ButtonOne';
import ButtonTwo from './components/ButtonTwo';
import ButtonThree from './components/ButtonThree';
import InputFieldLP from './components/InputFieldLP';

let web3 = new Web3(Web3.givenProvider);

class InputField extends React.Component {
    render() {
        return (
            <div class="row">
                <div class="col s12 font">{this.props.text}</div>
                <div class="col s10">
                    <form>
                        <div class="input-field">
                            <input value={this.props.value} onChange={this.props.input} placeholder="0.0" disabled={this.props.disabled} type="number" min="0" step=".01" class="validate" />
                            <span class="helper-text" data-error="wrong">Balance ETH: {web3.utils.fromWei(this.props.balances.eth_balance, 'ether')} </span>                        </div>
                    </form>
                </div>

                <div class="col s2"><img src="eth.png" class="fill" alt="Italian Trulli" /> </div>
            </div>
        );
    }
}

class InputFieldTwo extends React.Component {
    render() {
        return (
            <div class="row">
                <div class="col s12 font">{this.props.text}</div>
                <div class="col s10">
                    <form>
                        <div class="input-field">
                            <input value={this.props.value} onChange={this.props.input} disabled={this.props.disabled} placeholder="0.0" type="number" min="0" step=".01" class="validate" />
                            <span class="helper-text" data-error="wrong">Balance Fesb: {web3.utils.fromWei(this.props.balances.fesb_balance, 'ether')}</span>                        </div>
                    </form>
                </div>

                <div class="col s2"><img src="fesb.jpg" class="fill" alt="Italian Trulli" /> </div>
            </div>
        );
    }
}

class Tab extends React.Component {
    render() {
        return (
            <li onClick={this.props.onClick} class="tab col s6"><a href={this.props.hrefni} >{this.props.name}</a></li>
        );
    }
}

class Container extends React.Component {
    render() {
        if (this.props.swapping === true)
            return <SwapContainer price={this.props.price} balances={this.props.balances} buy={this.props.buy} sell={this.props.sell} />
        else
            return <PoolContainer price={this.props.price} balances={this.props.balances} provideLiq={this.props.provideLiq} removeLiq={this.props.removeLiq} />
    }
}

class PoolContainer extends React.Component {

    constructor(props) {
        super(props)
        this.state = ({
            provideOrRemove: true,
            arrow: 'compare_arrows',
            text: 'Provide Liquidity',
            inputFieldText: 'Amount of ETH to provide to the Liq Pool',
            inputFieldTeoText: 'Amount of FESB to provide to the Liq Pool'
        })
        this.handleProvideClick = this.handleProvideClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);

        this.eth_change = this.eth_change.bind(this);
        this.fesb_change = this.fesb_change.bind(this);
        this.lp_change = this.lp_change.bind(this);

    }

    handleProvideClick() {
        this.setState({
            provideOrRemove: true,
            inputFieldText: 'Amount of ETH to provide to the Liq Pool',
            text: 'Provide Liquidity'
        })
    }

    handleRemoveClick() {
        this.setState({
            provideOrRemove: false,
            inputFieldText: 'Amount of Matej Swap LP tokens you wish to burn',
            text: 'Remove Liquidity'
        })
    }

    eth_change(e) {
        this.setState({
            eth: e.target.value,
            fesb: e.target.value * this.props.price
        })
    }

    fesb_change(e) {
        this.setState({
            eth: e.target.value/this.props.price,
            fesb: e.target.value,
        })
    }

    lp_change(e) {
        this.setState({
            lp: e.target.value
        })
    }

    render() {

        let provideForm = (<div class="marpad">
            <InputField value={this.state.eth} text={this.state.inputFieldText} balances={this.props.balances} input={this.eth_change} />
            <Icon arrow={this.state.arrow} />
            <InputFieldTwo value={this.state.fesb} text={this.state.inputFieldTeoText} balances={this.props.balances} input={this.fesb_change} />
            <ButtonTwo text={this.state.text}
                onClick={this.props.provideLiq} amountETH={this.state.eth ? this.state.eth.toString() : '0'} amountFESB={this.state.fesb ? this.state.fesb.toString() : '0'}
            />
        </div>)

        let removeForm = <div class="marpad">
            <InputFieldLP text={this.state.inputFieldText} balances={this.props.balances} input={this.lp_change} provideOrRemove={true} />
            <ButtonThree text={this.state.text}
                onClick={this.props.removeLiq} amountLPTokens={web3.utils.toWei(this.state.lp ? this.state.lp.toString() : '0', 'ether')} 
            />
        </div>

        return (
            <div class="div z-depth-5">
                <div class="col s12">
                    <ul class="tabs">
                        <Tab name="Provide" onClick={this.handleProvideClick} hrefni='#provide' />
                        <Tab name="Remove" onClick={this.handleRemoveClick} hrefni='#remove' />
                    </ul>
                    <div class="hr" />
                </div>
                {this.state.provideOrRemove ? provideForm : removeForm}
            </div>
        );
    }
}

class SwapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            buyOrSell: true,

            arrow: 'arrow_downward',
            disabledETH: '',
            disabledFESB: 'disabled',
            textDisplayETH: 'This is where you enter your ETH amount: ',
            textDisplayFESB: 'This is how much FESB coins you get: '
        });

        this.handleBuyClick = this.handleBuyClick.bind(this);
        this.handleSellClick = this.handleSellClick.bind(this);
        this.eth_change = this.eth_change.bind(this);
        this.fesb_change = this.fesb_change.bind(this)

        const tabs = document.querySelector('.tabs');
        var instance = M.Tabs.init(tabs, {});
    }

    handleBuyClick() {
        this.setState({
            buyOrSell: true,
            arrow: 'arrow_downward',
            disabledETH: '',
            disabledFESB: 'disabled',
            textDisplayETH: 'This is where you enter your ETH amount: ',
            textDisplayFESB: 'This is how much FESB coins you get: '
        })
    }

    handleSellClick() {
        this.setState({
            buyOrSell: false,
            arrow: 'arrow_upward',
            disabledETH: 'disabled',
            disabledFESB: '',
            textDisplayETH: 'This is how much ETH you get: ',
            textDisplayFESB: 'This is where you enter your FESB amount: '
        })
    }

    //neće se računat prema fiksnom tečaju nego onom koji dobijamo kao prop iz pagea
    eth_change(e) {
        this.setState({
            eth: e.target.value,
            fesb: e.target.value * this.props.price,
        })
    }

    fesb_change(e) {
        this.setState({
            eth: e.target.value / this.props.price,
            fesb: e.target.value,
        })
    }

    render() {

        return (
            <div class="div z-depth-5">
                <div class="col s12">
                    <ul class="tabs">
                        <Tab name="Buy" onClick={this.handleBuyClick} hrefni='#buy' />
                        <Tab name="Sell" onClick={this.handleSellClick} hrefni='#sell' />
                    </ul>
                    <div class="hr" />
                </div>
                <div class="marpad">
                    <InputField disabled={this.state.disabledETH} text={this.state.textDisplayETH} balances={this.props.balances}
                        input={this.eth_change} value={this.state.eth} buyOrSell={this.state.buyOrSell} />
                    <Icon arrow={this.state.arrow} />
                    <InputFieldTwo disabled={this.state.disabledFESB} text={this.state.textDisplayFESB} balances={this.props.balances}
                        input={this.fesb_change} value={this.state.fesb} buyOrSell={this.state.buyOrSell} />
                    <ButtonOne text={this.state.buyOrSell ? 'Buy' : 'Sell'}
                        onClick={this.state.buyOrSell ? this.props.buy : this.props.sell} amount={this.state.buyOrSell ? web3.utils.toWei(this.state.eth ? this.state.eth.toString() : '0', 'ether') : web3.utils.toWei(this.state.fesb ? this.state.fesb.toString() : '0', 'ether')} />
                </div>
            </div>
        );
    }
}

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

class Page extends React.Component {

    constructor(props) {
        super(props)
        this.state = ({
            detectedAccount: null,
            network: null,
            swappingOrPool: true,
            alertDialog: window.ethereum ? true : false,
            fesb_token: {},
            balances: {
                eth_balance: '',
                fesb_balance: '',
                lp_balance: ''
            },
            ethBalanceInPool: '0',
            fesbBalanceInPool: '0'
        })

        this.handleClick = this.handleClick.bind(this)
        this.handleConnect = this.handleConnect.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.setAlertDialog = this.setAlertDialog.bind(this);
        this.loadWalletInfo = this.loadWalletInfo.bind(this);

        this.gettingSwapInfo = this.gettingSwapInfo.bind(this);
        this.getBlockchain = this.getBlockchain.bind(this);
        this.getContracts = this.getContracts.bind(this);

    }

    async getContracts() {
        let networkID = await web3.eth.net.getId()
        let FesbNetwork = FesbToken.networks[networkID]
        let MatejSwapNetwork = MatejSwap.networks[networkID]
        let MatejLPNetwork = MatejSwapLP.networks[networkID]
        if (FesbNetwork) {
            let fesb_token = new web3.eth.Contract(FesbToken.abi, FesbNetwork.address)
            let matejswap = new web3.eth.Contract(MatejSwap.abi, MatejSwapNetwork.address)
            let matejswapLP = new web3.eth.Contract(MatejSwapLP.abi, MatejLPNetwork.address)

            this.setState({
                fesb_token,
                matejswap,
                matejswapLP
            })
            this.gettingSwapInfo()
        }
    }

    async getBlockchain() {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const chainId = await ethereum.request({ method: 'eth_chainId' });

        let chainName = null;
        if (chainId === '0x1')
            chainName = 'Mainnet'
        else if (chainId === '0x3')
            chainName = 'Ropsten'
        else if (chainId === '0x4')
            chainName = 'Rinkeby'
        else if (chainId === '0x2a')
            chainName = 'Kovan'
        else console.log('None detected')
        this.setState({
            network: chainName,
            detectedAccount: accounts ? accounts[0] : false
        })
    }

    async handleConnect() {

        if (window.ethereum) {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const chainId = await ethereum.request({ method: 'eth_chainId' });

            let chainName = null;
            if (chainId === '0x1')
                chainName = 'Mainnet'
            else if (chainId === '0x3')
                chainName = 'Ropsten'
            else if (chainId === '0x4')
                chainName = 'Rinkeby'
            else if (chainId === '0x2a')
                chainName = 'Kovan'
            else console.log('None detected')
            this.setState({
                network: chainName,
                detectedAccount: accounts ? accounts[0] : false
            })
            this.loadWalletInfo()
        } else {
            window.open('https://metamask.io', '_blank');
        }

    }

    async handleChange() {

        if (window.ethereum) {
            await this.getBlockchain()
            await this.loadWalletInfo()
        } else {
        }
    }

    async componentDidMount() {

        if (this.state.alertDialog) {

            await this.getContracts()

            ethereum.on('accountsChanged', this.handleChange);
            ethereum.on('chainChanged', this.handleChange);

            setTimeout(async () => {

                await this.getBlockchain();
                await this.loadWalletInfo();

            }, 1000);
        } else {

        }
    }

    setAlertDialog() {
        this.setState({
            alertDialog: true
        })
    }

    async loadWalletInfo() {

        if (this.state.detectedAccount) {
            let eth_balance = await web3.eth.getBalance(this.state.detectedAccount)
            let fesb_balance = await this.state.fesb_token.methods.balanceOf(this.state.detectedAccount).call()
            let lp_balance = await this.state.matejswap.methods.balanceOf(this.state.detectedAccount).call()

            if (eth_balance && fesb_balance) {
                this.setState({
                    balances: {
                        eth_balance: eth_balance.toString(),
                        fesb_balance: fesb_balance.toString(),
                        lp_balance: lp_balance.toString()
                    }
                })
            }

        }

    }

    async gettingSwapInfo() {
        
        let ethBalanceInPool = await web3.eth.getBalance(this.state.matejswap._address)
        let fesbBalanceInPool = await this.state.fesb_token.methods.balanceOf(this.state.matejswap._address).call()
        let eth = web3.utils.fromWei(ethBalanceInPool, 'ether')
        let fesb = web3.utils.fromWei(fesbBalanceInPool, 'ether')
        let price=fesb/eth

        this.setState({
            ethBalanceInPool: ethBalanceInPool.toString(),
            fesbBalanceInPool: fesbBalanceInPool.toString(),
            price
        })

    }

    buyFesbTokens = async (ethAmount) => {
        await this.state.matejswap.methods.buyFesbTokens().send({ from: this.state.detectedAccount, value: ethAmount })
        this.loadWalletInfo()
        this.gettingSwapInfo()
    }

    sellFesbTokens = async (fesbAmount) => {
        await this.state.fesb_token.methods.approve(this.state.matejswap._address, fesbAmount).send({ from: this.state.detectedAccount })
        await this.state.matejswap.methods.sellFesbTokens(fesbAmount, this.state.detectedAccount).send({ from: this.state.detectedAccount })
        this.loadWalletInfo()
        this.gettingSwapInfo()
    }

    provideLiquidity = async (ethAmount, fesbAmount) => {
        await this.state.fesb_token.methods.approve(this.state.matejswap._address, fesbAmount).send({ from: this.state.detectedAccount })
        await this.state.matejswap.methods.provideLiquidity(fesbAmount).send({ from: this.state.detectedAccount, value: ethAmount })
        this.loadWalletInfo()
        this.gettingSwapInfo()
    }

    removeLiquidity = async (LPAmount) => {
        await this.state.matejswap.methods.removeLiquidity(LPAmount, this.state.detectedAccount).send({from: this.state.detectedAccount})
        this.loadWalletInfo()
        this.gettingSwapInfo()
    }

    handleClick(actionTookOnTheExchange) {
        this.setState({
            swappingOrPool: actionTookOnTheExchange
        })
    }

    render() {

        if (!this.state.alertDialog) {
            return (<AlertDialog setAlertDialog={this.setAlertDialog} text="Please consider installing MetaMask to fully experience MatejSwap!"
            />)
        } else {
            return (
                <div class="row">
                    <div>
                        <NavBar active="active" swiping={this.handleClick} detectedAccount={this.state.detectedAccount}
                            network={this.state.network} handleConnect={this.handleConnect} handleChange={this.handleChange} />
                    </div>
                    <div class="col s3">
                        <PriceAndInfoSideDiv eth={this.state.ethBalanceInPool} fesb={this.state.fesbBalanceInPool} />
                    </div>
                    <div class="col s6">
                        <Container price={this.state.price} swapping={this.state.swappingOrPool} balances={this.state.balances} buy={this.buyFesbTokens}
                            sell={this.sellFesbTokens} provideLiq={this.provideLiquidity} removeLiq={this.removeLiquidity} />
                    </div>
                    <div class="col s3">Ovdi bi tribale bit upute</div>
                </div>
            );
        }
    }
}

ReactDOM.render(<Page />, document.getElementById("root"));