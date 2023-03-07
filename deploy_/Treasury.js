const { isTestnet } = require("../utils/network")

module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    let ultraLightNode = await ethers.getContract("UltraLightNodeV2_wo_Validation")

    const { address } = await deploy("TreasuryV2", {
        // gasLimit: 30000000,
        from: deployer,
        args: [ultraLightNode.address],
        skipIfAlreadyDeployed: true,
        log: true,
        waitConfirmations: 1,
    })

    // if (isTestnet()) {
        // set the treasury address so the UltraLightNode knows about it and can calc fees
        // ultraLightNode = await ethers.getContract("UltraLightNode")
        await (await ultraLightNode.setTreasury(address)).wait()
    // }
}

// module.exports.skip = () =>
//     new Promise(async (resolve) => {
//         resolve(!isTestnet())
//     })
module.exports.tags = ["TreasuryV2", "test"]
module.exports.dependencies = ["UltraLightNodeV2_wo_Validation"]
