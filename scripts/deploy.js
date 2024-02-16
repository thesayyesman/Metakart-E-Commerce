const { ethers } = require("hardhat")
const { items } = require("../items.json")

const tokens = (n) => {
    return ethers.parseEther(n.toString())
}

async function main() {
    const [deployer] = await ethers.getSigners()

    const Contract = await ethers.getContractFactory("Metakart")
    const contract = await Contract.deploy()

    console.log(`Deployed at ${contract.target}`)
    for (let i = 0; i < items.length; i++) {
        const transaction = await contract
            .connect(deployer)
            .list(
                items[i].id,
                items[i].name,
                items[i].category,
                items[i].image,
                tokens(items[i].price),
                items[i].rating,
                items[i].stock
            )
        await transaction.wait()
        console.log(`Listed item ${items[i].id}: ${items[i].name}`)
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
