class User {
    constructor(secretKey, name, email, password) {
        this.secretKey = secretKey;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

module.exports = User;
