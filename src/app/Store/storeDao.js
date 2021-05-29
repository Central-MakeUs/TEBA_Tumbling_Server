async function selectStore(connection, latitude, longitude, distance) {
    
    const selectStoreQuery = `select S.idx, latitude, longitude, storeName, location, tumblingPoint, imgUrl from Store S
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
    
    const selectStoreQuery = `select idx, storeName, location, latitude, longitude, tumblerCount, openingTime, storeUrl, phone, imgUrl from Store where idx=?`;
  
    const storeRows = await connection.query(selectStoreQuery, storeIdx);
    return storeRows[0];
  }

  async function selectStoreByCode(connection, storeCode) {
    
    const selectStoreQuery = `select idx from Store where storeCode=?`;
  
    const storeRows = await connection.query(selectStoreQuery, storeCode);
    return storeRows[0];
  }

  async function searchStores(connection, param){
    const storeSearchQuery = `
        select idx, storeName, ifnull(imgUrl, "") as imgUrl, latitude, longitude, tumblerCount, openingTime, ifnull(storeUrl,"") as storeUrl, tumblingPoint, ifnull(phone,"") as phone
        from Store
        WHERE storeName like concat('%',?,'%');
    `;
    const [storeRows] = await connection.query(storeSearchQuery, param);
    return storeRows;
  }

  module.exports = {
    selectStore,
    selectStoreById,
    selectStoreByCode,
    searchStores,
  }