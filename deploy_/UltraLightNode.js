const CONFIG = require("../constants/config.json")
const { getEndpointId, isTestnet } = require("../utils/network")

function getDependencies() {
    let rtn = ["Endpoint"]
    if (isTestnet()) {
        rtn = rtn.concat(["RelayerStaking"])
        rtn = rtn.concat(["LayerZeroOracleMock"])
        rtn = rtn.concat(["LayerZeroTokenMock"])
    }
    return rtn
}

module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const endpoint = await ethers.getContract("Endpoint")
    const nonceContract = await ethers.getContract("NonceContract")

    const { address } = await deploy("UltraLightNodeV2_wo_Validation", {
        from: deployer,
        args: [endpoint.address, nonceContract.address, getEndpointId()],
        // if set it to true, will not attempt to deploy
        // even if the contract deployed under the same name is different
        skipIfAlreadyDeployed: true,
        log: true,
        waitConfirmations: 1,
    })

    if (isTestnet()) {
        // const oracle = await ethers.getContract("LayerZeroOracleMock")
        // await (await oracle.setUln(address)).wait()
        const layerZeroToken = await ethers.getContract("LayerZeroTokenMock")
        const ultraLightNode = await ethers.getContract("UltraLightNodeV2_wo_Validation")
        await (await ultraLightNode.setLayerZeroToken(layerZeroToken.address)).wait()
    }
}

module.exports.tags = ["UltraLightNodeV2_wo_Validation", "test"]
module.exports.dependencies = getDependencies()
