import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { PropertyCard } from "../components/PropertyCard";
import { useToast } from "../components/ui/use-toast";
import * as contractABI from "../contracts/EstateETH.json";
import { Property } from "../types";

const BuyProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProperties = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        contractABI.abi,
        provider
      );

      const allProperties = await contract.getAllProperties();
      if (!allProperties) {
        setProperties([]);
        return;
      }

      const formattedProperties = allProperties.map((prop: any) => ({
        id: Number(prop.id),
        owner: prop.owner,
        name: prop.name,
        location: prop.location,
        price: prop.price.toString(),
        imageHash: prop.imageHash,
        bedrooms: Number(prop.bedrooms),
        propertyType: prop.propertyType,
        kitchens: Number(prop.kitchens),
        isSold: prop.isSold
      }));
      
      setProperties(formattedProperties);
    } catch (error) {
      console.error("Error loading properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (property: Property) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      const tx = await contract.buyProperty(property.id, {
        value: property.price,
      });
      await tx.wait();

      toast({
        title: "Success",
        description: "Property purchased successfully!",
      });

      loadProperties();
    } catch (error) {
      console.error("Error buying property:", error);
      toast({
        title: "Error",
        description: "Failed to buy property",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-8 text-white">Available Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id.toString()}
            property={property}
            onBuy={() => handleBuy(property)}
            showBuyButton={true}
          />
        ))}
      </div>
    </div>
  );
};

export default BuyProperties;