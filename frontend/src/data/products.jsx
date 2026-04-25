import iphoneImg from '../assets/iPhone-15-Pro.jpg';
import samsungImg from '../assets/S24Ultra.jpg';

const products = [
    {
        id: 1,
        slug: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        description: 'Premium Apple flagship smartphone with pro camera system, titanium design, and top-level performance.',
        price: 350000,
        oldPrice: 390000,
        stock: 'In Stock',
        rating: 4.8,
        reviews: 128,
        sold: 312,
        variant: 'Standard',
        images: [iphoneImg, iphoneImg, iphoneImg]
    },
    {
        id: 2,
        slug: 'samsung-s24-ultra',
        name: 'Samsung S24 Ultra',
        description: 'Luxury Samsung flagship device with advanced AI features, ultra camera performance, and premium display.',
        price: 420000,
        oldPrice: 470000,
        stock: 'In Stock',
        rating: 4.9,
        reviews: 156,
        sold: 280,
        variant: 'Standard',
        images: [samsungImg, samsungImg, samsungImg]
    }
];

export default products;
