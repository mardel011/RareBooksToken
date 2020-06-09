// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';

abstract contract BookToken is ERC721 {
    
         struct Book {
            string title;
            string authorName;
            uint256 year;
            string condition;
            uint256 price;
        }
    

    Book[] public books;
    address public storeOwner;
     
       constructor() public {
        storeOwner = msg.sender; 
    }
    
    
    modifier onlyOwner {
        require(storeOwner == msg.sender, "Not Store Owner");
        _;
    }
    
    mapping (address => EnumerableSet.UintSet) private _holderTokens;

    // Enumerable mapping from token ids to their owners
    EnumerableMap.UintToAddressMap private _tokenOwners;

    // Mapping from token ID to approved address
    mapping (uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) private _operatorApprovals;

   function createNewBooks(
       address _to, 
        string memory _title,
        string memory _authorName,
        uint _year,
        string memory _condition,
        uint _price
       ) 
       public onlyOwner {
        uint id = books.length;
        books.push(Book(_title, _authorName, _year, _condition, _price));
       _safeMint(_to, id);
}

    //view # of books in posession of a certain address
    function balanceOf(address owner) public view override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");

        return _holderTokens[owner].length();
    }
    //view address of a book
    function ownerOf(uint256 tokenId) public view override returns (address) {
        return _tokenOwners.get(tokenId, "ERC721: owner query for nonexistent token");
    }

    //asking for approval
    function getApproved(uint256 tokenId) public view override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    //allows approval of transferring a specific book to a specific non-owner address
    function approve(address to, uint256 tokenId) public virtual override onlyOwner {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        approve(to, tokenId);
    }

    //owner or approved individuals who can transfer books between addresses
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    //approval in lieu of owner for all books
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != _msgSender(), "ERC721: approve to caller");

        _operatorApprovals[_msgSender()][operator] = approved;
        emit ApprovalForAll(_msgSender(), operator, approved);
    }
    

     function _safeMint(address to, uint256 tokenId) internal override virtual {
        _safeMint(to, tokenId, "");
    }

}