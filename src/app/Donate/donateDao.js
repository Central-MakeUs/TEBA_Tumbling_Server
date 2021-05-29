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

    const getDonateIdxQuery = `
        select LAST_INSERT_ID() as donateIdx;
    `
    const row = await connection.query(getDonateIdxQuery);

    return row;
}

async function donateComplete(connection, param){
    const donateCompleteQuery = `
        update Donate
        set status = '완료'
        where idx=?;
    `;

    const [rows] = await connection.query(donateCompleteQuery, param);
    return rows;
}

async function getdonateReservation(connection, param){
    const donateReservationQuery = `
        select D.idx, D.storeIdx,S.storeName, S.imgUrl, D.quantity
        from Donate D inner join Store S on D.storeIdx = S.idx
        where D.userIdx=? and D.status='예약'
        order by D.createdAt desc;
    `;
    const [rows] = await connection.query(donateReservationQuery, param);
    return rows;
}
async function selectDonateById(connection, donateIdx){
    const donateReservationQuery = `
        select idx, userIdx,quantity from Donate where idx=? and status='예약'
    `;
    const [rows] = await connection.query(donateReservationQuery, donateIdx);
    return rows;
}


module.exports = {
    getDonateStores,
    donateAction,
    donateComplete,
    getdonateReservation,
    selectDonateById
};
