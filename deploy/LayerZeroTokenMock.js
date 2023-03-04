module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("UltraLightNodeV2_WO_Validation", {
        from: deployer,
        log: true,
    })
}

module.exports.skip = () =>
    new Promise(async (resolve) => {
        resolve(false)
    })
module.exports.tags = ["UltraLightNodeV2_WO_Validation", "test"]
