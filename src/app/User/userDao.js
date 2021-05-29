// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `select idx from User where userNumber=?;`;
  const userRow = await connection.query(selectUserIdQuery, [userId]);
  return userRow;
}

//회원가입
async function signup(connection, userNumber, userEmail, profileImg, nickname ) {
    const signupQuery = `INSERT INTO User(userNumber, userEmail, profileImg, nickname) VALUES(?,?,?,?)`;
    const [userRow] = await connection.query(signupQuery, [userNumber, userEmail, profileImg, nickname]);
    return userRow;
  }

module.exports = {
  selectUserId,
  signup
};
