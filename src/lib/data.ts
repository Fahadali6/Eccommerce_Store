import type { Product, Order, OrderStatus } from "@/types";

const ni = [] as Product["images"]; // no images (uses Unsplash fallback)

/*
 * All images are real bag photos from Unsplash.
 * imageId maps to a stable Unsplash photo ID via getProductImageUrl().
 * Format: https://source.unsplash.com/{id}/800x800
 */
export const PRODUCTS: Product[] = [
  // ── Travel Bags ─────────────────────────────────────────────
  {
    id:1, name:"Obsidian Transit Pro", slug:"obsidian-transit-pro",
    price:349, originalPrice:420, category:"Travel Bags",
    material:"Full-Grain Leather", color:"Midnight Black", size:"Large",
    capacity:45, laptopFit:'17"',
    tags:["Travel","Leather","Waterproof","Premium"],
    stock:8, rating:4.9, reviewCount:142, trending:true, featured:true,
    description:"Built for the relentless traveler. Full-grain leather that ages beautifully, TSA-approved dimensions, and interior organization that rivals a filing cabinet.",
    imageId:1001, images:ni,
  },
  {
    id:2, name:"Atlas Weekender Duffel", slug:"atlas-weekender",
    price:289, originalPrice:null, category:"Travel Bags",
    material:"Waxed Canvas", color:"Slate Gray", size:"Large",
    capacity:38, laptopFit:'15"',
    tags:["Travel","Canvas","Lightweight","Weekend"],
    stock:15, rating:4.7, reviewCount:89, trending:false, featured:true,
    description:"The weekend belongs to you. Waxed canvas that repels rain and looks better with every adventure. Internal compression straps keep everything in place.",
    imageId:1002, images:ni,
  },
  {
    id:3, name:"Nomad Camera & Travel Pack", slug:"nomad-camera-pack",
    price:319, originalPrice:380, category:"Travel Bags",
    material:"Ballistic Nylon", color:"Desert Tan", size:"Large",
    capacity:28, laptopFit:'15"',
    tags:["Travel","Camera","Waterproof","Professional"],
    stock:9, rating:4.8, reviewCount:93, trending:false, featured:false,
    description:"For the visual storyteller and frequent traveler. Modular divider system accommodates any camera setup. Tripod attachment points and top-loading design make field access effortless.",
    imageId:1003, images:ni,
  },

  // ── Office Bags ─────────────────────────────────────────────
  {
    id:4, name:"Ivory Executive Briefcase", slug:"ivory-executive-briefcase",
    price:425, originalPrice:520, category:"Office Bags",
    material:"Full-Grain Leather", color:"Tan", size:"Medium",
    capacity:20, laptopFit:'16"',
    tags:["Office","Leather","Premium","Professional"],
    stock:5, rating:5.0, reviewCount:54, trending:false, featured:true,
    description:"A statement of intent. Hand-stitched with brass hardware. Announces you before you speak. Fits a 16-inch laptop with room for documents and essentials.",
    imageId:1004, images:ni,
  },
  {
    id:5, name:"Lux Commuter Tote", slug:"lux-commuter-tote",
    price:219, originalPrice:null, category:"Office Bags",
    material:"Italian Leather", color:"Deep Navy", size:"Large",
    capacity:25, laptopFit:'15"',
    tags:["Office","Leather","Premium","Commuter"],
    stock:17, rating:4.7, reviewCount:112, trending:true, featured:false,
    description:"The anti-backpack for the city professional. Structured Italian leather, padded laptop sleeve, two bottle pockets, magnetic closure that never snags.",
    imageId:1005, images:ni,
  },
  {
    id:6, name:"Heritage Rolltop Bag", slug:"heritage-rolltop",
    price:259, originalPrice:300, category:"Office Bags",
    material:"Waxed Canvas", color:"Heritage Brown", size:"Large",
    capacity:32, laptopFit:'16"',
    tags:["Office","Canvas","Casual","Vintage"],
    stock:14, rating:4.8, reviewCount:134, trending:true, featured:true,
    description:"Old world craft, new world function. Roll-top closure expands capacity when you need it, cinches down for daily carry. Leather trim develops rich patina over years.",
    imageId:1006, images:ni,
  },

  // ── Gym Bags ────────────────────────────────────────────────
  {
    id:7, name:"Forge Pro Gym Duffel", slug:"forge-gym-duffel",
    price:149, originalPrice:null, category:"Gym Bags",
    material:"Ripstop Nylon", color:"Charcoal", size:"Medium",
    capacity:35, laptopFit:null,
    tags:["Gym","Waterproof","Sport","Training"],
    stock:45, rating:4.5, reviewCount:321, trending:false, featured:false,
    description:"No excuses. Separate wet/dry compartment, ventilated shoe pocket, sweat-proof interior lining. Built for athletes who never miss a session.",
    imageId:1007, images:ni,
  },
  {
    id:8, name:"Titan Sport Bag XL", slug:"titan-sport-bag",
    price:179, originalPrice:220, category:"Gym Bags",
    material:"Cordura Nylon", color:"All Black", size:"Large",
    capacity:50, laptopFit:null,
    tags:["Gym","Sport","Spacious","Durable"],
    stock:22, rating:4.6, reviewCount:87, trending:true, featured:false,
    description:"Maximum capacity for the serious athlete. Multiple compartments for shoes, clothes, and gear. Water-resistant exterior and padded shoulder straps for heavy loads.",
    imageId:1008, images:ni,
  },

  // ── Fashion Bags ────────────────────────────────────────────
  {
    id:9, name:"Meridian Structured Tote", slug:"meridian-tote",
    price:165, originalPrice:null, category:"Fashion Bags",
    material:"Pebbled Leather", color:"Cream White", size:"Medium",
    capacity:22, laptopFit:'13"',
    tags:["Fashion","Leather","Casual","Everyday"],
    stock:31, rating:4.6, reviewCount:178, trending:false, featured:true,
    description:"Effortless elegance for the modern urbanist. Open-top design with zippered inner pocket. Structured base keeps it upright on any surface.",
    imageId:1009, images:ni,
  },
  {
    id:10, name:"Phantom Mini Crossbody", slug:"phantom-mini-crossbody",
    price:125, originalPrice:null, category:"Fashion Bags",
    material:"Neoprene", color:"Jet Black", size:"Small",
    capacity:6, laptopFit:null,
    tags:["Fashion","Casual","Lightweight","Urban"],
    stock:28, rating:4.4, reviewCount:156, trending:true, featured:false,
    description:"For those who travel light and move fast. Featherweight neoprene construction, RFID-blocking main compartment. Virtually indestructible and incredibly versatile.",
    imageId:1010, images:ni,
  },

  // ── Ladies Bags ─────────────────────────────────────────────
  {
    id:11, name:"Rosa Quilted Shoulder Bag", slug:"rosa-quilted-shoulder",
    price:195, originalPrice:240, category:"Ladies Bags",
    material:"Quilted Leather", color:"Blush Pink", size:"Medium",
    capacity:15, laptopFit:null,
    tags:["Ladies","Elegant","Premium","Quilted"],
    stock:18, rating:4.8, reviewCount:203, trending:true, featured:true,
    description:"A timeless silhouette reimagined for the modern woman. Quilted leather exterior, gold-tone hardware, and a silk-lined interior that protects everything precious.",
    imageId:1011, images:ni,
  },
  {
    id:12, name:"Luna Evening Clutch Bag", slug:"luna-evening-clutch",
    price:139, originalPrice:null, category:"Ladies Bags",
    material:"Satin Leather", color:"Midnight Gold", size:"Small",
    capacity:4, laptopFit:null,
    tags:["Ladies","Evening","Clutch","Luxury"],
    stock:34, rating:4.7, reviewCount:91, trending:false, featured:false,
    description:"The perfect evening companion. Sleek satin leather exterior with a magnetic snap closure. Fits your phone, cards, and essentials with effortless grace.",
    imageId:1012, images:ni,
  },
  {
    id:13, name:"Aria Hobo Shoulder Bag", slug:"aria-hobo-shoulder",
    price:215, originalPrice:260, category:"Ladies Bags",
    material:"Soft Grain Leather", color:"Caramel Brown", size:"Large",
    capacity:20, laptopFit:null,
    tags:["Ladies","Casual","Shoulder","Everyday"],
    stock:12, rating:4.9, reviewCount:167, trending:true, featured:true,
    description:"The everyday bag that does it all. Generous capacity, soft grain leather that molds beautifully over time. A single bag that carries your whole world.",
    imageId:1013, images:ni,
  },

  // ── Backpacks ───────────────────────────────────────────────
  {
    id:14, name:"Summit Ridge Backpack", slug:"summit-ridge-backpack",
    price:275, originalPrice:320, category:"Backpacks",
    material:"Cordura Nylon", color:"Forest Green", size:"Large",
    capacity:30, laptopFit:'15"',
    tags:["Backpack","Waterproof","Outdoor","Travel"],
    stock:12, rating:4.9, reviewCount:267, trending:true, featured:true,
    description:"Technical performance meets urban sophistication. YKK zippers, MOLLE webbing, hidden back panel pocket. The backpack for the truly prepared professional.",
    imageId:1014, images:ni,
  },
  {
    id:15, name:"Urban Commuter Backpack", slug:"urban-commuter-backpack",
    price:189, originalPrice:null, category:"Backpacks",
    material:"Waxed Canvas", color:"Charcoal Gray", size:"Medium",
    capacity:22, laptopFit:'15"',
    tags:["Backpack","Commuter","Casual","Everyday"],
    stock:29, rating:4.6, reviewCount:145, trending:false, featured:false,
    description:"The everyday backpack designed for the urban commuter. Padded back panel, external USB charging port pocket, and anti-theft hidden zip pocket on the back.",
    imageId:1015, images:ni,
  },
  {
    id:16, name:"Venture 40L Hiking Pack", slug:"venture-hiking-pack",
    price:229, originalPrice:280, category:"Backpacks",
    material:"Ripstop Polyester", color:"Olive Green", size:"Large",
    capacity:40, laptopFit:null,
    tags:["Backpack","Hiking","Outdoor","Adventure"],
    stock:19, rating:4.7, reviewCount:78, trending:false, featured:false,
    description:"Built for the trail but ready for the city. Hydration bladder compatible, aluminum frame stays, integrated rain cover. Adventure starts here.",
    imageId:1016, images:ni,
  },

  // ── Laptop Bags ─────────────────────────────────────────────
  {
    id:17, name:"Neural Laptop Folio", slug:"neural-laptop-folio",
    price:195, originalPrice:240, category:"Laptop Bags",
    material:"Vegan Leather", color:"Cognac Brown", size:"Medium",
    capacity:18, laptopFit:'16"',
    tags:["Laptop","Office","Lightweight","Professional"],
    stock:22, rating:4.8, reviewCount:203, trending:true, featured:false,
    description:"Where boardroom meets brilliance. Magnetic closure, felt-lined laptop sleeve, dedicated accessory pockets. Sleek enough for client meetings, functional enough for the daily commute.",
    imageId:1017, images:ni,
  },
  {
    id:18, name:"Pro Sleeve Laptop Bag 15\"", slug:"pro-sleeve-laptop-15",
    price:99, originalPrice:null, category:"Laptop Bags",
    material:"Neoprene", color:"Space Gray", size:"Medium",
    capacity:8, laptopFit:'15"',
    tags:["Laptop","Sleeve","Lightweight","Minimalist"],
    stock:55, rating:4.5, reviewCount:312, trending:false, featured:false,
    description:"Minimal protection, maximum style. Military-grade neoprene absorbs shocks and drops. Water-resistant coating keeps your laptop dry. Fits inside any bag.",
    imageId:1018, images:ni,
  },
  {
    id:19, name:"Executive Leather Laptop Bag", slug:"executive-laptop-bag",
    price:345, originalPrice:420, category:"Laptop Bags",
    material:"Full-Grain Leather", color:"Dark Brown", size:"Large",
    capacity:24, laptopFit:'17"',
    tags:["Laptop","Office","Leather","Premium"],
    stock:11, rating:4.9, reviewCount:67, trending:true, featured:true,
    description:"The definitive laptop bag for executives. Fits up to 17-inch laptops with dedicated padded sleeve. Full-grain leather exterior with suede interior lining. Built to impress.",
    imageId:1019, images:ni,
  },
];

