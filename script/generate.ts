import { utils, Wallet } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script`);

  // Initialize the wallet.
  const wallet = new Wallet("45a71309065d92d987010d97253ab26b0406f338b8de46a9c4f267d305c5d1fa");

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  // Load contract
  const artifact = await deployer.loadArtifact("MyNFT");

  // Deploy this contract. The returned object will be of a `Contract` type,
  // similar to the ones in `ethers`.
    
  // `greeting` is an argument for contract constructor.
  const nftContract = await deployer.deploy(artifact);

  // Show the contract info.
  console.log(`${artifact.contractName} was deployed to ${await nftContract.getAddress()}`);
}
