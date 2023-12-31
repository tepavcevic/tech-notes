const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = {
  comparePasswords: (password, storedPassword) =>
    new Promise((resolve, reject) => {
      try {
        const match = bcrypt.compare(password, storedPassword);

        if (match) {
          return resolve(match);
        }
      } catch (error) {
        reject(error);
      }
    }),
  hashPassword: (password) =>
    new Promise((resolve, reject) => {
      try {
        const hashedPassword = bcrypt.hash(password, SALT_ROUNDS);

        return resolve(hashedPassword);
      } catch (error) {
        reject(error);
      }
    }),
};
