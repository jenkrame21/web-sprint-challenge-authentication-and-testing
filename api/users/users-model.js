const db = require("../../data/dbConfig.js");

module.exports = {
    addUser,
    findUsers,
    findBy,
    findUserById,
};

function findUsers() {
    return db("users")
}

function findBy(filter) {
    return db("users")
        .where(filter);
}

async function addUser(user) {
    const [id] = await db("users").insert(user, "id");
    return findUserById(id);
}

function findUserById(id) {
    return db("users as u")
        .where("u.id", id)
        .first();
}