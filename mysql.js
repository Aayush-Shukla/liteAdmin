var mysql      = require('mysql')

var db_config = {
  host     : 'localhost',
  user     : 'root',
  password :  'ayush'
}

var connection
	connection = mysql.createConnection(db_config)
	connection.connect(function(err) {
		if(err) {
			console.log('Database connection error:', err);
		}
	});


module.exports = connection