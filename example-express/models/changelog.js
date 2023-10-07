import { db_conn } from "../database.js";

export function newChangelog(
    id,
    date,
    user_id,
    message,
) {
    return {
        id,
        date,
        user_id,
        message
    }
}

export function create(changelog) {
    return db_conn.query(`
    INSERT INTO changelog
    (changelog_id, changelog_date, changelog_user_id, changelog_message)
    VALUES (?, now(), ?, ?)
    `, [changelog.id, changelog.user_id, changelog.message])
}