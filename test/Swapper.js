const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Swapper", function () {
    async function deploySwapperFixture() {
        const [owner] = await ethers.getSigners();
        const TOKEN_AMOUNT = ethers.utils.parseUnits("1000000", 18);

        const FermatToken = await hre.ethers.getContractFactory("FermatToken");
        const EulerToken = await hre.ethers.getContractFactory("EulerToken");
        const GaussToken = await hre.ethers.getContractFactory("GaussToken");
        const Swapper = await hre.ethers.getContractFactory("Swapper");

        const tokenFRM = await FermatToken.deploy();
        const tokenELR = await EulerToken.deploy();
        const tokenGAU = await GaussToken.deploy();
        const swapper = await Swapper.deploy(tokenFRM.address);

        await tokenFRM.approve(swapper.address, TOKEN_AMOUNT);
        await tokenELR.approve(swapper.address, TOKEN_AMOUNT);
        await tokenGAU.approve(swapper.address, TOKEN_AMOUNT);

        return { owner, tokenFRM, tokenELR, tokenGAU, swapper, TOKEN_AMOUNT }
    }

    it("should initalize minter role and mint FRM in the Swapper contract", async function () {
        const { tokenFRM, swapper } = await loadFixture(deploySwapperFixture);

        // expect(await swapper.tokenFRM()).to.equal(tokenFRM.address);

        await tokenFRM.init(swapper.address);
        
        const minterRole = await tokenFRM.MINTER_ROLE();

        expect(await tokenFRM.hasRole(minterRole, swapper.address)).to.equal(true);
    });

    it("should add initial liquidty to swapper", async function () {
        const { tokenFRM, tokenELR, swapper, TOKEN_AMOUNT } = await loadFixture(deploySwapperFixture);

        await tokenFRM.init(swapper.address);
        await swapper.mintFRM();
        await swapper.init(tokenELR.address, TOKEN_AMOUNT);

        expect(await tokenELR.balanceOf(swapper.address)).to.equal(TOKEN_AMOUNT);
    });

    it("should swap tokens based on given amount", async function () {
        const { owner, tokenFRM, tokenELR, swapper, TOKEN_AMOUNT } = await loadFixture(deploySwapperFixture);
        const swapAmountOfELR = ethers.utils.parseUnits("100", 18);

        await tokenFRM.init(swapper.address);
        await swapper.mintFRM();
        await swapper.init(tokenELR.address, TOKEN_AMOUNT);

        await tokenELR.approve(swapper.address, swapAmountOfELR);
        await swapper.swap(tokenELR.address, swapAmountOfELR);

        expect(await tokenFRM.balanceOf(owner.address)).to.equal(swapAmountOfELR);
    });

    it("should unswap tokens based on given amount", async function() {
        const { owner, tokenFRM, tokenGAU, swapper, TOKEN_AMOUNT } = await loadFixture(deploySwapperFixture);
        const swapAmountOfGAU = ethers.utils.parseUnits("100", 18);
        const someAmount = ethers.utils.parseUnits("50", 18);

        await tokenFRM.init(swapper.address);
        await swapper.mintFRM();
        await swapper.init(tokenGAU.address, TOKEN_AMOUNT);

        await tokenGAU.approve(swapper.address, swapAmountOfGAU);
        await swapper.swap(tokenGAU.address, swapAmountOfGAU);

        await swapper.unswap(tokenGAU.address, someAmount);

        expect(await tokenFRM.balanceOf(owner.address)).to.equal(someAmount);
    });

    it("should set a new price for FRM", async function() {
        const { swapper } = await loadFixture(deploySwapperFixture);

        await swapper.setPriceFRM(2);
        
        const priceOfFRM = await swapper.getPriceFRM();

        expect(priceOfFRM).to.equal(ethers.utils.parseUnits("2", 18));
    });
});