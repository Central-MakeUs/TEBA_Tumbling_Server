// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `select idx from User where userNumber=?`;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

//회원가입
async function signup(connection, userNumber, userEmail, profileImgUrl, userName ) {
    const signupQuery = `INSERT INTO User(userNumber, userEmail, profileImgUrl, userName) SET (?,?,?,?)`;
    const [userRow] = await connection.query(signupQuery, [userNumber, userEmail, profileImgUrl, userName]);
    return userRow;
  }

module.exports = {
  selectUserId,
  signup
};
