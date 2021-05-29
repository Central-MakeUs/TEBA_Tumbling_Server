async function selectCoupon(connection, userIdx) {
    
    const selectCouponQuery = `select count(*) coupon from Coupon where isDeleted='N' and userIdx=?`;
  
    const couponRows = await connection.query(selectCouponQuery, [
        userIdx
    ]);
    return couponRows[0];
  }

  async function selectCouponById(connection, couponIdx) {
    
    const selectCouponQuery = `select idx, couponName, location, tumblerCount, openingTime, status, possibleCount  from Coupon where idx=?`;
  
    const couponRows = await connection.query(selectCouponQuery, couponIdx);
    return couponRows[0];
  }


  module.exports = {
    selectCoupon,
    selectCouponById
  }