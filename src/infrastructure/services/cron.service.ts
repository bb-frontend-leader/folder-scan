import { CronJob } from "cron";

type CronTime = string | Date;
type OnTick = () => Promise<void> | void;

export class CronService {
    static startCronJob(cronTime: CronTime, onTick: OnTick): void {
        const job = new CronJob(cronTime, async () => {
            try {
                await onTick();
            } catch (error) {
                console.error("❌ Error executing cron job:", error);
            }
        });

        job.start();
        console.log(`✅ Cron job started with schedule: ${cronTime}`);
    }
}