var users = require('./../controllers/users');
var wods = require('./../controllers/wods');
var records = require('./../controllers/records');

module.exports = function(app) {
	// users
	app.get('/users', function (req,res) {
		users.index(req,res);
	});

	app.post('/user', function (req,res) {
		users.show(req,res);
	})

	app.post('/users/new', function (req,res) {
		users.create(req,res);
	});

	app.post('/users/destroy', function (req,res) {
		users.destroy(req,res);
	});

	app.post('/user/add_score', function (req,res) {
		users.add_score(req,res);
	})

	// wods
	app.get('/wods', function (req,res) {
		wods.index(req,res);
	});

	app.post('/wods/new', function (req,res) {
		wods.create(req,res);
	});

	app.post('/wod', function (req,res) {
		wods.show(req,res);
	})

	app.post('/wod/complete', function (req,res) {
		wods.complete(req,res);
	})

	// records
	app.post('/records/user', function (req,res) {
		records.index_user(req,res);
	});

	app.post('/records/wod', function (req,res) {
		records.index_wod(req,res);
	});

	app.post('/records/new', function (req,res) {
		records.create(req,res);
	});
}