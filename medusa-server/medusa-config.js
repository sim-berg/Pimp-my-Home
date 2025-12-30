const { loadEnv, defineConfig } = require("@medusajs/framework/utils")

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/medusa-store",
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    workerMode: process.env.MEDUSA_WORKER_MODE || "shared",
    databaseDriverOptions: {
      ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    disable: false,
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // Polar payment provider (custom module)
          {
            resolve: "./src/modules/polar-payment",
            id: "polar",
            options: {
              accessToken: process.env.POLAR_ACCESS_TOKEN,
              webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
              sandbox: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
    },
  ],
})
