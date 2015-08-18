var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/crossfitupenn';

module.exports = (function () {
  return {
    index: function(req,res) {
      var results = [];

      // Get a Postgres client from the connection pool
      pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM wods ORDER BY date DESC LIMIT 5;");

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
        var query = client.query("SELECT * FROM wods WHERE id=$1", [req.body.id]);

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
        client.query("INSERT INTO wods(name, date, time, location, content, coach, type) values($1, $2, $3, $4, $5, $6, $7)",
         [req.body.name, req.body.date, req.body.time, req.body.location, req.body.content, req.body.coach, req.body.type]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM wods ORDER BY date DESC");

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
    complete: function(req,res) {
      var result;

      // Get a Postgres client from the connection pool
      pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Update Data
        client.query("UPDATE wods SET completed=($1) WHERE id=($2)", [true, req.body.id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM wods WHERE id=$1", [req.body.id]);

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

    }
  }
})();