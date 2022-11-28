const hre = require("hardhat");

async function main() {
  const FermatToken = await hre.ethers.getContractFactory("FermatToken");
  const EulerToken = await hre.ethers.getContractFactory("EulerToken");
  const GaussToken = await hre.ethers.getContractFactory("GaussToken");
  const Swapper = await hre.ethers.getContractFactory("Swapper");

  const [deployer] = await ethers.getSigners();

  const tokenFRM = await FermatToken.deploy();
  const tokenELR = await EulerToken.deploy();
  const tokenGAU = await GaussToken.deploy();
  const swapper = await Swapper.deploy(tokenFRM.address);

  console.log(`Contract Deployed by Account %s \n \n`, deployer.address);
  console.log(`FermatToken Contract deployed to ${tokenFRM.address}`);
  console.log(`EulerToken Contract deployed to ${tokenELR.address}`);
  console.log(`GaussToken Contract deployed to ${tokenGAU.address}`);
  console.log(`Swapper Contract deployed to ${swapper.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// FermatToken Contract deployed to 0xd0bd41a648Eda8Eac90ddF6B9b1E4B1851164b8E
// EulerToken Contract deployed to 0xe51b7483c9be81797505Fdb003fC4e7C45f9ef77
// GaussToken Contract deployed to 0x91CC1FA9A2fc82Ef81b4AafefAF27B616Cf46D74
// Swapper Contract deployed to 0x33D13222157BC6b8Ad5fF27f18AecA1f53c746e1