// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "../token/oft/composable/ComposableOFT.sol";

/// @title A LayerZero OmnichainFungibleToken example of BasedOFT
/// @notice Use this contract only on the BASE CHAIN. It locks tokens on source, on outgoing send(), and unlocks tokens when receiving from other chains.

contract MozaicLP is ComposableOFT {
    address public vault;

    constructor(address _layerZeroEndpoint) ComposableOFT("Mozaic Liquidity Provider Token", "MLP", _layerZeroEndpoint) {
    }

    function setValut(address _vault) onlyOwner external virtual {
        vault = _vault; // No need to require non-zero address. 
    }

    modifier onlyVault() {
        require(vault == _msgSender(), "mLP: caller is not the vault");
        _;
    }

    function _debitFrom(address _from, uint16, bytes memory, uint _amount) onlyVault  internal virtual override returns(uint) {
        address spender = _msgSender();
        if (_from != spender) _spendAllowance(_from, spender, _amount);
        _burn(_from, _amount);
        return _amount;
    }

    function _creditTo(uint16, address _toAddress, uint _amount) onlyVault internal virtual override returns(uint) {
        _mint(_toAddress, _amount);
        return _amount;
    }

}