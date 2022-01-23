const Artifact = artifacts.require('../contracts/Coin.sol');

contract('Coin constructor tests', accounts => {
  const expectedCoinName = 'Coin';
  const expectedCoinSymbol = 'COIN';
  const expectedTokenDecimals = 12;
  const expectedTokenTotalSupply = 1000000;

  const ownerAddress = accounts[0];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  it('set contract properties on contructor (name, symbol, decimals and totalSupply)',
    async () => {
      const contract = await Artifact.new();

      const name = await contract.name();
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();
      const totalSupply = await contract.totalSupply();

      assert.equal(expectedCoinName, name, 'name is incorrect');
      assert.equal(expectedCoinSymbol, symbol, 'symbol is incorrect');
      assert.equal(expectedTokenDecimals, decimals, 'decimals is incorrect');
      assert.equal(expectedTokenTotalSupply, totalSupply, 'total supply is incorrect');
    });
});