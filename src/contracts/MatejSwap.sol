// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./Math.sol";
import "../interface/IFesbToken.sol";
import "./MatejSwapLP.sol";

contract MatejSwap is MatejSwapLP {
    IFesbToken public FesbToken;

    event TokenPurchase(address buyer, uint256 eth_sold, uint256 tokens_bought);
    event EthPurchase(address buyer, uint256 tokens_sold, uint256 eth_bought);
    event AddLiquidity(
        address provider,
        uint256 eth_amount,
        uint256 token_amount
    );
    event RemoveLiquidity(
        address provider,
        uint256 eth_amount,
        uint256 token_amount
    );
    event Received(address, uint256);

    using SafeMath for uint256;

    constructor(IFesbToken token) public {
        FesbToken = token;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function buyFesbTokens() public payable returns (uint256) {
        uint256 fee = msg.value.div(100);
        uint256 eth_pool = address(this).balance.sub(msg.value);
        uint256 fesb_pool = FesbToken.balanceOf(address(this));
        uint256 k = eth_pool.mul(fesb_pool);
        uint256 new_eth_pool = address(this).balance.sub(fee);
        uint256 new_fesb_pool = k.div(new_eth_pool);
        uint256 amountReceived = fesb_pool.sub(new_fesb_pool);
        FesbToken.transfer(msg.sender, amountReceived);
        emit TokenPurchase(msg.sender, msg.value, amountReceived);
        return amountReceived;
    }

    function sellFesbTokens(uint256 amountSent, address payable recipient)
        public returns (uint256)
    {
        uint256 fee = amountSent.div(100);
        uint256 eth_pool = address(this).balance;
        uint256 fesb_pool = FesbToken.balanceOf(address(this));
        uint256 k = eth_pool.mul(fesb_pool);
        uint256 new_fesb_pool =
            FesbToken.balanceOf(address(this)).add(amountSent).sub(fee);
        uint256 new_eth_pool = k.div(new_fesb_pool);
        uint256 amountReceived = eth_pool.sub(new_eth_pool);
        require(FesbToken.transferFrom(msg.sender, address(this), amountSent));
        recipient.transfer(amountReceived);
        emit EthPurchase(msg.sender, amountSent, amountReceived);
        return amountReceived;
    }

    function provideLiquidity(uint256 amountSent)
        public
        payable
        returns (uint256)
    {
        if (totalSupply > 0) {
            require(msg.value > 0);
                uint256 amountOfLPTokens = msg.value.mul(totalSupply).div(address(this).balance.sub(msg.value));
            require(
                FesbToken.transferFrom(msg.sender, address(this), amountSent)
            );
            _mint(msg.sender, amountOfLPTokens);
            emit AddLiquidity(msg.sender, msg.value, amountSent);
            emit Transfer(address(0), msg.sender, amountOfLPTokens);
            return amountOfLPTokens;
        } else {
            require(msg.value > 0);
            uint256 amountOfLPTokens = msg.value;
            require(
                FesbToken.transferFrom(msg.sender, address(this), amountSent)
            );
            _mint(msg.sender, amountOfLPTokens);
            emit AddLiquidity(msg.sender, msg.value, amountSent);
            emit Transfer(address(0), msg.sender, amountOfLPTokens);
            return amountOfLPTokens;
        }
    }

    function removeLiquidity(uint256 amount, address payable recipient)
        public
        returns (uint256, uint256)
    {
        require(amount > 0);
        uint256 total_liquidity = totalSupply;
        require(total_liquidity > 0);
        uint256 token_reserve = FesbToken.balanceOf(address(this));
        uint256 eth_amount =
            amount.mul(address(this).balance).div(total_liquidity);
        uint256 token_amount = amount.mul(token_reserve).div(total_liquidity);

        _burn(msg.sender, amount);
        recipient.transfer(eth_amount);
        require(FesbToken.transfer(msg.sender, token_amount));
        emit RemoveLiquidity(msg.sender, eth_amount, token_amount);
        emit Transfer(msg.sender, address(0), amount);
        return (eth_amount, token_amount);
    }
}
