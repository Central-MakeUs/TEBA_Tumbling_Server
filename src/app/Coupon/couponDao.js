async function selectCoupon(connection, userIdx) {
    
    const selectCouponQuery = `select count(*) coupon from Coupon where isDeleted='N' and userIdx=?`;
  
    const couponRows = await connection.query(selectCouponQuery, [
        userIdx
    ]);
    return couponRows[0];
  }

    async function insertCoupon(connection, userIdx, storeIdx, quantity) {
    
    var selectCouponQuery = `INSERT INTO Coupon(userIdx, storeIdx) VALUES(?,?)`;
	    for(let i = 0; i<quantity-1; i++){
	    selectCouponQuery += `,(${userIdx},${storeIdx})`
    }
    const couponRows = await connection.query(selectCouponQuery, [userIdx, storeIdx]);
    return couponRows[0];
  }
  

  async function useCoupon(connection, userIdx) {
    
    const selectCouponQuery = `UPDATE Coupon SET isDeleted='Y' where userIdx=? and isDeleted='N' limit 1 `;
  
    const couponRows = await connection.query(selectCouponQuery, [userIdx]);
    return couponRows[0];
  }

  module.exports = {
    selectCoupon,
    insertCoupon,
    useCoupon
  }
