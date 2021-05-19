import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import 'materialize-css/dist/css/materialize.min.css';
import M, { updateTextFields } from 'materialize-css';
import './index.css';
import FesbToken from './build/FesbToken.json';
import MatejSwap from './build/MatejSwap.json';
import MatejSwapLP from './build/MatejSwapLP.json'
import DialogBox from './components/AlertDialog'
import AlertDialog from './components/AlertDialog';
import PriceAndInfoSideDiv from './components/PriceAndInfoSideDiv';
import Icon from './components/Icon';
import ButtonOne from './components/ButtonOne';
import ButtonTwo from './components/ButtonTwo';
import ButtonThree from './components/ButtonThree';
import InputFieldLP from './components/InputFieldLP';
import NavBar from './components/Navbar';
import InputField from './components/InputField'
import InputFieldTwo from './components/InputFieldTwo'
import Tab from './components/Tab'
import Curve from './components/Curve'

let web3 = new Web3(Web3.givenProvider)
const AddressContext = React.createContext(null)

M.AutoInit()

class Container extends React.Component {
    render() {
        if (this.props.swapping === true)
            return <SwapContainer eth={this.props.eth} fesb={this.props.fesb} eth_change={this.props.eth_change} fesb_change={this.props.fesb_change}
                constant={this.props.constant} price={this.props.price} balances={this.props.balances}
                ethChange={this.props.ethChange} fesbChange={this.props.fesbChange}
                buy={this.props.buy} sell={this.props.sell} />
        else
            return <PoolContainer
                price={this.props.price} balances={this.props.balances} provideLiq={this.props.provideLiq} removeLiq={this.props.removeLiq} />
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
            eth: e.target.value / this.props.price,
            fesb: e.target.value,
        })
    }

    lp_change(e) {
        this.setState({
            lp: e.target.value
        })
    }
    static contextType = AddressContext;
    render() {

        let provideForm = (<div class="marpad">
            <InputField value={this.state.eth} text={this.state.inputFieldText} balances={this.props.balances} input={this.eth_change} />
            <Icon arrow={this.state.arrow} />
            <InputFieldTwo value={this.state.fesb} text={this.state.inputFieldTeoText} balances={this.props.balances} input={this.fesb_change} />
            <ButtonTwo address={this.context} text={this.state.text}
                onClick={this.props.provideLiq} amountETH={this.state.eth ? this.state.eth.toString() : '0'} amountFESB={this.state.fesb ? this.state.fesb.toString() : '0'}
            />
        </div>)

        let removeForm = <div class="marpad">
            <InputFieldLP text={this.state.inputFieldText} balances={this.props.balances} input={this.lp_change} provideOrRemove={true} />
            <ButtonThree address={this.context} text={this.state.text}
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
            eth: '',
            fesb: '',
            arrow: 'arrow_downward',
            disabledETH: '',
            disabledFESB: 'disabled',
            textDisplayETH: 'This is where you enter your ETH amount: ',
            textDisplayFESB: 'This is how much FESB coins you get: '
        });

        this.handleBuyClick = this.handleBuyClick.bind(this);
        this.handleSellClick = this.handleSellClick.bind(this);

        const tabs = document.querySelector('.tabs');
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
    static contextType = AddressContext;
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
                        input={this.props.eth_change} value={this.props.ethChange} buyOrSell={this.state.buyOrSell} />
                    <Icon arrow={this.state.arrow} />
                    <InputFieldTwo disabled={this.state.disabledFESB} text={this.state.textDisplayFESB} balances={this.props.balances}
                        input={this.props.fesb_change} value={this.props.fesbChange} buyOrSell={this.state.buyOrSell} />
                    <ButtonOne address={this.context} text={this.state.buyOrSell ? 'Buy' : 'Sell'}
                        onClick={this.state.buyOrSell ? this.props.buy : this.props.sell} amount={this.state.buyOrSell ? (this.props.ethChange ? this.props.ethChange.toString() : '0') : (this.props.fesbChange ? this.props.fesbChange.toString() : '0')} />
                </div>
            </div>
        );
    }
}

class Page extends React.Component {

