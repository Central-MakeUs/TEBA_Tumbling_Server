async function selectStore(connection, latitude, longitude, distance) {
    
    const selectStoreQuery = `select S.idx, tumblerCount, latitude, longitude from Store S
    inner join (SELECT idx,
        (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)
        -radians(?))+sin(radians(?))*sin(radians(latitude))))
        AS distance
    FROM Store
    HAVING distance <= ?
    ORDER BY distance) dis on dis.idx=S.idx`;
  
    const storeRows = await connection.query(selectStoreQuery, [
        latitude, longitude, latitude, distance
    ]);
    return storeRows[0];
  }

  async function selectStoreById(connection, storeIdx) {
    
    const selectStoreQuery = `select idx, storeName, location, tumblerCount, openingTime, status, possibleCount  from Store where idx=?`;
  
    const storeRows = await connection.query(selectStoreQuery, storeIdx);
    return storeRows[0];
  }


  module.exports = {
    selectStore,
    selectStoreById
  }