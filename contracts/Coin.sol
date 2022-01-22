// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IERC20.sol";
import "./SafeMath.sol";
import "./Ownable.sol";

contract Coin is IERC20, Ownable {
    using SafeMath for uint256;

    string internal _name;
    string internal _symbol;
    uint8 internal _decimals;
    uint256 internal _totalSupply;

    mapping(address => uint256) internal _balances;
    mapping(address => mapping(address => uint256)) internal _allowed;

    event Mint(address indexed minter, address indexed account, uint256 amount);
    event Burn(address indexed burner, address indexed account, uint256 amount);

    constructor() {
        _name = "Coin";
        _symbol = "COIN";
        _totalSupply = 3000;
        _decimals = 12;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        override
        returns (bool)
    {
        require(_to != address(0), "ERC20 Error: Address is not valid");
        require(
            _value <= _balances[msg.sender],
            "Transaction Error: insufficient balance"
        );

        _balances[msg.sender] = SafeMath.sub(_balances[msg.sender], _value);
        _balances[_to] = SafeMath.add(_balances[_to], _value);

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function balanceOf(address _owner)
        public
        view
        override
        returns (uint256 balance)
    {
        return _balances[_owner];
    }

    function approve(address _spender, uint256 _value)
        public
        override
        returns (bool)
    {
        _allowed[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public override returns (bool) {
        require(
            _from != address(0),
            "ERC20 Error: 'from' address is not valid"
        );
        require(_to != address(0), "ERC20 Error: 'to' address is not valid");
        require(
            _value <= _balances[_from],
            "Transaction Error: insufficient balance"
        );
        require(
            _value <= _allowed[_from][msg.sender],
            "Transaction Error, 'from' not allowed"
        );

        _balances[_from] = SafeMath.sub(_balances[_from], _value);
        _balances[_to] = SafeMath.add(_balances[_to], _value);
        _allowed[_from][msg.sender] = SafeMath.sub(
            _allowed[_from][msg.sender],
            _value
        );

        emit Transfer(_from, _to, _value);

        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        override
        returns (uint256)
    {
        return _allowed[_owner][_spender];
    }

    function increaseApproval(address _spender, uint256 _addedValue)
        public
        returns (bool)
    {
        _allowed[msg.sender][_spender] = SafeMath.add(
            _allowed[msg.sender][_spender],
            _addedValue
        );

        emit Approval(msg.sender, _spender, _allowed[msg.sender][_spender]);

        return true;
    }

    function decreaseApproval(address _spender, uint256 _subtractedValue)
        public
        returns (bool)
    {
        uint256 oldValue = _allowed[msg.sender][_spender];

        if (_subtractedValue > oldValue) {
            _allowed[msg.sender][_spender] = 0;
        } else {
            _allowed[msg.sender][_spender] = SafeMath.sub(
                oldValue,
                _subtractedValue
            );
        }

        emit Approval(msg.sender, _spender, _allowed[msg.sender][_spender]);

        return true;
    }

    function mintTo(address _to, uint256 _amount) public onlyOwner {
        require(_to != address(0), "ERC20: to address is not valid");
        require(_amount > 0, "ERC20: amount is not valid");

        _totalSupply = _totalSupply.add(_amount);
        _balances[_to] = _balances[_to].add(_amount);

        emit Mint(msg.sender, _to, _amount);
    }

    function burnFrom(address _from, uint256 _amount) public onlyOwner {
        require(_from != address(0), "ERC20: from address is not valid");
        require(_balances[_from] >= _amount, "ERC20: insufficient balance");

        _balances[_from] = _balances[_from].sub(_amount);
        _totalSupply = _totalSupply.sub(_amount);

        emit Burn(msg.sender, _from, _amount);
    }
}
