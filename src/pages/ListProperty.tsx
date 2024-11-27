import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "../components/ui/use-toast";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import contractABI from "../contracts/EstateETH.json";
import axios from "axios";

const ListProperty = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    bedrooms: "",
    propertyType: "",
    kitchens: "",
    image: null as File | null,
  });
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
        },
      }
    );

    return response.data.IpfsHash;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.image) {
        throw new Error("Please select an image");
      }

      const imageHash = await handleImageUpload(formData.image);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      const priceInWei = ethers.utils.parseEther(formData.price);
      const tx = await contract.listProperty(
        formData.name,
        formData.location,
        priceInWei,
        imageHash,
        parseInt(formData.bedrooms),
        formData.propertyType,
        parseInt(formData.kitchens)
      );

      await tx.wait();

      toast({
        title: "Success",
        description: "Property listed successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        location: "",
        price: "",
        bedrooms: "",
        propertyType: "",
        kitchens: "",
        image: null,
      });
    } catch (error) {
      console.error("Error listing property:", error);
      toast({
        title: "Error",
        description: "Failed to list property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">List Your Property</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Property Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="bg-white/10 text-white"
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
              className="bg-white/10 text-white"
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Price (ETH)"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              className="bg-white/10 text-white"
            />
            <Input
              type="number"
              placeholder="Number of Bedrooms"
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: e.target.value })
              }
              required
              className="bg-white/10 text-white"
            />
            <Input
              placeholder="Property Type"
              value={formData.propertyType}
              onChange={(e) =>
                setFormData({ ...formData, propertyType: e.target.value })
              }
              required
              className="bg-white/10 text-white"
            />
            <Input
              type="number"
              placeholder="Number of Kitchens"
              value={formData.kitchens}
              onChange={(e) =>
                setFormData({ ...formData, kitchens: e.target.value })
              }
              required
              className="bg-white/10 text-white"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files ? e.target.files[0] : null,
                })
              }
              required
              className="bg-white/10 text-white"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? "Listing Property..." : "List Property"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ListProperty;