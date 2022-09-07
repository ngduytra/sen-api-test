import ip from 'ip'
import BN from 'bn.js'
import { PublicKey } from '@solana/web3.js'

const env = process.env.NODE_ENV || 'development'
const configuration = () => ({
  server: {
    env,
    port: parseInt(process.env.PORT, 10) || 10000,
    ip: ip.address() as string,
    adminPubkeys: [
      new PublicKey('8W6QginLcAydYyMYjxuyKQN56NzeakDE3aRFrAmocS6D'),
    ],
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sen_data',
    projection: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 },
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    ttl: env === 'development' ? 5 : 60,
  },
  solana: {
    cluster:
      env === 'development'
        ? 'https://api.devnet.solana.com'
        : 'https://ssc-dao.genesysgo.net/',
  },
  lottery: {
    max: new BN('1000000000000000000'),
    privKey: Buffer.from(process.env.LOTTERY_PRIVATE_KEY || '', 'hex'),
    taxmanPubkey:
      env === 'development'
        ? new PublicKey('8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9')
        : new PublicKey('9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e'),
    programId:
      env === 'development'
        ? new PublicKey('CmPmemCsdSH4CypNJEZRYEa29rhDPdQyadK71ArKmTGT')
        : new PublicKey('CmPmemCsdSH4CypNJEZRYEa29rhDPdQyadK71ArKmTGT'),
  },
  jupiter: {
    programId: new PublicKey('JUP3c2Uh3WA4Ng34tw6kPd2G4C5BB21Xo36Je1s32Ph'),
  },
})

export type EnvironmentVariables = ReturnType<typeof configuration>

export default configuration
