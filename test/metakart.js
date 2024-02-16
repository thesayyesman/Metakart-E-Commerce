const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
    return ethers.parseEther(n.toString())
}

describe("Metakart", () => {
    let contract
    let deployer, buyer

    let transaction
    const ID = 1
    const NAME = "Shoes"
    const CATEGORY = "Clothing"
    const IMAGE = "https://photuu.com"
    const COST = tokens(1)
    const RATING = 4
    const STOCK = 500

    beforeEach(async () => {
        ;[deployer, buyer] = await ethers.getSigners()

        const Contract = await ethers.getContractFactory("Metakart")
        contract = await Contract.deploy()
    })

    describe("Deployment", () => {
        it("Sets the owner", async () => {
            expect(await contract.owner()).to.equal(deployer.address)
        })
    })

    describe("Listing", () => {
        beforeEach(async () => {
            transaction = await contract
                .connect(deployer)
                .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
            await transaction.wait()
        })

        it("Returns the attribute", async () => {
            const item = await contract.items(ID)
            expect(item.id).to.equal(ID)
            expect(item.name).to.equal(NAME)
            expect(item.category).to.equal(CATEGORY)
            expect(item.image).to.equal(IMAGE)
            expect(item.cost).to.equal(COST)
            expect(item.rating).to.equal(RATING)
            expect(item.stock).to.equal(STOCK)
        })

        it("Emits List event", async () => {
            expect(transaction).to.emit(contract, "List")
        })
    })

    describe("Buying", () => {
        beforeEach(async () => {
            transaction = await contract
                .connect(deployer)
                .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
            await transaction.wait()
            transaction = await contract.connect(buyer).buy(ID, { value: COST })
        })
        it("check if it is paying correctly", async () => {
            const result = await ethers.provider.getBalance(contract.target) // Here, we're using "target" instead of "address".
            expect(result).to.equal(COST)
        })
        it("Updates buyer's order count.", async () => {
            const result = await contract.orderCount(buyer.address)
            expect(result).to.equal(1)
        })
        it("Adds the order", async () => {
            const order = await contract.orders(buyer.address, 1)
            expect(order.item.name).to.equal(NAME)
            expect(order.time).to.be.greaterThan(0)
        })
        it("Emits Buy event", async () => {
            expect(transaction).to.emit(contract, "Buy")
        })
    })

    describe("Withdrawing", () => {
        let balanceBefore
        beforeEach(async () => {
            transaction = await contract
                .connect(deployer)
                .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
            await transaction.wait()
            transaction = await contract.connect(buyer).buy(ID, { value: COST })
            await transaction.wait()

            balanceBefore = await ethers.provider.getBalance(deployer.address)

            transaction = await contract.connect(deployer).withdraw()
            await transaction.wait()
        })
        it("Updates the owner balance", async () => {
            const balanceAfter = await ethers.provider.getBalance(deployer.address)
            expect(balanceAfter).to.be.greaterThan(balanceBefore)
        })
        it("Updates the contract balance", async () => {
            const result = await ethers.provider.getBalance(contract.target)
            expect(result).to.be.equal(0)
        })
    })
})
