/**
 * Created by Praveen on 09/09/2015.
 */

export class APIInterface {

    constructor(dbService, db) {
        this.dbService = dbService;
        this.db = db;
    }

    getDevices() {
        return this.dbService.getAllDevices(this.db).then((result) => {
            console.log(result);
            let results = [];
            result.rows.map((device) => {
               results.push(device.doc);
            });
            console.log(results);
            return results;
        });

    };

}