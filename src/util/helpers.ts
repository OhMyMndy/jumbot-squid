import { APIClient } from "@nocobase/sdk";
const https = require("https");
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const apiClient = new APIClient({
  baseURL: process.env.API_ENDPOINT,
  httpsAgent: httpsAgent
})

apiClient.auth.token = process.env.API_KEY as string


export {
  apiClient
}
