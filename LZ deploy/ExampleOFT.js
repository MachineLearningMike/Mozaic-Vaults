const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const OFT_CONFIG = require("../constants/oftConfig.json")
const { ethers } = require("hardhat")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const endpoint = await ethers.getContract("Endpoint")

    await deploy("ExampleOFT", {
        from: deployer,
        args: [endpoint.address],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["ExampleOFT"]
