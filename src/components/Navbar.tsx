import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export const Navbar = () => {
  const [account, setAccount] = useState<string>("");

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkWallet();
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-md z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">
            EstateETH
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/buy"
              className="text-white hover:text-purple-300 transition-colors"
            >
              Buy Properties
            </Link>
            <Link
              to="/list"
              className="text-white hover:text-purple-300 transition-colors"
            >
              List Property
            </Link>
          
            <Button
              onClick={connectWallet}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};