// ── Categories ────────────────────────────────────────────────
export const CATEGORIES = [
  { id:"travel-bags",  name:"Travel Bags",   emoji:"🧳", desc:"Carry-ons, duffels & weekenders",     image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
  { id:"office-bags",  name:"Office Bags",   emoji:"💼", desc:"Briefcases, totes & work bags",       image:"https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&q=80" },
  { id:"gym-bags",     name:"Gym Bags",      emoji:"🏋️", desc:"Duffels & sport bags",               image:"https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&q=80" },
  { id:"fashion-bags", name:"Fashion Bags",  emoji:"👜", desc:"Crossbody, shoulder & tote bags",     image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
  { id:"ladies-bags",  name:"Ladies Bags",   emoji:"👛", desc:"Clutches, quilted & hobo bags",       image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80" },
  { id:"backpacks",    name:"Backpacks",     emoji:"🎒", desc:"Urban, hiking & commuter packs",      image:"https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80" },
  { id:"laptop-bags",  name:"Laptop Bags",   emoji:"💻", desc:"Sleeves, folios & laptop carriers",   image:"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80" },
];

// ── Coupons ───────────────────────────────────────────────────
export const COUPONS: Record<string, number> = {
  VAULTA20: 0.20,
  FIRST10:  0.10,
  SAVE15:   0.15,
};

// ── Orders ────────────────────────────────────────────────────
export const ORDERS = [
  { id:"VLT-001", customerName:"James Morrison",  customerEmail:"james@ex.com", status:"Delivered"  as OrderStatus, total:624, date:"2024-12-01", items:[{name:"Obsidian Transit Pro",qty:1,price:349}] },
  { id:"VLT-002", customerName:"Amara Diallo",    customerEmail:"amara@ex.com", status:"Shipped"    as OrderStatus, total:275, date:"2024-12-03", items:[{name:"Summit Ridge Backpack",qty:1,price:275}] },
  { id:"VLT-003", customerName:"Chen Wei",         customerEmail:"chen@ex.com",  status:"Processing" as OrderStatus, total:484, date:"2024-12-05", items:[{name:"Neural Laptop Folio",qty:1,price:195}] },
  { id:"VLT-004", customerName:"Priya Sharma",    customerEmail:"priya@ex.com", status:"Pending"    as OrderStatus, total:425, date:"2024-12-07", items:[{name:"Ivory Executive Briefcase",qty:1,price:425}] },
  { id:"VLT-005", customerName:"Lucas Ferreira",  customerEmail:"lucas@ex.com", status:"Shipped"    as OrderStatus, total:345, date:"2024-12-08", items:[{name:"Executive Laptop Bag",qty:1,price:345}] },
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
  { name:"Isabelle M.", role:"Creative Director, Paris",       text:"VAULTA bags are the only ones that survive my life. I have had the Meridian Tote for two years and it still looks brand new.", avatar:"I" },
  { name:"Kwame O.",    role:"Tech Lead, Lagos",               text:"I carry my laptop, chargers, and half my life in the Neural Laptop Folio every day. It never complains. Neither do I.",          avatar:"K" },
  { name:"Sofia R.",    role:"Travel Photographer, Sao Paulo", text:"The Summit Ridge Backpack changed how I work in the field. Gear access in seconds, protection in all conditions.",               avatar:"S" },
];
