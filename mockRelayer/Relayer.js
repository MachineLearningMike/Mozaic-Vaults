const { ethers, waffle, network, upgrades } = require("hardhat");
const { expect, util, assert } = require("chai");
const { utils, BigNumber } = require("ethers");
const { getEndpointId, isTestnet } = require("../utils/network")

require("colors");

function consoleLogWithTab(str) {
    console.log(`\t${str}`);
}


const vaultAddresses = [];

topicDeployed = ethers.utils.id("Deployed(address,address)");
filterDeployed = {
    topics: [topicDeployed],
}

function listenDeployed(log, event) {
    if(log.topics.includes(topicDeployed)) {
        console.log(log.topics);
        vaultAddresses.push('0x' + log.topics[1].slice(26));
    }
}

topicPacket = ethers.utils.id("Packet(bytes)");
filterPacket = {
    topics: [topicPacket],
}


function listenPacket(log, event) {
    if(log.topics.includes(topicPacket)) {
        console.log(log.data);
    }
}

ethers.provider.removeAllListeners();
ethers.provider.on(filterDeployed, listenDeployed);
// ethers.provider.on(filterPacket, listenPacket);
