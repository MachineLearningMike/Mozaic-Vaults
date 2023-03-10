// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "../lzApp/NonblockingLzApp.sol";

contract MozaicVault is NonblockingLzApp {

    bool public isMain;

    constructor(address _lzEndpoint, bool _isMain) NonblockingLzApp(_lzEndpoint) {
        isMain = _isMain;
    }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal override {

    }

    // Receive and spend gift Ether for our customers
    receive() external payable {}

}