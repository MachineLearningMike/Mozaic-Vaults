const { ethers, waffle, network, upgrades } = require("hardhat");
const { expect, util, assert } = require("chai");
const { utils, BigNumber } = require("ethers");
const { getEndpointId, isTestnet } = require("../utils/network")

require("colors");

function consoleLogWithTab(str) {
    console.log(`\t${str}`);
}

let endpoint, nonceContract, ultraLightNodeV2_wo_Validation, treasury, exampleOFT, layerZeroOracleMock, layerZeroTokenMock, omniCounter, pingPong;
let relayer;
const vaults = [];
let owner, alice, bob, carol, dev;
const nVaults = 5;
let nMain = 0;
let tx;

describe("====================== Preface ======================\n".yellow, async function () {
    it("\n".green, async function () {
      console.log("\tA test script is to run on Mozaic vault contracts, with auto-generated test reports coming below.".yellow);
      console.log("\tThe contracts will be deployed and running on a local HardHat test chain, for logical test only.".green);
      console.log("\tThe versions of the contracts and test script is as of % ".green, new Date().toLocaleString());
      console.log("\tContracts link: \n\t%s".green,
        "https://github.com/MachineLearningMike/MozaicCore");
      console.log("\tTest script link: \n\t%s".green,
        "https://....js");
    });
});
  
  
describe("====================== Stage 1: LayerZero contracts ======================\n".yellow, async function () {
    it("LayerZero contracts are deployed.\n".green, async function () {
        [owner, alice, bob, carol, dev, buyback, liquidity, treasury] = await ethers.getSigners();
        owner.name = "Owner"; alice.name = "Alice"; bob.name = "Bob"; carol.name = "Carol"; liquidity.name = "Liquidity"; treasury.name = "Treasury";
    
        console.log("\tOwner address: ".cyan, owner.address, "Balance: ".cyan, await ethers.provider.getBalance(owner.address)/1e18);
        console.log("\tAlice address: ".cyan, alice.address, "Balance: ".cyan, await ethers.provider.getBalance(alice.address)/1e18);
        console.log("\tBob address: ".cyan, bob.address, "Balance: ".cyan, await ethers.provider.getBalance(bob.address)/1e18);
        console.log("\tCarol address: ".cyan, carol.address, "Balance: ".cyan, await ethers.provider.getBalance(carol.address)/1e18);
  
        const { deploy } = deployments
        const { deployer, proxyOwner } = await getNamedAccounts()
        
        //========================== Deploy ============================
        console.log("\n\tDeploying contracts...".green);
    
        endpoint = await deploy("Endpoint", {
            from: deployer,
            args: [getEndpointId()],
            // if set it to true, will not attempt to deploy
            // even if the contract deployed under the same name is different
            skipIfAlreadyDeployed: true,
            log: true,
            waitConfirmations: 1,
        })
        consoleLogWithTab(`Endpoint ${getEndpointId()} is deployed at ${endpoint.address}`)


        layerZeroTokenMock = await deploy("LayerZeroTokenMock", {
            from: deployer,
            skipIfAlreadyDeployed: true,
            log: true,
            waitConfirmations: 1,
        })
        consoleLogWithTab(`LayerZeroTokenMock is deployed at ${layerZeroTokenMock.address}`)


        nonceContract = await deploy("NonceContract", {
            from: deployer,
            args: [endpoint.address],
            // if set it to true, will not attempt to deploy
            // even if the contract deployed under the same name is different
            skipIfAlreadyDeployed: true,
            log: true,
            waitConfirmations: 1,
        })
        consoleLogWithTab(`NonceContract is deployed at ${nonceContract.address}`)


        ultraLightNodeV2_wo_Validation = await deploy("UltraLightNodeV2_wo_Validation", {
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
            const layerZeroToken = await deployments.get("LayerZeroTokenMock")
            const ultraLightNode = await ethers.getContract("UltraLightNodeV2_wo_Validation")
            await (await ultraLightNode.setLayerZeroToken(layerZeroToken.address)).wait()
        }
        consoleLogWithTab(`UltraLightNodeV2_wo_Validation is deployed at ${ultraLightNodeV2_wo_Validation.address}`)


        treasury = await deploy("TreasuryV2", {
            // gasLimit: 30000000,
            from: deployer,
            args: [ultraLightNodeV2_wo_Validation.address],
            skipIfAlreadyDeployed: true,
            log: true,
            waitConfirmations: 1,
        })
    
        if (isTestnet()) {
            // set the treasury address so the UltraLightNode knows about it and can calc fees
            // ultraLightNode = await ethers.getContract("UltraLightNode")
            node = await ethers.getContract("UltraLightNodeV2_wo_Validation")
            await (await node.setTreasury(treasury.address)).wait()
        }
        consoleLogWithTab(`TreasuryV2 is deployed at ${treasury.address}`)


        exampleOFT = await deploy("ExampleOFT", {
            from: deployer,
            args: [endpoint.address],
            skipIfAlreadyDeployed: true,
            log: true,
            waitConfirmations: 1,
        })
        consoleLogWithTab(`ExampleOFT is deployed at ${exampleOFT.address}`)


        layerZeroOracleMock = await deploy("LayerZeroOracleMock", {
            // gasLimit:30000000,
            from: deployer,
            skipIfAlreadyDeployed: true,
            log: true,
            waitConfirmations: 1,
        })
        consoleLogWithTab(`layerZeroOracleMock is deployed at ${layerZeroOracleMock.address}`)


        omniCounter = await deploy("OmniCounter", {
            from: deployer,
            args: [endpoint.address],
            skipIfAlreadyDeployed: true,
            log: true,
            waitConfirmations: 1,
        })
        consoleLogWithTab(`NonceContract is deployed at ${omniCounter.address}`)


        pingPong = await deploy("PingPong", {
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
        // consoleLogWithTab(`send it [${eth}] ether | tx: ${tx.transactionHash}`)
        consoleLogWithTab(`PingPong is deployed at ${pingPong.address}`)


        ultraLightNodeV2_wo_Validation

        let gasLimit = 8000000
        if ([10010, 20010].includes(getEndpointId())) {
            gasLimit = 30000000 // arbitrum requires >8m
        }
        await deploy("Relayer", {
            gasLimit,
            from: deployer,
            skipIfAlreadyDeployed: true,
            log: true,
            waitConfirmations: 1,
            proxy: {
                owner: proxyOwner,
                proxyContract: "OptimizedTransparentProxy",
                execute: {
                    init: {
                        methodName: "initialize",
                        args: [ultraLightNodeV2_wo_Validation.address],
                    },
                },
            },
        })

    });
  
});


describe("====================== Stage 2: Mozaic contracts ======================\n".yellow, async function () {
    it("Mozaic contracts are deployed.\n".green, async function () {
        [owner, alice, bob, carol, dev, buyback, liquidity, treasury] = await ethers.getSigners();
        owner.name = "Owner"; alice.name = "Alice"; bob.name = "Bob"; carol.name = "Carol"; liquidity.name = "Liquidity"; treasury.name = "Treasury";
    
        console.log("\tOwner address: ".cyan, owner.address, "Balance: ".cyan, await ethers.provider.getBalance(owner.address)/1e18);
        console.log("\tAlice address: ".cyan, alice.address, "Balance: ".cyan, await ethers.provider.getBalance(alice.address)/1e18);
        console.log("\tBob address: ".cyan, bob.address, "Balance: ".cyan, await ethers.provider.getBalance(bob.address)/1e18);
        console.log("\tCarol address: ".cyan, carol.address, "Balance: ".cyan, await ethers.provider.getBalance(carol.address)/1e18);

        const { deploy } = deployments
        const { deployer, proxyOwner } = await getNamedAccounts()
        
        //========================== Deploy ============================

        nonceContract = await deploy("MozaicLP", {
            from: deployer,
            args: [endpoint.address],
            // if set it to true, will not attempt to deploy
            // even if the contract deployed under the same name is different
            skipIfAlreadyDeployed: true,
            log: true,
            waitConfirmations: 1,
        })
        consoleLogWithTab(`MozaicLP is deployed at ${nonceContract.address}`)

        assert(nMain < nVaults);

        const Vault = await ethers.getContractFactory("MozaicVault")
        for (i = 0; i < nVaults; i ++) {
            isMain = false;
            if(i == nMain) { isMain = true; }

            vault = await Vault.deploy(endpoint.address, isMain)
            // await vault.logAddress();
            consoleLogWithTab(`MozaicVault ${i} is deployed at ${vault.address}`)
            vaults.push(vault)
        }
    });
});


describe("====================== Stage 3: Setup vaults ======================\n".yellow, async function () {
    it("Mozaic contracts are deployed.\n".green, async function () {
        [owner, alice, bob, carol, dev, buyback, liquidity, treasury] = await ethers.getSigners();
        owner.name = "Owner"; alice.name = "Alice"; bob.name = "Bob"; carol.name = "Carol"; liquidity.name = "Liquidity"; treasury.name = "Treasury";
    
        console.log("\tOwner address: ".cyan, owner.address, "Balance: ".cyan, await ethers.provider.getBalance(owner.address)/1e18);
        console.log("\tAlice address: ".cyan, alice.address, "Balance: ".cyan, await ethers.provider.getBalance(alice.address)/1e18);
        console.log("\tBob address: ".cyan, bob.address, "Balance: ".cyan, await ethers.provider.getBalance(bob.address)/1e18);
        console.log("\tCarol address: ".cyan, carol.address, "Balance: ".cyan, await ethers.provider.getBalance(carol.address)/1e18);

        const { deploy } = deployments
        const { deployer, proxyOwner } = await getNamedAccounts()
        

        // set each contract source address so it can send to each other


        for (i = 0; i < nVaults; i ++) {
            srcChainId = parseInt(vaults[nMain].address.toString(16).slice(0, 4))
            path = ethers.utils.solidityPack(["address", "address"], [vaults[nMain].address, vaults[i].address])
            await consoleLogWithTab(`0 to ${i}: ${srcChainId}, ${path}`)
            await vaults[i].setTrustedRemote(srcChainId, path)

            srcChainId = parseInt(vaults[i].address.toString(16).slice(0, 4))
            path = ethers.utils.solidityPack(["address", "address"], [vaults[i].address, vaults[nMain].address])
            await consoleLogWithTab(`${i} to 0: ${srcChainId}, ${path}`)
            await vaults[nMain].setTrustedRemote(srcChainId, path)
        }

    });

});


// describe("====================== Stage 4: Start Relayer ======================\n".yellow, async function () {
//     it("Starting the Relayer ...\n".green, async function () {
//         await setInterval(RelayerRound, 1000)
//     });

// });

        const { deploy } = deployments
        const { deployer, proxyOwner } = await getNamedAccounts()
        

//     });

// });