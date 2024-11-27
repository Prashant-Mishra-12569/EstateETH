import { Property } from "../types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ethers } from "ethers";

interface PropertyCardProps {
  property: Property;
  onBuy?: () => void;
  showBuyButton?: boolean;
}

export const PropertyCard = ({
  property,
  onBuy,
  showBuyButton = false,
}: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 bg-white/10 backdrop-blur-lg border-purple-500/20">
      <div className="relative">
        <img
          src={`https://gateway.pinata.cloud/ipfs/${property.imageHash}`}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        {!property.isSold && (
          <Badge className="absolute top-2 right-2 bg-green-500">For Sale</Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{property.name}</h3>
        <p className="text-gray-300 mb-2">{property.location}</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-purple-300">
            <span className="font-medium">{property.bedrooms}</span> Bedrooms
          </div>
          <div className="text-purple-300">
            <span className="font-medium">{property.kitchens}</span> Kitchens
          </div>
          <div className="text-purple-300 col-span-2">
            Type: {property.propertyType}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-white">
            {ethers.utils.formatEther(property.price)} ETH
          </p>
          {showBuyButton && !property.isSold && (
            <button
              onClick={onBuy}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};