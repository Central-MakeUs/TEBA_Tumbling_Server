async function getDonateStores(connection, param) {
    const getDonateStoresQuery = `
                select idx, storeName, location, possibleCount, (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)-radians(?))+sin(radians(?))*sin(radians(latitude))))
                    as distance
                from Store
                where status='가능'
                order by distance;
                `;
    const [storeRows] = await connection.query(getDonateStoresQuery, param);
    return storeRows;
}

async function donateAction(connection, param){
    const donateInsertQuery = `
        insert Donate(storeIdx, userIdx, quantity) values(?, ?, ?);
    `;
    const [rows] = await connection.query(donateInsertQuery, param);
    return rows;
}

module.exports = {
    getDonateStores,
    donateAction,
};
