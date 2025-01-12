
// deployment/upgrade.js
const { ethers, upgrades } = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

async function main() {
  console.log("Beginning upgrade process...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account:", deployer.address);

  // Load deployment info
  const fs = require('fs');
  const deploymentPath = `deployments/${network.name}.json`;
  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath));

  // Upgrade core contracts
  console.log("\nUpgrading core contracts...");

  // 1. Upgrade ArtisanRegistry
  const ArtisanRegistry = await ethers.getContractFactory("ArtisanRegistry");
  const artisanRegistry = await upgrades.upgradeProxy(
    deploymentInfo.ArtisanRegistry.proxy,
    ArtisanRegistry
  );
  console.log("ArtisanRegistry upgraded");

  // 2. Upgrade ListingManager
  const ListingManager = await ethers.getContractFactory("ListingManager");
  const listingManager = await upgrades.upgradeProxy(
    deploymentInfo.ListingManager.proxy,
    ListingManager
  );
  console.log("ListingManager upgraded");

  // 3. Upgrade TokenManager
  const TokenManager = await ethers.getContractFactory("TokenManager");
  const tokenManager = await upgrades.upgradeProxy(
    deploymentInfo.TokenManager.proxy,
    TokenManager
  );
  console.log("TokenManager upgraded");

  // Update deployment info
  const updatedDeploymentInfo = {
    ...deploymentInfo,
    ArtisanRegistry: {
      ...deploymentInfo.ArtisanRegistry,
      implementation: await getImplementationAddress(ethers.provider, artisanRegistry.address),
    },
    ListingManager: {
      ...deploymentInfo.ListingManager,
      implementation: await getImplementationAddress(ethers.provider, listingManager.address),
    },
    TokenManager: {
      ...deploymentInfo.TokenManager,
      implementation: await getImplementationAddress(ethers.provider, tokenManager.address),
    },
    upgradeInfo: {
      timestamp: new Date().toISOString(),
      upgrader: deployer.address,
    },
  };

  // Save updated deployment info
  fs.writeFileSync(deploymentPath, JSON.stringify(updatedDeploymentInfo, null, 2));
  console.log(`\nUpgrade info saved to ${deploymentPath}`);
  
  return updatedDeploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });