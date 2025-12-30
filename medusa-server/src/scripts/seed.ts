import { ExecArgs } from "@medusajs/framework/types"
import { ProductStatus } from "@medusajs/framework/utils"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve("logger")

  logger.info("Starting seed...")

  // Get required services
  const productService = container.resolve("product")
  const regionService = container.resolve("region")
  const salesChannelService = container.resolve("sales_channel")
  const stockLocationService = container.resolve("stock_location")

  logger.info("Creating regions...")

  // Create regions
  const regions = await regionService.createRegions([
    {
      name: "United States",
      currency_code: "usd",
      countries: ["us"],
      payment_providers: ["polar"],
    },
    {
      name: "Europe",
      currency_code: "eur",
      countries: ["de", "fr", "gb", "it", "es", "nl"],
      payment_providers: ["polar"],
    },
  ])

  logger.info("Creating sales channel...")

  // Create sales channel
  const salesChannel = await salesChannelService.createSalesChannels({
    name: "Pimp your Home Store",
    description: "Main storefront for crystal and decorative items",
    is_disabled: false,
  })

  logger.info("Creating stock location...")

  // Create stock location
  const stockLocation = await stockLocationService.createStockLocations({
    name: "Main Warehouse",
    address: {
      address_1: "123 Crystal Lane",
      city: "Austin",
      country_code: "us",
      postal_code: "78701",
    },
  })

  logger.info("Creating product categories...")

  // Create product categories
  const categoryService = container.resolve("product_category") as {
    createProductCategories: (data: Array<{
      name: string
      handle: string
      description: string
      is_active: boolean
    }>) => Promise<unknown[]>
  }

  const categories = await categoryService.createProductCategories([
    {
      name: "Crystals",
      handle: "crystals",
      description: "3D printed crystal decorations with mystical designs",
      is_active: true,
    },
    {
      name: "Lamps",
      handle: "lamps",
      description: "Glowing crystal lamps and light fixtures",
      is_active: true,
    },
    {
      name: "Figurines",
      handle: "figurines",
      description: "Decorative 3D printed figurines and statues",
      is_active: true,
    },
    {
      name: "Home Decor",
      handle: "home-decor",
      description: "Various home decoration items",
      is_active: true,
    },
  ])

  logger.info("Creating sample products...")

  // Sample products with crystal cave theme
  const products = [
    {
      title: "Amethyst Crystal Cluster",
      handle: "amethyst-crystal-cluster",
      description: "A stunning 3D printed amethyst cluster that captures the mystical beauty of real crystals. Features intricate geometric patterns and a translucent purple finish that glows beautifully in ambient light.",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1567225591450-06036b3392a6?w=800" },
      ],
      options: [
        { title: "Size", values: ["Small", "Medium", "Large"] },
        { title: "Color", values: ["Purple", "Deep Purple", "Lavender"] },
      ],
      variants: [
        {
          title: "Small / Purple",
          sku: "AME-SM-PUR",
          prices: [
            { amount: 2999, currency_code: "usd" },
            { amount: 2799, currency_code: "eur" },
          ],
          options: { Size: "Small", Color: "Purple" },
          manage_inventory: true,
        },
        {
          title: "Medium / Purple",
          sku: "AME-MD-PUR",
          prices: [
            { amount: 4999, currency_code: "usd" },
            { amount: 4599, currency_code: "eur" },
          ],
          options: { Size: "Medium", Color: "Purple" },
          manage_inventory: true,
        },
        {
          title: "Large / Deep Purple",
          sku: "AME-LG-DPUR",
          prices: [
            { amount: 7999, currency_code: "usd" },
            { amount: 7399, currency_code: "eur" },
          ],
          options: { Size: "Large", Color: "Deep Purple" },
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Crystal Cave Lamp",
      handle: "crystal-cave-lamp",
      description: "Transform your space into a mystical crystal cave with this stunning LED lamp. Features a geode-inspired design with internal lighting that creates an enchanting glow effect.",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800" },
      ],
      options: [
        { title: "Size", values: ["Table", "Floor"] },
        { title: "Light Color", values: ["Warm White", "RGB Multi"] },
      ],
      variants: [
        {
          title: "Table / Warm White",
          sku: "CCL-TBL-WW",
          prices: [
            { amount: 8999, currency_code: "usd" },
            { amount: 8299, currency_code: "eur" },
          ],
          options: { Size: "Table", "Light Color": "Warm White" },
          manage_inventory: true,
        },
        {
          title: "Table / RGB Multi",
          sku: "CCL-TBL-RGB",
          prices: [
            { amount: 9999, currency_code: "usd" },
            { amount: 9199, currency_code: "eur" },
          ],
          options: { Size: "Table", "Light Color": "RGB Multi" },
          manage_inventory: true,
        },
        {
          title: "Floor / RGB Multi",
          sku: "CCL-FLR-RGB",
          prices: [
            { amount: 14999, currency_code: "usd" },
            { amount: 13799, currency_code: "eur" },
          ],
          options: { Size: "Floor", "Light Color": "RGB Multi" },
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Dragon Guardian Figurine",
      handle: "dragon-guardian-figurine",
      description: "A majestic dragon figurine guarding a crystal treasure. Intricately detailed with scales, wings, and glowing crystal eyes. Perfect for fantasy lovers and collectors.",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
      ],
      options: [
        { title: "Size", values: ["Small", "Large"] },
        { title: "Finish", values: ["Metallic", "Matte Black", "Crystal Blue"] },
      ],
      variants: [
        {
          title: "Small / Metallic",
          sku: "DRG-SM-MET",
          prices: [
            { amount: 3999, currency_code: "usd" },
            { amount: 3699, currency_code: "eur" },
          ],
          options: { Size: "Small", Finish: "Metallic" },
          manage_inventory: true,
        },
        {
          title: "Large / Crystal Blue",
          sku: "DRG-LG-BLU",
          prices: [
            { amount: 7999, currency_code: "usd" },
            { amount: 7399, currency_code: "eur" },
          ],
          options: { Size: "Large", Finish: "Crystal Blue" },
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Floating Crystal Shelf",
      handle: "floating-crystal-shelf",
      description: "A geometric floating shelf inspired by crystal formations. Perfect for displaying your treasures, plants, or other mystical items. Features a unique angular design.",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" },
      ],
      options: [
        { title: "Size", values: ["Small", "Medium", "Large"] },
        { title: "Color", values: ["White", "Black", "Translucent"] },
      ],
      variants: [
        {
          title: "Medium / Translucent",
          sku: "FCS-MD-TRN",
          prices: [
            { amount: 4499, currency_code: "usd" },
            { amount: 4199, currency_code: "eur" },
          ],
          options: { Size: "Medium", Color: "Translucent" },
          manage_inventory: true,
        },
        {
          title: "Large / Black",
          sku: "FCS-LG-BLK",
          prices: [
            { amount: 5999, currency_code: "usd" },
            { amount: 5499, currency_code: "eur" },
          ],
          options: { Size: "Large", Color: "Black" },
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Teal Quartz Cluster",
      handle: "teal-quartz-cluster",
      description: "A beautiful teal-colored quartz cluster that brings ocean vibes to your space. Features sharp, geometric crystal points with a stunning translucent finish.",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1551122089-4e3e72477432?w=800" },
      ],
      options: [
        { title: "Size", values: ["Small", "Medium", "Large"] },
      ],
      variants: [
        {
          title: "Small",
          sku: "TQC-SM",
          prices: [
            { amount: 2499, currency_code: "usd" },
            { amount: 2299, currency_code: "eur" },
          ],
          options: { Size: "Small" },
          manage_inventory: true,
        },
        {
          title: "Medium",
          sku: "TQC-MD",
          prices: [
            { amount: 3999, currency_code: "usd" },
            { amount: 3699, currency_code: "eur" },
          ],
          options: { Size: "Medium" },
          manage_inventory: true,
        },
        {
          title: "Large",
          sku: "TQC-LG",
          prices: [
            { amount: 5999, currency_code: "usd" },
            { amount: 5499, currency_code: "eur" },
          ],
          options: { Size: "Large" },
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Crystal Moon Lamp",
      handle: "crystal-moon-lamp",
      description: "A stunning moon-shaped lamp covered in crystal formations. Changes colors with touch control and creates an ethereal ambiance in any room.",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1532009877282-3340270e0529?w=800" },
      ],
      options: [
        { title: "Size", values: ["15cm", "20cm", "25cm"] },
      ],
      variants: [
        {
          title: "15cm",
          sku: "CML-15",
          prices: [
            { amount: 5999, currency_code: "usd" },
            { amount: 5499, currency_code: "eur" },
          ],
          options: { Size: "15cm" },
          manage_inventory: true,
        },
        {
          title: "20cm",
          sku: "CML-20",
          prices: [
            { amount: 7999, currency_code: "usd" },
            { amount: 7399, currency_code: "eur" },
          ],
          options: { Size: "20cm" },
          manage_inventory: true,
        },
        {
          title: "25cm",
          sku: "CML-25",
          prices: [
            { amount: 9999, currency_code: "usd" },
            { amount: 9199, currency_code: "eur" },
          ],
          options: { Size: "25cm" },
          manage_inventory: true,
        },
      ],
    },
  ]

  // Create products
  for (const productData of products) {
    try {
      await productService.createProducts([productData])
      logger.info(`Created product: ${productData.title}`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      logger.error(`Failed to create product ${productData.title}: ${errorMessage}`)
    }
  }

  logger.info("Seed completed successfully!")
}
