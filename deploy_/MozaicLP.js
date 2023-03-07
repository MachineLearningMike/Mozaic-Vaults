const CONFIG = require("../constants/config.json")
const { isTestnet } = require("../utils/network")

module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const endpoint = await ethers.getContract("Endpoint")

    const { address } = await deploy("MozaicLP", {
        from: deployer,
        args: [endpoint.address],
        // if set it to true, will not attempt to deploy
        // even if the contract deployed under the same name is different
        skipIfAlreadyDeployed: true,
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["MozaicLP", "test"]
module.exports.dependencies = ["Endpoint"]