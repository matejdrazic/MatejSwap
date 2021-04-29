const { assert } = require('chai');

const FesbToken = artifacts.require("FesbToken");
const MatejSwap = artifacts.require("MatejSwap");

require('chai').use(require('chai-as-promised')).should();

//LAST TEST OF MATEJSWAP INVOLVING 3 LPS

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('MatejSwap', ([deployer, investor, treci]) => {
    let token, matejswap;

    before(async () => {
        token = await FesbToken.new();
        matejswap = await MatejSwap.new(token.address);

        await token.transfer(investor, tokens('40000'))
        await token.transfer(treci, tokens('60000'))

    })
    //NAPIŠI TESTOVE ZA TESTIRAT SVE 4 FUNKCIJE U MATEJSWAPU
    describe('Testing ProvideLiquidity()', async function () {
        it('providing liquidity, should generate LP tokens...', async function () {
            await token.approve(matejswap.address, tokens('100000'))
            await matejswap.provideLiquidity(tokens('100000'), {from: deployer, value: web3.utils.toWei('5', 'ether')});
            let amount = await matejswap.balanceOf(deployer)
            assert.equal(amount.toString(), tokens('5'))
        })

        it('providing 2nd liquidity, should generate LP tokens...', async function () {
            await token.approve(matejswap.address, tokens('40000'), {from: investor})
            await matejswap.provideLiquidity(tokens('40000'), {from: investor, value: web3.utils.toWei('2', 'ether')});
            let amount = await matejswap.balanceOf(investor)
            assert.equal(amount.toString(), tokens('2'))
        })

        it('providing 3rd liquidity, should generate LP tokens...', async function () {
            await token.approve(matejswap.address, tokens('60000'), {from: treci})
            await matejswap.provideLiquidity(tokens('60000'), {from: treci, value: web3.utils.toWei('3', 'ether')});
            let amount = await matejswap.balanceOf(treci)
            assert.equal(amount.toString(), tokens('3'))
        })
    })

    describe('Testing buyFesbTokens()...', async function () {
        it('buying fesb tokens in exchange for eth', async function() {
            await matejswap.buyFesbTokens({from: deployer, value: web3.utils.toWei('9', 'ether')})
            let result = await token.balanceOf(deployer)
            assert.equal(result.toString(), tokens('4875000'))
        })
        
    })

    describe('Testing buyFesbTokens()...', async function () {
        it('buying fesb tokens in exchange for eth', async function() {
            await matejswap.removeLiquidity(tokens('3'), treci)
            let result = await web3.eth.getBalance(treci)
            assert.equal(result.toString(), tokens('105.7'))
            let fesb = await token.balanceOf(treci)
            assert.equal(fesb.toString(), tokens('37500'))
        })
    })
})