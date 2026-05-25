import type { Product, Order, OrderStatus } from "@/types";

// Helper — seed products start with no custom images (empty array = use picsum fallback)
const noImages = [] as Product["images"];

export const PRODUCTS: Product[] = [
  { id:1,  name:"Obsidian Transit Pro",      slug:"obsidian-transit-pro",      price:349, originalPrice:420,  category:"Travel",  material:"Full-Grain Leather", color:"Midnight Black", size:"Large",  capacity:45, laptopFit:'17"', tags:["Travel","Leather","Waterproof","Premium"],     stock:8,  rating:4.9, reviewCount:142, trending:true,  featured:true,  description:"Built for the relentless traveler. Full-grain leather that ages beautifully, TSA-approved dimensions, and interior organization that rivals a filing cabinet.", imageId:10,  images:noImages },
  { id:2,  name:"Atlas Weekender",           slug:"atlas-weekender",           price:289, originalPrice:null, category:"Travel",  material:"Waxed Canvas",       color:"Slate Gray",     size:"Large",  capacity:38, laptopFit:'15"', tags:["Travel","Canvas","Lightweight","Casual"],      stock:15, rating:4.7, reviewCount:89,  trending:false, featured:true,  description:"The weekend belongs to you. Waxed canvas that repels rain and looks better with every adventure. Internal compression straps keep everything in place.", imageId:20,  images:noImages },
  { id:3,  name:"Neural Laptop Folio",       slug:"neural-laptop-folio",       price:195, originalPrice:240,  category:"Office",  material:"Vegan Leather",      color:"Cognac Brown",   size:"Medium", capacity:18, laptopFit:'16"', tags:["Office","Laptop","Lightweight","Professional"],stock:22, rating:4.8, reviewCount:203, trending:true,  featured:false, description:"Where boardroom meets brilliance. Magnetic closure, felt-lined laptop sleeve. Sleek enough for client meetings, functional enough for the commute.", imageId:30,  images:noImages },
  { id:4,  name:"Meridian Tote",             slug:"meridian-tote",             price:165, originalPrice:null, category:"Fashion", material:"Pebbled Leather",    color:"Cream White",    size:"Medium", capacity:22, laptopFit:'13"', tags:["Fashion","Leather","Casual","Everyday"],       stock:31, rating:4.6, reviewCount:178, trending:false, featured:true,  description:"Effortless elegance for the modern urbanist. Open-top design with zippered inner pocket. Structured base keeps it upright on any surface.", imageId:40,  images:noImages },
  { id:5,  name:"Summit Ridge Backpack",     slug:"summit-ridge-backpack",     price:275, originalPrice:320,  category:"Travel",  material:"Cordura Nylon",      color:"Forest Green",   size:"Large",  capacity:30, laptopFit:'15"', tags:["Travel","Waterproof","Lightweight","Outdoor"],  stock:12, rating:4.9, reviewCount:267, trending:true,  featured:true,  description:"Technical performance meets urban sophistication. YKK zippers, MOLLE webbing, and a hidden back panel pocket make this the backpack for the prepared professional.", imageId:50,  images:noImages },
  { id:6,  name:"Forge Gym Duffel",          slug:"forge-gym-duffel",          price:149, originalPrice:null, category:"Gym",     material:"Ripstop Nylon",      color:"Charcoal",       size:"Medium", capacity:35, laptopFit:null,  tags:["Gym","Waterproof","Sport","Training"],          stock:45, rating:4.5, reviewCount:321, trending:false, featured:false, description:"No excuses. Separate wet/dry compartment, ventilated shoe pocket, sweat-proof interior. Built for the athlete who never misses a session.", imageId:60,  images:noImages },
  { id:7,  name:"Ivory Executive Briefcase", slug:"ivory-executive-briefcase", price:425, originalPrice:520,  category:"Office",  material:"Full-Grain Leather", color:"Tan",            size:"Medium", capacity:20, laptopFit:'16"', tags:["Office","Leather","Premium","Professional"],    stock:5,  rating:5.0, reviewCount:54,  trending:false, featured:true,  description:"A statement of intent. Hand-stitched with brass hardware. Announces you before you speak. Fits a 16-inch laptop with room for documents.", imageId:70,  images:noImages },
  { id:8,  name:"Phantom Mini Crossbody",    slug:"phantom-mini-crossbody",    price:125, originalPrice:null, category:"Fashion", material:"Neoprene",           color:"Jet Black",      size:"Small",  capacity:6,  laptopFit:null,  tags:["Fashion","Casual","Lightweight","Urban"],       stock:28, rating:4.4, reviewCount:156, trending:true,  featured:false, description:"For those who travel light and move fast. Featherweight neoprene construction, RFID-blocking main compartment. Virtually indestructible.", imageId:80,  images:noImages },
  { id:9,  name:"Nomad Camera Pack",         slug:"nomad-camera-pack",         price:319, originalPrice:380,  category:"Travel",  material:"Ballistic Nylon",    color:"Desert Tan",     size:"Large",  capacity:28, laptopFit:'15"', tags:["Travel","Camera","Waterproof","Professional"],  stock:9,  rating:4.8, reviewCount:93,  trending:false, featured:false, description:"For the visual storyteller. Modular divider system accommodates any camera setup. Tripod attachment points and top-loading design make field access effortless.", imageId:90,  images:noImages },
  { id:10, name:"Lux Commuter Tote",         slug:"lux-commuter-tote",         price:219, originalPrice:null, category:"Office",  material:"Italian Leather",    color:"Deep Navy",      size:"Large",  capacity:25, laptopFit:'15"', tags:["Office","Leather","Premium","Commuter"],        stock:17, rating:4.7, reviewCount:112, trending:true,  featured:false, description:"The anti-backpack for the city commuter. Structured Italian leather, padded laptop sleeve, two bottle pockets, magnetic closure that never snags.", imageId:100, images:noImages },
  { id:11, name:"Heritage Rolltop",          slug:"heritage-rolltop",          price:259, originalPrice:300,  category:"Office",  material:"Waxed Canvas",       color:"Heritage Brown", size:"Large",  capacity:32, laptopFit:'16"', tags:["Office","Canvas","Casual","Vintage"],           stock:14, rating:4.8, reviewCount:134, trending:true,  featured:true,  description:"Old world craft, new world function. Roll-top closure expands capacity when you need it, cinches down for daily carry. Leather trim develops patina over years.", imageId:110, images:noImages },
  { id:12, name:"Carbon Slim Wallet",        slug:"carbon-slim-wallet",        price:89,  originalPrice:null, category:"Fashion", material:"Carbon Fiber",       color:"Matte Black",    size:"Small",  capacity:1,  laptopFit:null,  tags:["Fashion","Minimalist","Lightweight","Urban"],   stock:67, rating:4.6, reviewCount:289, trending:false, featured:false, description:"Not a bag. An accessory. Carbon fiber construction holds 12 cards and cash without bulk. RFID blocking. Pull-tab for fast card access.", imageId:120, images:noImages },
];