    constructor(props) {
        super(props)
        this.state = ({
            eth: 0,
            fesb: 0,
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
            fesbBalanceInPool: '0',
            text: "Please consider installing MetaMask to fully experience MatejSwap!",
            okButton: 'Install',
            dialogTitle: "MetaMask error!",
            writing: true
        })

        this.handleClick = this.handleClick.bind(this)
        this.handleConnect = this.handleConnect.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.setAlertDialog = this.setAlertDialog.bind(this);
        this.loadWalletInfo = this.loadWalletInfo.bind(this);

        this.gettingSwapInfo = this.gettingSwapInfo.bind(this);
        this.getBlockchain = this.getBlockchain.bind(this);
        this.getContracts = this.getContracts.bind(this);

        this.eth_change = this.eth_change.bind(this);
        this.fesb_change = this.fesb_change.bind(this)

    }

    async getContracts() {
        /* let networkID = await web3.eth.net.getId()
        let FesbNetwork = FesbToken.networks[networkID]
        let MatejSwapNetwork = MatejSwap.networks[networkID]
        let MatejLPNetwork = MatejSwapLP.networks[networkID] */

        let fesb_token = new web3.eth.Contract(FesbToken.abi, '0x5D7b1fD58633cB6FaEF2250838076A5E3634087d')
        let matejswap = new web3.eth.Contract(MatejSwap.abi, '0x421FCB7d64b4DEEc47D3025a7C9362965aefd383')
        let matejswapLP = new web3.eth.Contract(MatejSwapLP.abi, '0xdDcbb84192B858940CD01f08200Cd24E7Aee336F')

        this.setState({
            fesb_token,
            matejswap,
            matejswapLP
        })
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
        else chainName = 'Local env'
        this.setState({
            network: chainName,
            detectedAccount: accounts ? accounts[0] : false
        })
    }

    async handleConnect() {

        try {
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
                else console.log('Local env')
                this.setState({
                    network: chainName,
                    detectedAccount: accounts ? accounts[0] : false
                })
                this.loadWalletInfo()
            } else {
                window.open('https://metamask.io', '_blank');
            }
        } catch (e) {
            this.setState({
                alertDialog: false,
                text: e.message,
                dialogTitle: "Your MetaMask is probably already open!"
            })
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
                await this.gettingSwapInfo()

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
        let constant = eth * fesb
        let price = fesb / eth

        this.setState({
            eth,
            fesb,
            ethBalanceInPool: ethBalanceInPool.toString(),
            fesbBalanceInPool: fesbBalanceInPool.toString(),
            price,
            constant
        })
    }


    buyFesbTokens = async (ethAmount) => {
        await this.state.matejswap.methods.buyFesbTokens().send({ from: this.state.detectedAccount, value: ethAmount }).on('transactionHash', (tx) => {
            this.setState({
                alertDialog: false,
                text: tx,
                okButton: 'View on EtherScan.com',
                dialogTitle: "Transaction hash:"
            })
        })
        this.loadWalletInfo()
        this.gettingSwapInfo()
    }

    sellFesbTokens = async (fesbAmount) => {
        await this.state.fesb_token.methods.approve(this.state.matejswap._address, fesbAmount).send({ from: this.state.detectedAccount }).on('transactionHash', (tx) => {
            this.setState({
                alertDialog: false,
                text: tx,
                okButton: 'View on EtherScan.com',
                dialogTitle: "Transaction hash:"
            })
        })
        await this.state.matejswap.methods.sellFesbTokens(fesbAmount, this.state.detectedAccount).send({ from: this.state.detectedAccount }).on('transactionHash', (tx) => {
            this.setState({
                alertDialog: false,
                text: tx,
                okButton: 'View on EtherScan.com',
                dialogTitle: "Transaction hash:"
            })
        })
        this.loadWalletInfo()
        this.gettingSwapInfo()
    }

