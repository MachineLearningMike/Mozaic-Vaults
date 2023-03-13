// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "../lzApp/NonblockingLzApp.sol";

contract MozaicVault is NonblockingLzApp {
    event Deployed(address indexed at, address indexed lzPoint);

    bool public isMain;

    constructor(address _lzEndpoint, bool _isMain) NonblockingLzApp(_lzEndpoint) {
        isMain = _isMain;

        emit Deployed(address(this), _lzEndpoint);
    }

    function ping(
        uint16 _dstChainId, // send a ping to this destination chainId
        address, // destination address of PingPong contract
        uint pings // the number of pings
    ) public payable {
        require(address(this).balance > 0, "the balance of this contract is 0. pls send gas for message fees");

        // encode the payload with the number of pings
        bytes memory payload = abi.encode(pings);

        // use adapterParams v1 to specify more gas for the destination
        uint16 version = 1;
        uint gasForDestinationLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(version, gasForDestinationLzReceive);

        // send LayerZero message
        _lzSend( // {value: messageFee} will be paid out of this contract!
            _dstChainId,
            payload,
            payable(this),
            address(0x0), 
            adapterParams,
            msg.value
        );
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
