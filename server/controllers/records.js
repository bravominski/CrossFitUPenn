var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/crossfitupenn';

module.exports = (function () {
  return {
    index_user: function(req,res) {
      var results = [];

      // Get a Postgres client from the connection pool
      pg.connect(connectionString, function(err, client, done) {
        // SQL Query > Select Data
        var query = client.query("SELECT name, records.time, reps, wods.type, date FROM records LEFT JOIN wods ON records.wod = wods.id WHERE records.user = $1 ORDER BY date DESC", [req.body.id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
          results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
          client.end();
          return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

      });
    },
    index_wod: function(req,res) {
      var results = [];

      // Get a Postgres client from the connection pool
      pg.connect(connectionString, function(err, client, done) {
        // SQL Query > Select Data
        if(req.body.type=='fortime') {
          var query = client.query("SELECT first_name, last_name, time FROM records LEFT JOIN users on records.user = users.id WHERE wod = $1 ORDER BY time ASC", [req.body.id]);
        }
        else {
          var query = client.query("SELECT first_name, last_name, reps FROM records LEFT JOIN users on records.user = users.id WHERE wod = $1 ORDER BY reps DESC", [req.body.id]);
        }

        // Stream results back one row at a time
        query.on('row', function(row) {
          results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
          client.end();
          return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

      });
    },
    create: function(req,res) {
   
      var results = [];

      // Get a Postgres client from the connection pool
      pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Insert Data
        client.query('INSERT INTO records("user", wod, time, reps) values($1, $2, $3, $4)',
         [req.body.user_id, req.body.wod_id, req.body.time, req.body.reps]);

        client.query("UPDATE wods SET participants=($1) WHERE id=($2)", [req.body.participants + 1, req.body.wod_id]);

        // SQL Query > Select Data
        if(req.body.type=='fortime') {
          var query = client.query("SELECT first_name, last_name, time FROM records LEFT JOIN users on records.user = users.id WHERE wod = $1 ORDER BY time ASC", [req.body.wod_id]);
        }
        else {
          var query = client.query("SELECT first_name, last_name, reps FROM records LEFT JOIN users on records.user = users.id WHERE wod = $1 ORDER BY reps DESC", [req.body.wod_id]);
        }
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

      });
    }
  }
})();