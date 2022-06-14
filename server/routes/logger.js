const db = require("../utils/skillsMatrix-mysql.js");

module.exports = (app) => {
  app.post("/api/mgr/admin/logger", async (req, res) => {
    const connection = await db.connection();
    try {
      const sql = `INSERT INTO login_history (sid, email) VALUES (?, ?)`;
      const values = [req.body.sid, req.body.email];

      const result = await db.query(sql, values);
      res.send({ isSuccess: true, data: result });
    } catch (err) {
      res.send({ isSuccess: false, data: err });
    } finally {
      await connection.release();
    }
  });

  app.get("/api/mgr/admin/logger", async (req, res) => {
    const connection = await db.connection();
    try {
      const sql = `
        SELECT
          login_history.login_history_id,
          login_history.sid,
          login_history.email,
          login_history.login_time,
          team_member.tm_name
        FROM login_history
	        INNER JOIN team_member
	          ON login_history.email = team_member.email
            GROUP BY SUBSTR(login_history.login_time ,1,10), team_member.email
            ORDER BY login_history.login_time DESC;
        `;
      const result = await db.query(sql);
      res.send({ isSuccess: true, data: result });
    } catch (err) {
      res.send({ isSuccess: false, data: err });
    } finally {
      await connection.release();
    }
  });
};
