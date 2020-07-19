const bcrypt = require('bcryptjs');

module.exports = getSaltHashPassword = async password => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}