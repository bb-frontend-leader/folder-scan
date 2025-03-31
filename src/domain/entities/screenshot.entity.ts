
export class Screenshot {
    constructor(public screenShotBase64: string) { }

    // public covertToBase64(): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         if (!this.filePath) {
    //             reject(new Error('File path is not set.'));
    //             return;
    //         }
    //         const filePath = this.filePath;
    //         fs.readFile(filePath, (err: any, data: any) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 const base64Data = Buffer.from(data).toString('base64');
    //                 resolve(base64Data);
    //             }
    //         });
    //     });
    // }
}