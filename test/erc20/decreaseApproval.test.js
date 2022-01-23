const Artifact = artifacts.require('../contracts/Coin.sol');
const Assert = require('truffle-assertions');

contract('Coin decreaseApproval method tests', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const otherAddress = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
  });

  it('method decreaseApproval should success', async () => {
    const initialAmount = 1000;
    const expectedAmount = 500;

    await contractInstance.approve(otherAddress, initialAmount, { from: ownerAddress });

    const resultBeforeDecreaseApproval = await contractInstance.allowance(ownerAddress, otherAddress, { from: ownerAddress });
    const resultDecreaseApproval = await contractInstance.decreaseApproval(otherAddress, 500, { from: ownerAddress });
    const resultAfterDecrease = await contractInstance.allowance(ownerAddress, otherAddress, { from: ownerAddress });

    assert.equal(initialAmount, resultBeforeDecreaseApproval.toNumber(), 'wrong result berore increase');
    assert.equal(expectedAmount, resultAfterDecrease.toNumber(), 'wrong result after increase');
    Assert.eventEmitted(resultDecreaseApproval, 'Approval');
  });
});