// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EstateETH {
    struct Property {
        uint256 id;
        address owner;
        string name;
        string location;
        uint256 price;
        string imageHash;
        uint8 bedrooms;
        string propertyType;
        uint8 kitchens;
        bool isSold;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;

    event PropertyListed(uint256 indexed id, address owner, uint256 price);
    event PropertySold(uint256 indexed id, address oldOwner, address newOwner, uint256 price);

    function listProperty(
        string memory _name,
        string memory _location,
        uint256 _price,
        string memory _imageHash,
        uint8 _bedrooms,
        string memory _propertyType,
        uint8 _kitchens
    ) public {
        propertyCount++;
        properties[propertyCount] = Property(
            propertyCount,
            msg.sender,
            _name,
            _location,
            _price,
            _imageHash,
            _bedrooms,
            _propertyType,
            _kitchens,
            false
        );

        emit PropertyListed(propertyCount, msg.sender, _price);
    }

    function buyProperty(uint256 _id) public payable {
        Property storage property = properties[_id];
        require(!property.isSold, "Property already sold");
        require(msg.sender != property.owner, "Owner cannot buy own property");
        require(msg.value == property.price, "Incorrect amount sent");

        address payable oldOwner = payable(property.owner);
        property.owner = msg.sender;
        property.isSold = true;
        oldOwner.transfer(msg.value);

        emit PropertySold(_id, oldOwner, msg.sender, property.price);
    }

    function getProperty(uint256 _id) public view returns (Property memory) {
        return properties[_id];
    }

    function getAllProperties() public view returns (Property[] memory) {
        Property[] memory allProperties = new Property[](propertyCount);
        for (uint256 i = 1; i <= propertyCount; i++) {
            allProperties[i - 1] = properties[i];
        }
        return allProperties;
    }

    function getMyProperties() public view returns (Property[] memory) {
        uint256 myPropertyCount = 0;
        for (uint256 i = 1; i <= propertyCount; i++) {
            if (properties[i].owner == msg.sender) {
                myPropertyCount++;
            }
        }

        Property[] memory myProperties = new Property[](myPropertyCount);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= propertyCount; i++) {
            if (properties[i].owner == msg.sender) {
                myProperties[currentIndex] = properties[i];
                currentIndex++;
            }
        }
        return myProperties;
    }
}