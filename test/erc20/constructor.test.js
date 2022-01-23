const Artifact = artifacts.require('../contracts/Coin.sol');

contract('Coin constructor tests', accounts => {
  const expectedCoinName = 'Coin';
  const expectedCoinSymbol = 'COIN';
  const expectedTokenDecimals = 12;
  const expectedTokenTotalSupply = 1000000;

  const ownerAddress = accounts[0];

  let contractInstance;

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await Artifact.new();
  });

  it('set contract properties on contructor (name, symbol, decimals and totalSupply)',
    async () => {
      const name = await contractInstance.name();
      const symbol = await contractInstance.symbol();
      const decimals = await contractInstance.decimals();
      const totalSupply = await contractInstance.totalSupply();

      assert.equal(expectedCoinName, name, 'name is incorrect');
      assert.equal(expectedCoinSymbol, symbol, 'symbol is incorrect');
      assert.equal(expectedTokenDecimals, decimals, 'decimals is incorrect');
      assert.equal(expectedTokenTotalSupply, totalSupply, 'total supply is incorrect');
    });

  it('set 1000000 tokens on contract owner balance', async () => {
    const contractOwnerBalance = await contractInstance.balanceOf(ownerAddress);

    assert.equal(1000000, contractOwnerBalance.toNumber());
  })
});