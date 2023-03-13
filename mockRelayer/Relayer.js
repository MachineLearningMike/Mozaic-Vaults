const { ethers, waffle, network, upgrades } = require("hardhat");
const { expect, util, assert } = require("chai");
const { utils, BigNumber } = require("ethers");
const { getEndpointId, isTestnet } = require("../utils/network")

require("colors");

function consoleLogWithTab(str) {
    console.log(`\t${str}`);
}

const vaults = [];
let owner, alice, bob, carol, dev;
const nVaults = 5;
let nMain = 0;
let tx;