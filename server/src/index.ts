import {listen} from "@colyseus/tools";
import app from "./app.config";

const main = async () => {
  const port = 2567;
  console.log(`Monitor → http://localhost:${port}/colyseus-monitor`);
  await listen(app, port);
}

main()
