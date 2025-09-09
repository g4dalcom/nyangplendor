import {listen} from "@colyseus/tools";
import app from "./app.config";
import {Encoder} from "@colyseus/schema";

const main = async () => {
  Encoder.BUFFER_SIZE = 16 * 1024;
  const port = 2567;
  console.log(`Monitor → http://localhost:${port}/colyseus-monitor`);
  await listen(app, port);
}

main()
