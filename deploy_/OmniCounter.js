const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const endpoint = await ethers.getContract("Endpoint")

    await deploy("OmniCounter", {
        from: deployer,
        args: [endpoint.address],
        log: true,
        skipIfAlreadyDeployed: true,
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["OmniCounter"]
