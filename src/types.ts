export interface Property {
  id: number;
  owner: string;
  name: string;
  location: string;
  price: number;
  imageHash: string;
  bedrooms: number;
  propertyType: string;
  kitchens: number;
  isSold: boolean;
}