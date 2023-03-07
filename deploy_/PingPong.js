const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const owner = (await ethers.getSigners())[0]
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const endpoint = await ethers.getContract("Endpoint")

    let pingPong = await deploy("PingPong", {
        from: deployer,
        args: [endpoint.address],
        skipIfAlreadyDeployed: true,
        log: true,
        waitConfirmations: 1,
    })

    let eth = "0.99"
    let tx = await (
        await owner.sendTransaction({
            to: pingPong.address,
            value: ethers.utils.parseEther(eth),
        })
    ).wait()
    console.log(`send it [${eth}] ether | tx: ${tx.transactionHash}`)
}

module.exports.tags = ["PingPong"]
