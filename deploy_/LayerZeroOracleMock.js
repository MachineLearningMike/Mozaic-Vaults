module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("LayerZeroOracleMock", {
        // gasLimit:30000000,
        from: deployer,
        skipIfAlreadyDeployed: true,
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.skip = () =>
    new Promise(async (resolve) => {
        resolve(false)
    })

module.exports.tags = ["LayerZeroOracleMock", "test"]
module.exports.dependencies = []
