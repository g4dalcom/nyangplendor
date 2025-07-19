import express from "express"
import http from "http"
import { Server } from "colyseus"
import { SplendorRoom } from "./rooms/SplendorRoom"

const app = express()
const server = http.createServer(app)
const gameServer = new Server({
  server
})

gameServer.define("nyangplendor", SplendorRoom)
gameServer.listen(2567)

console.log("Colyseus server running on ws://localhost:2567")
