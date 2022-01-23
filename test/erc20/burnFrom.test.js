const Artifact = artifacts.require('../contracts/Coin.sol');
const Assert = require('truffle-assertions');

contract('Coin burnFrom method tests', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const otherAddress = accounts[1];
  const tokenTotalSupply = 1000000;

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
  });

  it('burnFrom should alert error when address is invalid', async () => {
    await Assert.reverts(
      contractInstance.burnFrom('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
      'ERC20: from address is not valid'
    );
  });

  it('burnFrom should alert error when balance is insufficient', async () => {
    await Assert.reverts(
      contractInstance.burnFrom(otherAddress, 1000, { from: ownerAddress }),
      'ERC20: insufficient balance'
    );
  });

  it('burnFrom should alert error when account is not a owner', async () => {
    await contractInstance.mintTo(otherAddress, 1000, { from: ownerAddress });

    await Assert.reverts(
      contractInstance.burnFrom(otherAddress, 500, { from: otherAddress }),
      'Ownable: caller is not the owner'
    );
  });

  it('burnFrom should success', async () => {
    const mintValue = 1000;
    const burnValue = 500;
    const expectedBalance = 500;

    await contractInstance.mintTo(otherAddress, mintValue, { from: ownerAddress });
    await contractInstance.burnFrom(otherAddress, burnValue, { from: ownerAddress });

    const expectedTotalSupply = (tokenTotalSupply + mintValue) - burnValue;
    const resultAfterBurn = await contractInstance.totalSupply();
    const resultBalanceOf = await contractInstance.balanceOf(otherAddress, { from: otherAddress });

    assert.equal(expectedTotalSupply, resultAfterBurn, 'wrong totalSupply after burn');
    assert.equal(expectedBalance, resultBalanceOf, 'wrong balance');
  });
});