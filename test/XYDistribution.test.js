const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const { expect } = chai;

const XYDistribution = artifacts.require('XYDistribution');
const {MockERC20ABI, VORCoordinatorABI} = require('../front/src/abis/abis')
const { REACT_APP_XFUND_ADDRESS, REACT_APP_VORCOORDINATOR_ADDRESS, KEY_HASH } = process.env
contract('XYDistribution', ([owner, oracle, alice]) => {
    beforeEach(async () => {
        this.xfund = await new web3.eth.Contract(MockERC20ABI, REACT_APP_XFUND_ADDRESS)
        this.vorCoord = await new web3.eth.Contract(VORCoordinatorABI, REACT_APP_VORCOORDINATOR_ADDRESS)
        this.dist = await XYDistribution.new(REACT_APP_VORCOORDINATOR_ADDRESS, REACT_APP_XFUND_ADDRESS, { from: owner });
        this.fee = await this.vorCoord.methods.getProviderGranularFee(KEY_HASH, this.dist.address).call()

        await this.dist.increaseVorAllowance( "100000000000000000000000000", { from: owner } )
    });

    it('set monikery & check moniker', async () => {

        await expectRevert(
            this.dist.registerMoniker("This string is more than 32 characters we limited.", { from: alice }),
            "can't exceed 32 characters."
        );

        await this.dist.registerMoniker("Sky", { from: alice });
        const moniker = await this.dist.getMoniker({ from: alice });
        expect(moniker).to.be.equal("Sky");
    });

    it('check start distribution', async () => {
        let seed = 1000;

        await this.xfund.methods.transfer(alice, this.fee).send({from: owner})
        await this.xfund.methods.increaseAllowance(this.dist.address, this.fee).send({from: alice})
        await expectRevert(
            this.dist.startDistribute("ipfs://11111", 1000, 500, 1, seed, KEY_HASH, this.fee, {from: alice}),
            `not registered address`
        );

        await this.dist.registerMoniker("Sky", { from: alice });
        await this.xfund.methods.transfer(alice, this.fee).send({from: owner})
        await this.xfund.methods.increaseAllowance(this.dist.address, this.fee).send({from: alice})
        const startdis = await this.dist.startDistribute("ipfs://11111", 1000, 500, 1, seed, KEY_HASH, this.fee, {from: alice});
        expectEvent(startdis, 'StartingDistribute', { keyHash: KEY_HASH, fee: this.fee });
    });
});