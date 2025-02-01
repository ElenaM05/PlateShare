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

            let tableHTML = `
                <html>
                    <head>
                        <title>Food Information</title>
                        <style>
                            table { border-collapse: collapse; width: 100%; }
                            th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                            th { background-color: #f2f2f2; }
                        </style>
                    </head>
                    <body>
                        <h2>Unclaimed Food Information</h2>
                        <table>
                            <tr>
                                <th>Donor ID</th>
                                <th>Food Name</th>
                                <th>Pickup Location</th>
                                <th>Expiration Date</th>
                            </tr>`;

            
            result.forEach((food) => {
                const formattedExpirationDate = formatDate(food.expiration);
                tableHTML += `
                    <tr>
                        <td>${food.did}</td>
                        <td>${food.foodname}</td>
                        <td>${food.pickuploc}</td>
                        <td>${formattedExpirationDate}</td>
                    </tr>`;
            });

            tableHTML += `
                        </table>
                    </body>
                </html>`;

            res.send(tableHTML);
        }
    );
});



app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
