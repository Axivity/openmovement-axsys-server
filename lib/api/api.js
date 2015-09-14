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
            return result.rows;
        });

    };

}