const Artifact = artifacts.require('../contracts/Coin.sol');
const Assert = require('truffle-assertions');

contract('Coin mintTo method tests', accounts => {
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

  it('mintTo method should alert error when address is invalid', async () => {
    await Assert.reverts(
      contractInstance.mintTo('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
      'ERC20: to address is not valid'
    );
  });

  it('mintTo method should alert error when amount is invalid', async () => {
    await Assert.reverts(
      contractInstance.mintTo(otherAddress, 0, { from: ownerAddress }),
      'ERC20: amount is not valid'
    );
  });

  it('mintTo method should alert error when account is not a minter', async () => {
    await Assert.reverts(
      contractInstance.mintTo(otherAddress, 100, { from: otherAddress }),
      'Ownable: caller is not the owner'
    );
  });

  it('mintTo method should success', async () => {
    const mintValue = 100;

    const totalSupplyBeforeMint = await contractInstance.totalSupply();
    await contractInstance.mintTo(otherAddress, mintValue, { from: ownerAddress });
    const expectedTotalSupply = totalSupplyBeforeMint.toNumber() + mintValue;

    const resultTotalSupply = await contractInstance.totalSupply();
    const resultBalanceOf = await contractInstance.balanceOf(otherAddress, { from: otherAddress });

    assert.equal(tokenTotalSupply, totalSupplyBeforeMint, 'wrong totalSupply before');
    assert.equal(expectedTotalSupply, resultTotalSupply, 'wrong totalSupply after mint');
    assert.equal(mintValue, resultBalanceOf, 'wrong balance');
  });
});