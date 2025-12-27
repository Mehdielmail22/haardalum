export interface DimensionOption {
  id: number;
  dimension: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  // price is now optional if dimensionsOptions is present
  price?: number;
  dimensionsOptions?: DimensionOption[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Round Aluminum Tubing (.038\" Wall)",
    description: "High-tolerance round aluminum tubing, ideal for telescopic applications. Available in various diameters. Perfect for displays, frameworks, and custom projects. Lightweight and corrosion-resistant.",
    imageUrl: "https://www.zhenhantl.com/wp-content/uploads/2024/10/555.jpg",
    dimensionsOptions: [
      { id: 1, dimension: "3/8\" Diameter", price: 35.50 },
      { id: 2, dimension: "1/2\" Diameter", price: 40.00 },
      { id: 3, dimension: "5/8\" Diameter", price: 45.50 },
      { id: 4, dimension: "3/4\" Diameter", price: 50.00 },
      { id: 5, dimension: "1\" Diameter", price: 55.50 },
    ],
  },
  {
    id: 2,
    name: "Square Aluminum Tubing (1\" x 1\")",
    description: "Versatile 1-inch square aluminum tubing for structural applications, machine building, and custom fabrications. Offers excellent strength-to-weight ratio and easy workability.",
    imageUrl: "https://www.zhenhantl.com/wp-content/uploads/2024/10/2-Series-Aluminum-Alloy-Bars-1234.jpg",
    dimensionsOptions: [
      { id: 6, dimension: "1\" x 1\" x 24\"", price: 42.00 },
      { id: 7, dimension: "1\" x 1\" x 48\"", price: 58.00 },
      { id: 8, dimension: "1\" x 1\" x 72\"", price: 75.00 },
    ],
  },
  {
    id: 3,
    name: "Aluminum L Angle (2\" x 2\" x 0.2\")",
    description: "Heavy-duty aluminum L angle extrusion, perfect for corner protection, structural support, and architectural trim. Resistant to rust and durable for indoor and outdoor use.",
    imageUrl: "https://www.zhenhantl.com/wp-content/uploads/2024/10/6-Series-Aluminum-Alloy-Bars-5.jpg",
    dimensionsOptions: [
      { id: 9, dimension: "2\" x 2\" x 0.2\" x 24\"", price: 28.75 },
      { id: 10, dimension: "2\" x 2\" x 0.2\" x 48\"", price: 48.25 },
    ],
  },
  {
    id: 4,
    name: "Aluminum Slatwall (1\" On-Center)",
    description: "Double-sided aluminum slatwall for retail displays, workshops, and storage solutions. Features 1\" on-center slots for maximum versatility with accessories.",
    imageUrl: "https://www.zhenhantl.com/wp-content/uploads/2024/10/1-2.png",
    dimensionsOptions: [
      { id: 11, dimension: "48\" Length", price: 75.00 },
      { id: 12, dimension: "72\" Length", price: 110.00 },
    ],
  },
  {
    id: 5,
    name: "Telescopic Tubing Lock (L Lever Style)",
    description: "L-Lever style telescopic tubing lock for secure and easy adjustment of round or square tubing assemblies. Provides a strong grip and quick release action.",
    price: 15.20,
    imageUrl: "https://www.zhenhantl.com/wp-content/uploads/2024/10/Custom-Aluminum-Profiles-1.jpg",
  },
  {
    id: 6,
    name: "Plastic Tubing End Cap (Round 1.5\")",
    description: "Durable plastic end cap for 1.5-inch round aluminum tubing. Provides a clean finish, protects against sharp edges, and prevents debris entry.",
    price: 3.50,
    imageUrl: "https://www.zhenhantl.com/wp-content/uploads/2024/10/%E6%9C%AA%E6%A0%87%E9%A2%98-333.jpg",
  },
  {
    id: 7,
    name: "Aluminum Rod (1/2\" Diameter)",
    description: "Solid 1/2-inch diameter aluminum rod, suitable for machining, fabrication, and structural bracing. High strength and excellent corrosion resistance.",
    imageUrl: "https://www.zhenhantl.com/wp-content/uploads/2024/10/66cecb68b1d00.png",
    dimensionsOptions: [
      { id: 13, dimension: "12\" Length", price: 18.00 },
      { id: 14, dimension: "24\" Length", price: 32.00 },
      { id: 15, dimension: "36\" Length", price: 45.00 },
    ],
  },
  {
    id: 8,
    name: "Aluminum Rectangular Tubing (0.75\" x 1.5\")",
    description: "Lightweight and strong rectangular aluminum tubing. Ideal for custom frames, railings, and various construction projects requiring precise dimensions.",
    imageUrl: "https://www.zhenhantl.com/wp-content/uploads/2024/10/4567.jpg",
    dimensionsOptions: [
      { id: 16, dimension: "24\" Length", price: 29.95 },
      { id: 17, dimension: "48\" Length", price: 52.50 },
      { id: 18, dimension: "72\" Length", price: 78.00 },
    ],
  },
];
