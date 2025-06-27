export const menuItems = [
  {
    id: 1,
    name: "Pizza mozzarella",
    price: 40000,
    image: "https://i.pinimg.com/736x/10/80/e1/1080e106159ba6b4121bde7f266a09f1.jpg",
    category: "Pizza",
    description: "Delicious pizza with fresh mozzarella cheese, tomato sauce, and herbs",
    ingredients: ["Mozzarella cheese", "Tomato sauce", "Fresh basil", "Olive oil"]
  },
  {
    id: 2,
    name: "Burger Beef Cheese",
    price: 50500,
    image: "/images/burger-beef-cheese.jpg",
    category: "Burger",
    description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce",
    ingredients: ["Beef patty", "Cheese", "Lettuce", "Tomato", "Special sauce", "Sesame bun"]
  },
  {
    id: 3,
    name: "Hotdog sausage",
    price: 45500,
    image: "/images/hotdog-sausage.jpg",
    category: "Hotdog",
    description: "Grilled sausage in a soft bun with mustard, ketchup, and fresh vegetables",
    ingredients: ["Grilled sausage", "Soft bun", "Mustard", "Ketchup", "Onions", "Pickles"]
  },
  {
    id: 4,
    name: "Croisant with egg",
    price: 40000,
    image: "/images/croissant-egg.jpg",
    category: "Breakfast",
    description: "Buttery croissant filled with scrambled eggs, cheese, and fresh herbs",
    ingredients: ["Croissant", "Scrambled eggs", "Cheese", "Fresh herbs", "Butter"]
  },
  {
    id: 5,
    name: "Burger double beef",
    price: 60000,
    image: "/images/burger-double-beef.jpg",
    category: "Burger",
    description: "Double beef patties with cheese, lettuce, tomato, and our signature sauce",
    ingredients: ["Double beef patties", "Cheese", "Lettuce", "Tomato", "Signature sauce", "Sesame bun"]
  }
];

export const promotions = [
  {
    id: 1,
    title: "SELASA KENYANG",
    subtitle: "Burger Kenyang",
    description: "BERLAKU HINGGA 12 JUNI 2025",
    discount: "25%",
    src: "/images/food1.png",
    validUntil: "2025-06-12"
  }
];

export const categories = [
  { id: 1, name: "All", slug: "all" },
  { id: 2, name: "Burger", slug: "burger" },
  { id: 3, name: "Pizza", slug: "pizza" },
  { id: 4, name: "Hotdog", slug: "hotdog" },
  { id: 5, name: "Breakfast", slug: "breakfast" }
];
