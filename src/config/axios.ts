import axios from "axios"

export const app = axios.create({
  baseURL: "https://api-helpdesk-kky6.onrender.com"
})