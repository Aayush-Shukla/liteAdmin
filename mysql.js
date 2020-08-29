var mysql      = require('mysql')

var db_config = {
  host     : 'localhost',
  user     : 'root',
  password :  'ayush'
}

var config =function (a,b,c){
	db_config.host=a
	db_config.user=b
	db_config.password=c


}

var connection
	connection = mysql.createConnection(db_config)
	connection.connect(function(err) {
		if(err) {
			console.log('Database connection error:', err);
		}
	});

// module.exports.config=config
module.exports = connection
module.exports = config