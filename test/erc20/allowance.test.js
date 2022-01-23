const Artifact = artifacts.require('../contracts/Coin.sol');

contract('Coin allowance method tests', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const otherAddress = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
  });

  it('should alert error when not allowed', async () => {
    const result = await contractInstance.allowance(ownerAddress, otherAddress, { from: ownerAddress })
    assert.equal(0, result.toNumber(), 'wrong result');
  });

  it('allowance should success', async () => {
    const expectedAmount = 100;

    await contractInstance.approve(otherAddress, expectedAmount, { from: ownerAddress });
    const result = await contractInstance.allowance(ownerAddress, otherAddress, { from: ownerAddress });

    assert.equal(expectedAmount, result.toNumber(), 'wrong result');
  });
});