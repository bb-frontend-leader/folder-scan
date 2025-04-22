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

    // CLI
    Cli.execute();

    CronService.startCronJob("30 10 * * *", () => {
        // Cron job to run every day at 5:30 AM
        Cli.execute();
    })
}