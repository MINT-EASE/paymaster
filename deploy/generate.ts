import { Provider, Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as fs from "fs";
import * as readline from "readline";



// load wallet private key from env file
// const PRIVATE_KEY = "045a71309065d92d987010d97253ab26b0406f338b8de46a9c4f267d305c5d1fa";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getRecipientAddress(): Promise<string> {
  return new Promise((resolve, reject) => {
    rl.question(
      "Please provide the recipient address to receive an NFT: ",
      (address) => {
        if (!address) {
          reject("⛔️ RECIPIENT_ADDRESS not provided!");
        } else {
          resolve(address);
        }
      },
    );
  });
}

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the nft contract...`);
  console.log(
    `You first need to add a RECIPIENT_ADDRESS to mint the NFT to...`,
  );
  // We will mint the NFTs to this address
  const RECIPIENT_ADDRESS = await getRecipientAddress();
  if (!RECIPIENT_ADDRESS) throw "⛔️ RECIPIENT_ADDRESS not detected!";

  // It is assumed that this wallet already has sufficient funds on zkSync
    // Initialize the wallet.
  const wallet = new Wallet("45a71309065d92d987010d97253ab26b0406f338b8de46a9c4f267d305c5d1fa");

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  // Load contract
  const artifact = await deployer.loadArtifact("contracts/nft.sol:MyNFT");

  const nftContract = await deployer.deploy(artifact, []);

    console.log(`${artifact.contractName} was deployed to ${await nftContract.getAddress()}`);

  // Mint NFTs to the recipient address
  const nft = "Beach";
  const tx = await nftContract.mint(RECIPIENT_ADDRESS, nft);
  await tx.wait();
  console.log(`The ${nft} has been given to ${RECIPIENT_ADDRESS}`);

  // Get and log the balance of the recipient
  const balance = await nftContract.balanceOf(RECIPIENT_ADDRESS);
  console.log(`Balance of the recipient: ${balance}`);

  // Update base URI
//   let setBaseUriTransaction = await nftContract.setBaseURI(
//     "https://ipfs.io/ipfs/QmPtDtJEJDzxthbKmdgvYcLa9oNUUUkh7vvz5imJFPQdKx",
//   );
//   await setBaseUriTransaction.wait();
//   console.log(`New baseURI is ${await nftContract.baseURI()}`);

  // Verify contract programmatically
  //
  // Contract MUST be fully qualified name (e.g. path/sourceName:contractName)
  const contractFullyQualifedName = "contracts/nft.sol:MyNFT";
  const verificationId = await hre.run("verify:verify", {
    address: nftContract.getAddress(),
    contract: contractFullyQualifedName,
    constructorArguments: [],
    bytecode: artifact.bytecode,
  });
  console.log(
    `${contractFullyQualifedName} verified! VerificationId: ${verificationId}`,
  );

//   // Update frontend with contract address
//   const frontendConstantsFilePath =
//     __dirname + "/../../frontend/app/constants/consts.tsx";
//   const data = fs.readFileSync(frontendConstantsFilePath, "utf8");
//   const result = data.replace(/NFT-CONTRACT-ADDRESS/g, nftContract.address);
//   fs.writeFileSync(frontendConstantsFilePath, result, "utf8");

//   // Update paymaster deploy script with contract address
//   const paymasterDeploymentFilePath =
//     __dirname + "/deploy-ERC721GatedPaymaster.ts";
//   const res = fs.readFileSync(paymasterDeploymentFilePath, "utf8");
//   const final = res.replace(/NFT-CONTRACT-ADDRESS-HERE/g, nftContract.address);
//   fs.writeFileSync(paymasterDeploymentFilePath, final, "utf8");

  console.log(`Done!`);
}