export const CATEGORIES = [
  { id:"travel",  name:"Travel",  emoji:"✈️",  desc:"From carry-ons to weekenders" },
  { id:"office",  name:"Office",  emoji:"💼",  desc:"Command the room" },
  { id:"fashion", name:"Fashion", emoji:"👜",  desc:"Define your aesthetic" },
  { id:"gym",     name:"Gym",     emoji:"🏋️", desc:"Train without limits" },
];

export const COUPONS: Record<string, number> = {
  VAULTA20: 0.20,
  FIRST10:  0.10,
  SAVE15:   0.15,
};

export const ORDERS: Order[] = [
  { id:"VLT-001", customerName:"James Morrison", customerEmail:"james@ex.com", status:"Delivered"  as OrderStatus, total:624, date:"2024-12-01", items:[{name:"Obsidian Transit Pro",qty:1,price:349},{name:"Carbon Slim Wallet",qty:1,price:89}] },
  { id:"VLT-002", customerName:"Amara Diallo",   customerEmail:"amara@ex.com", status:"Shipped"    as OrderStatus, total:275, date:"2024-12-03", items:[{name:"Summit Ridge Backpack",qty:1,price:275}] },
  { id:"VLT-003", customerName:"Chen Wei",        customerEmail:"chen@ex.com",  status:"Processing" as OrderStatus, total:484, date:"2024-12-05", items:[{name:"Neural Laptop Folio",qty:1,price:195},{name:"Meridian Tote",qty:1,price:165}] },
  { id:"VLT-004", customerName:"Priya Sharma",   customerEmail:"priya@ex.com", status:"Pending"    as OrderStatus, total:425, date:"2024-12-07", items:[{name:"Ivory Executive Briefcase",qty:1,price:425}] },
  { id:"VLT-005", customerName:"Lucas Ferreira", customerEmail:"lucas@ex.com", status:"Shipped"    as OrderStatus, total:319, date:"2024-12-08", items:[{name:"Nomad Camera Pack",qty:1,price:319}] },
];

export const REVENUE = [
  { month:"Jul", revenue:28400, orders:87  },
  { month:"Aug", revenue:31200, orders:94  },
  { month:"Sep", revenue:29800, orders:91  },
  { month:"Oct", revenue:38600, orders:118 },
  { month:"Nov", revenue:52100, orders:159 },
  { month:"Dec", revenue:47300, orders:144 },
];

export const TESTIMONIALS = [
  { name:"Isabelle M.", role:"Creative Director, Paris",       text:"VAULTA bags are the only ones that survive my life. I have had the Meridian for two years and it still looks new.", avatar:"I" },
  { name:"Kwame O.",    role:"Tech Lead, Lagos",               text:"I carry my laptop, chargers, and half my life in the Neural Folio every day. It never complains. Neither do I.",   avatar:"K" },
  { name:"Sofia R.",    role:"Travel Photographer, Sao Paulo", text:"The Nomad Camera Pack changed how I work in the field. Gear access in seconds, protection in all conditions.",      avatar:"S" },
];
