const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
const fs = require('fs');
const uuid = require('uuid');

const DB_FILE = './devices.db';
const registration = {};

const STATUS = {
    PENDING: 'pending',
    ALIVE: 'alive',
    CLOSE: 'close'
};

registration.open = async function () {
    if (!fs.existsSync(DB_FILE)) {
        fs.closeSync(fs.openSync(DB_FILE, 'w'));
    }

    let db = await sqlite.open({
        filename: './devices.db',
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READWRITE
    })

    db.on('trace', (data) => {
        console.log(data);
    })

    return db;
}

registration.createTables = async function () {
    let db = await this.open();
    db.exec("CREATE TABLE IF NOT EXISTS registration (id TEXT PRIMARY KEY, device TEXT NOT NULL, status TEXT NOT NULL)")
}

registration.save = async function (data) {
    let db = await this.open();
    let id = uuid.v1();
    
    await db.run('INSERT INTO registration (id, device, status) VALUES (?,?,?)', id, data.device, STATUS.PENDING)
    
    return {
        id: id,
        device: data.device,
        status: STATUS.PENDING
    }
}

registration.get = async function (id) {
    let db = await this.open();
    let reg = await db.get('SELECT id, device, status FROM registration WHERE id = ?', id);
    return reg;
}

registration.update = async function (id, status) {
    let db = await this.open();
    await db.run('UPDATE registration SET status = ? WHERE id = ?', status, id)

    return {
        id: id,
        status: status
    }
}

registration.createTables();

module.exports = registration;