    provideLiquidity = async (ethAmount, fesbAmount) => {
        await this.state.fesb_token.methods.approve(this.state.matejswap._address, fesbAmount).send({ from: this.state.detectedAccount }).on('transactionHash', (tx) => {
            this.setState({
                alertDialog: false,
                text: tx,
                okButton: 'View on EtherScan.com',
                dialogTitle: "Transaction hash:"
            })
        })
        await this.state.matejswap.methods.provideLiquidity(fesbAmount).send({ from: this.state.detectedAccount, value: ethAmount }).on('transactionHash', (tx) => {
            this.setState({
                alertDialog: false,
                text: tx,
                okButton: 'View on EtherScan.com',
                dialogTitle: "Transaction hash:"
            })
        })
        this.loadWalletInfo()
        this.gettingSwapInfo()
    }

    removeLiquidity = async (LPAmount) => {
        await this.state.matejswap.methods.removeLiquidity(LPAmount, this.state.detectedAccount).send({ from: this.state.detectedAccount }).on('transactionHash', (tx) => {
            this.setState({
                alertDialog: false,
                text: tx,
                okButton: 'View on EtherScan.com',
                dialogTitle: "Transaction hash:"
            })
        })
        this.loadWalletInfo()
        this.gettingSwapInfo()
    }

    handleClick(actionTookOnTheExchange) {
        this.setState({
            swappingOrPool: actionTookOnTheExchange
        })
    }

    eth_change(e) {
        let fesb_pool = this.state.constant / (parseFloat(e.target.value) + parseFloat(this.state.eth))
        let fesb_received = this.state.fesb - fesb_pool
        this.setState({
            ethChange: e.target.value,
            fesbChange: fesb_received,
            writing: true
        })
    }

    fesb_change(e) {
        let eth_pool = this.state.constant / (parseFloat(e.target.value) + parseFloat(this.state.fesb))
        let eth_received = this.state.eth - eth_pool
        this.setState({
            ethChange: eth_received,
            fesbChange: e.target.value,
            writing: false
        })
    }

    render() {

        if (!this.state.alertDialog) {
            return (<AlertDialog setAlertDialog={this.setAlertDialog} text={this.state.text} okButton={this.state.okButton}
                dialogTitle={this.state.dialogTitle} />)
        } else {
            return (
                <div class="row">
                    <div>
                        <NavBar active="active" swiping={this.handleClick} detectedAccount={this.state.detectedAccount}
                            network={this.state.network} handleConnect={this.handleConnect} handleChange={this.handleChange} />
                    </div>
                    <div class="col s3">
                        <PriceAndInfoSideDiv eth={this.state.ethBalanceInPool} fesb={this.state.fesbBalanceInPool} />
                        <Curve
                            addingEth={(this.state.writing) ? this.state.ethChange : 0}
                            addingToken={(this.state.writing) ? 0 : this.state.fesbChange}
                            ethReserve={parseFloat(this.state.eth)}
                            tokenReserve={parseFloat(this.state.fesb)}
                            width={350} height={350} />
                    </div>
                    <div class="col s6">
                        <AddressContext.Provider value={this.state.detectedAccount} >
                            <Container price={this.state.price} swapping={this.state.swappingOrPool} balances={this.state.balances}
                                buy={this.buyFesbTokens} eth={this.state.eth} fesb={this.state.fesb}
                                ethChange={this.state.ethChange} fesbChange={this.state.fesbChange}
                                sell={this.sellFesbTokens} provideLiq={this.provideLiquidity} removeLiq={this.removeLiquidity}
                                eth_change={this.eth_change} fesb_change={this.fesb_change} />
                        </AddressContext.Provider>
                    </div>
                    <div class="col s3">
                        <div class="card divPriceRight z-depth-3">
                            <div class="card-content">
                                <p>Here are the instructions for properly using MatejSwap.</p>
                            </div>
                            <div class="card-content grey lighten-4">
                                <div id="test4">Make sure you have MetaMask installed. If you don't, clicking on the 'Connect Wallet' button will take you to the MetaMask website.</div>
                                <div id="test5">When you do, go to <a href="https://faucet.ropsten.be/" target="_blank">this link</a> to get some ropsten ethereum. Paste your address from MetaMask (make sure you're on the Ropsten network) and get some ethereum.</div>
                                <div id="test6">From here it's really simple. You can buy, sell or provide liquidity to the pool. <br /> <b>#NOTE</b> Providing liquidity will get you LP tokens which make you eligable for claiming liquidity from the Pool contract.</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}



ReactDOM.render(<Page />, document.getElementById("root"));