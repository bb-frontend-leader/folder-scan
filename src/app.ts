import { CronService } from "./infrastructure/services/cron.service";
import { Server } from "./presentation/api/server";
import { Cli } from "./presentation/cli/cli";

(() => {
    main();
})()

function main() {
    // Server
    const api = new Server(3001)
    api.start()

    CronService.startCronJob("30 10 * * *", () => {
        // CLI
        Cli.execute();
    })
}