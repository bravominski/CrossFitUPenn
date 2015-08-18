var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/crossfitupenn';

module.exports = (function () {
  return {
    index: function(req,res) {
      
      var results = [];
      // Get a Postgres client from the connection pool
      pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM users ORDER BY score DESC;");

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
    show: function (req,res) {
      var result;
      pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM users WHERE id = $1", [req.body.id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            result = row;
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(result);
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
        client.query("INSERT INTO users(email, password, first_name, last_name, mobile) values($1, $2, $3, $4, $5)",
         [req.body.email, req.body.password, req.body.first_name, req.body.last_name, req.body.mobile]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM users ORDER BY id ASC");

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
    destroy: function(req,res) {
      
    },
    add_score: function(req,res) {
      var results = [];

      // Get a Postgres client from the connection pool
      pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Insert Data
        client.query("UPDATE users SET score=($1) WHERE id=($2)", [req.body.score, req.body.id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM users ORDER BY score DESC");

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