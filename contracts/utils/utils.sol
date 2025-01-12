// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Constants
/// @notice System-wide constants for the marketplace
contract Constants {
    // Platform fees (in basis points)
    uint16 public constant PLATFORM_FEE_BP = 250; // 2.5%
    uint16 public constant ARTISAN_ROYALTY_BP = 1000; // 10%

    // Timeouts and durations
    uint256 public constant BID_TIMEOUT = 24 hours;
    uint256 public constant VERIFICATION_TIMEOUT = 72 hours;
    uint256 public constant MIN_LISTING_DURATION = 1 hours;
    uint256 public constant MAX_LISTING_DURATION = 30 days;

    // Limits
    uint256 public constant MAX_BATCH_SIZE = 50;
    uint256 public constant MAX_CATEGORIES_PER_LISTING = 5;
    uint256 public constant MAX_IMAGES_PER_LISTING = 10;

    // Minimum amounts
    uint256 public constant MIN_LISTING_PRICE = 0.001 ether;
    uint256 public constant MIN_BID_INCREMENT = 0.01 ether;

    // Storage slots (for upgradeable contracts)
    bytes32 public constant ADMIN_SLOT = keccak256("marketplace.admin");
    bytes32 public constant IMPLEMENTATION_SLOT =
        keccak256("marketplace.implementation");
}

/// @title Roles
/// @notice Role definitions for access control
contract Roles {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ARTISAN_ROLE = keccak256("ARTISAN_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

    // Role combinations
    bytes32 public constant ADMIN_AND_OPERATOR =
        keccak256(abi.encodePacked(ADMIN_ROLE, OPERATOR_ROLE));

    // Role hierarchy levels
    uint8 public constant ADMIN_LEVEL = 0;
    uint8 public constant OPERATOR_LEVEL = 1;
    uint8 public constant MODERATOR_LEVEL = 2;
}

/// @title Errors
/// @notice Custom error definitions
contract Errors {
    // General errors
    error Unauthorized();
    error InvalidAddress();
    error InvalidAmount();
    error InvalidParameters();
    error ContractPaused();

    // Listing errors
    error ListingNotFound();
    error ListingExpired();
    error ListingNotActive();
    error InsufficientQuantity();
    error InvalidListingPrice();

    // Transaction errors
    error TransactionFailed();
    error InsufficientFunds();
    error PaymentFailed();
    error RefundFailed();

    // Verification errors
    error VerificationPending();
    error VerificationFailed();
    error AlreadyVerified();

    // Bidding errors
    error BidTooLow();
    error BidExpired();
    error InvalidBidder();

    // Upgrade errors
    error InvalidImplementation();
    error UpgradeFailed();
}
