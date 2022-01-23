const Artifact = artifacts.require('../contracts/Coin.sol');
const Assert = require('truffle-assertions');

contract('Coin increaseApproval method tests', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const otherAddress = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
  });

  it('increaseApproval method should success', async () => {
    const initialAmount = 1000;
    const expectedAmount = 2000;

    await contractInstance.approve(otherAddress, initialAmount, { from: ownerAddress });

    const resultBeforeIncrease = await contractInstance.allowance(ownerAddress, otherAddress, { from: ownerAddress });
    const resultIncrease = await contractInstance.increaseApproval(otherAddress, initialAmount, { from: ownerAddress });
    const resultAfterIncrease = await contractInstance.allowance(ownerAddress, otherAddress, { from: ownerAddress });

    assert.equal(initialAmount, resultBeforeIncrease.toNumber(), 'wrong result berore increase');
    assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
    Assert.eventEmitted(resultIncrease, 'Approval');
  });
});