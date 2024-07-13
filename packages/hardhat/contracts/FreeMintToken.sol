// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "erc721a/contracts/ERC721A.sol";

contract FreeMintToken is ERC721A {
    uint256 public constant USER_LIMIT = 100;
    uint256 public constant MAX_SUPPLY = 100_000;

    constructor() ERC721A("FreeMintToken", "FMT") {}

    function mint(address to, uint256 quantity) external {
        require(
            _totalMinted() + quantity <= MAX_SUPPLY,
            "Not more supply left"
        );
        require(
            _numberMinted(to) + quantity <= USER_LIMIT,
            "User limit reached"
        );
        _mint(to, quantity);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "ipfs://QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo/";
    }
}
