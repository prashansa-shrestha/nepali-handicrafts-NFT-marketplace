const { ethers, upgrades } = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

async function main() {
  console.log("Beginning deployment process...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Deploy core contracts
  console.log("\nDeploying core contracts...");
  
  // 1. Deploy ArtisanRegistry
  const ArtisanRegistry = await ethers.getContractFactory("ArtisanRegistry");
  const artisanRegistry = await upgrades.deployProxy(ArtisanRegistry, [], {
    initializer: "initialize",
  });
  await artisanRegistry.deployed();
  console.log("ArtisanRegistry deployed to:", artisanRegistry.address);
  
  // 2. Deploy ListingManager
  const ListingManager = await ethers.getContractFactory("ListingManager");
  const listingManager = await upgrades.deployProxy(ListingManager, [artisanRegistry.address], {
    initializer: "initialize",
  });
  await listingManager.deployed();
  console.log("ListingManager deployed to:", listingManager.address);
  
  // 3. Deploy TokenManager
  const TokenManager = await ethers.getContractFactory("TokenManager");
  const tokenManager = await upgrades.deployProxy(TokenManager, [], {
    initializer: "initialize",
  });
  await tokenManager.deployed();
  console.log("TokenManager deployed to:", tokenManager.address);
  
  // 4. Deploy TransactionProcessor
  const TransactionProcessor = await ethers.getContractFactory("TransactionProcessor");
  const transactionProcessor = await upgrades.deployProxy(
    TransactionProcessor,
    [listingManager.address, tokenManager.address],
    { initializer: "initialize" }
  );
  await transactionProcessor.deployed();
  console.log("TransactionProcessor deployed to:", transactionProcessor.address);
  
  // Deploy governance contracts
  console.log("\nDeploying governance contracts...");
  
  // 5. Deploy Controllers
  const VerificationController = await ethers.getContractFactory("VerificationController");
  const verificationController = await upgrades.deployProxy(VerificationController, [], {
    initializer: "initialize",
  });
  
  const FeeController = await ethers.getContractFactory("FeeController");
  const feeController = await upgrades.deployProxy(FeeController, [], {
    initializer: "initialize",
  });
  
  // Setup contract relationships
  console.log("\nSetting up contract relationships...");
  
  await listingManager.setTransactionProcessor(transactionProcessor.address);
  await artisanRegistry.setVerificationController(verificationController.address);
  await verificationController.setFeeController(feeController.address);
  
  // Export deployment addresses
  const deploymentInfo = {
    ArtisanRegistry: {
      proxy: artisanRegistry.address,
      implementation: await getImplementationAddress(ethers.provider, artisanRegistry.address),
    },
    ListingManager: {
      proxy: listingManager.address,
      implementation: await getImplementationAddress(ethers.provider, listingManager.address),
    },
    TokenManager: {
      proxy: tokenManager.address,
      implementation: await getImplementationAddress(ethers.provider, tokenManager.address),
    },
    TransactionProcessor: {
      proxy: transactionProcessor.address,
      implementation: await getImplementationAddress(ethers.provider, transactionProcessor.address),
    },
    VerificationController: {
      proxy: verificationController.address,
      implementation: await getImplementationAddress(ethers.provider, verificationController.address),
    },
    FeeController: {
      proxy: feeController.address,
      implementation: await getImplementationAddress(ethers.provider, feeController.address),
    },
    network: network.name,
    deployer: deployer.address,
  };

  // Save deployment info
  const fs = require('fs');
  const deploymentPath = `deployments/${network.name}.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to ${deploymentPath}`);
  
  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });