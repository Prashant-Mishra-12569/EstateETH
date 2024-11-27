import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { PropertyCard } from "../components/PropertyCard";
import { useToast } from "../components/ui/use-toast";
import contractABI from "../contracts/EstateETH.json";
import { Property } from "../types";

const Profile = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadMyProperties = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        contractABI.abi,
        provider
      );

      const myProperties = await contract.getMyProperties();
      setProperties(myProperties);
    } catch (error) {
      console.error("Error loading properties:", error);
      toast({
        title: "Error",
        description: "Failed to load your properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-8 text-white">My Properties</h1>
      {properties.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">
          You haven't listed any properties yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id.toString()} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;