var express = require('express');
var router = express.Router();
var mysql = require('../mysql')

/* GET home page. */
router.get('/',function (req, res) {

  var sql = "SHOW DATABASES"
  mysql.query(sql, [], function (err, result) {

    if(err) {
      console.log(err)
    }
  var dbs=[]
    console.log(JSON.parse(JSON.stringify(result))[0]['Database'])
    for( var i=0;i<result.length;i++){
      dbs.push(result[i]['Database'])

    }
    res.render('index', { title: dbs});

  })

})



router.get('/database/:name',function (req, res) {

  var dbname = req.params.name

  if(!dbname) {
    console.log(res, "Database not selected")
  }

  var sql = "SHOW TABLES IN " + dbname

  mysql.query(sql, [], function (err, result) {

    if(err) {
      console.log(res, err.toString(), err)
    }

    var tables = []

    for (var i = 0; i < result.length; i++) {
      tables.push(result[i]["Tables_in_" + dbname])
    }

    res.render('tables', { data: tables, db:dbname});


  })

})
router.get('/database/:db/:name/:page',function (req, res) {

  var dbname = req.params.db
  var tablename = req.params.name
  var page = req.params.page
  var limit =15
  if(!dbname || !tablename) {
    console.log(res, "Database/ Table not selected")
  }

  var sql = "SHOW COLUMNS IN "+ tablename+ " IN " + dbname

  mysql.query(sql, [], function (err, result) {

    if(err) {
      console.log(res, err.toString(), err)
    }
    //
    // var tables = []
    //
    // for (var i = 0; i < result.length; i++) {
    //   tables.push(result[i]["Tables_in_" + dbname])
    // }
    structure=[]
    for (var i=0;i<result.length;i++) {
      structure.push(JSON.parse(JSON.stringify(result[i])))
    }
    console.log(structure[0].Key)


    var sql = "SELECT * FROM " + dbname +"."+ tablename + " LIMIT " + limit + " OFFSET " + ((page-1) * limit)


    mysql.query(sql, [], function (err, rows) {

      if (err) {
        console.log(res, err.toString(), err)
      }

      // console.log(rows)
      rowData=[]

      for (var i=0;i<rows.length;i++) {
        rowData.push(JSON.parse(JSON.stringify(rows[i])))
      }
      console.log(structure,rowData)
      res.render('data', { struct: structure,rows: rowData});


    })

  })

})

module.exports = router;
