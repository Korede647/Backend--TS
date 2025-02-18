import Redis from "ioredis"
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379 
//   pw
})

redisClient.on("connect", () => {
  console.log("Connected to Redis");
})

redisClient.on("error", (error) => {
  console.log("Redis connection Error: ", error);
})

redisClient.on("close", async () => {
  console.log("Closing redis connection...")
  await redisClient.quit()
  process.exit(0)
})

export default redisClient