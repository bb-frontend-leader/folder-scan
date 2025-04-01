
import { Server } from "./presentation/api/server";
import { Cli } from "./presentation/cli/cli";

(() => {
    main();
})()

function main() {
    // Server
    const api = new Server(3001)
    api.start()

    // CLI
    Cli.execute();
}