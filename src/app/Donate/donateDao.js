async function getDonateStores(connection, param) {
    const getDonateStoresQuery = `
                select idx, storeName, location, possibleCount, (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)-radians(?))+sin(radians(?))*sin(radians(latitude))))
                    as distance
                from Store
                order by distance;
                `;
    const [storeRows] = await connection.query(getDonateStoresQuery, param);
    return storeRows;
}


module.exports = {
    getDonateStores,

};
