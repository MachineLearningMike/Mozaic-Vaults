const { getEndpointId } = require("../utils/network")
const CONFIG = require("../constants/config.json")

function getDependencies() {
    let rtn = ["Endpoint"]
    if (isTestnet()) {
        rtn = rtn.concat(["RelayerStaking"])
        rtn = rtn.concat(["LayerZeroOracleMock"])
        rtn = rtn.concat(["LayerZeroTokenMock"])
    }
    return rtn
}

module.exports.tags = ["Endpoint", "test"]
