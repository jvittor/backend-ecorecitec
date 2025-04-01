"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, username, password, imageBase64) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.imageBase64 = imageBase64;
    }
}
exports.User = User;
