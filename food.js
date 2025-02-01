const mysql=require('mysql2');
const express = require("express");
const app=express();
const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"pyjdex2005",
    database:"PlateShare"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
 
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}
  app.get("/", (req, res) => {
    con.query(
        "SELECT did, foodname, pickuploc, DATE(expiration) AS expiration FROM food WHERE is_claimed = 0",
        (err, result) => {
            if (err) {
                res.status(500).json({ error: "Database query failed" });
                return;
            }

            res.json(result);
        }
    );
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
