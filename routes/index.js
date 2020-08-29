var express = require('express');
var router = express.Router();
// var mysql = require('../mysql')
// var config=mysql.config



var mysql      = require('mysql')

var db_config = {
  host     : '',
  user     : '',
  password :  ''
}

function config (a,b,c){
  // sessionStorage.setItem("host", a)
  // sessionStorage.setItem("user", b)
  // sessionStorage.setItem("password", c)
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


var mysql=connection





/* GET home page. */


router.post('/',function (req, res) {
  console.log("in")
  // console.log(mysql.config)
  config(req.body.host,req.body.user,req.body.password)
  db_config.host="sdasd"


  console.log(db_config)


  res.redirect('/database');
})


router.get('/',function (req, res) {
  console.log(db_config)

  // console.log(mysql.config.user)


  res.render('login');
})



router.get('/database',function (req, res) {

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





router.get('/database/:db/:name/edit/:pk',function (req, res) {

  var dbname = req.params.db
  var tablename = req.params.name
  var pk=req.params.pk

  var primary = 0
  console.log("into")

  if (!dbname || !tablename) {
    console.log(res, "Database/ Table not selected")
  }

  var sql = "SHOW COLUMNS IN " + tablename + " IN " + dbname

  mysql.query(sql, [], function (err, result) {

    if (err) {
      console.log(res, err.toString(), err)
    }
    //
    // var tables = []
    //
    // for (var i = 0; i < result.length; i++) {
    //   tables.push(result[i]["Tables_in_" + dbname])
    // }
    structure = []
    for (var i = 0; i < result.length; i++) {
      structure.push(JSON.parse(JSON.stringify(result[i])))
    }
    for (var i = 0; i < structure.length; i++) {
      console.log(structure[i].Key == 'PRI')
      if (structure[i].Key == 'PRI') {
        primary = structure[i].Field

      }
    }
    sql = "SELECT * FROM " + dbname + "." + tablename + " where " + primary + " = " + pk;
    mysql.query(sql, [], function (err, result) {

      if (err) {
        console.log(res, err.toString(), err)
      }
      console.log(JSON.parse(JSON.stringify(result))[0].city)

      res.render('edit',{struct:structure, data:JSON.parse(JSON.stringify(result))})

    })


  })
})
router.post('/database/:db/:name/edit/:pk',function (req, res) {
  var string = ''
  var dbname = req.params.db
  var tablename = req.params.name
  var pk = req.params.pk

  var sql = "SHOW COLUMNS IN " + tablename + " IN " + dbname

  mysql.query(sql, [], function (err, result) {

    if (err) {
      console.log(res, err.toString(), err)
    }
    //
    // var tables = []
    //
    // for (var i = 0; i < result.length; i++) {
    //   tables.push(result[i]["Tables_in_" + dbname])
    // }
    structure = []
    for (var i = 0; i < result.length; i++) {
      structure.push(JSON.parse(JSON.stringify(result[i])))
    }
    for (var i = 0; i < structure.length; i++) {
      console.log(structure[i].Key == 'PRI')
      if (structure[i].Key == 'PRI') {
        primary = structure[i].Field

      }
    }


    var sql = "UPDATE "+ dbname + "." + tablename + " SET "

    console.log(JSON.parse(JSON.stringify(req.body)).city)
    Object.keys(JSON.parse(JSON.stringify(req.body))).forEach(function (key) {
      if (eval("req.body." + key) != '') {
        sql += key + "= \"" + eval("JSON.parse(JSON.stringify(req.body))." + key) + "\","
        console.log(key, eval("JSON.parse(JSON.stringify(req.body))." + key))
      }
    })
    sql=sql.slice(0, -1);
    // console.log(sql,"===")
    sql += " WHERE "+ primary +"="+ pk
    console.log(sql)

    mysql.query(sql, [], function (err, result) {

      if (err) {
        console.log(res, err.toString(), err)
      }
      console.log(sql[sql.length-1]
      )

      res.redirect("/")

    })

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
  if (page<1){
    page=1
  }
  page=parseInt(page)
  var limit =15
  var primary=0
  var pri=[]
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
    for (var i=0;i<structure.length;i++) {
      console.log(structure[i].Key=='PRI')
      if(structure[i].Key=='PRI'){
        primary=structure[i].Field

      }
    }




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
      console.log(structure)
      for (var i=0;i<rows.length;i++) {
        // console.log(eval(rowData[i]+"."+primary))
        // console.log(eval("rowData[i]."+primary))
        pri.push(eval("rowData[i]."+primary))

      }
      res.render('data', { struct: structure,rows: rowData, pri:pri, db:dbname,table:tablename, prev:page-1, next:page+1, page:page});


    })

  })

})
router.post('/database/:db/:name/:page',function (req, res) {
  var search= req.body.search
  var dbname = req.params.db
  var tablename = req.params.name
  var page = req.params.page
  page=parseInt(page)

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
    sql="SELECT * FROM " + dbname +"."+ tablename +  " WHERE "

    for (var i=0;i<structure.length;i++) {

      sql+=structure[i].Field +" LIKE "+"\"%"+ search+ "%\"" + " OR "

      }

  sql=sql.slice(0,-3)
    console.log(sql)




    // var sql = "SELECT * FROM " + dbname +"."+ tablename + " LIMIT " + limit + " OFFSET " + ((page-1) * limit)


    mysql.query(sql, [], function (err, rows) {

      if (err) {
        console.log(res, err.toString(), err)
      }

      // console.log(rows)
      rowData=[]

      for (var i=0;i<rows.length;i++) {
        rowData.push(JSON.parse(JSON.stringify(rows[i])))
      }
      // console.log(primary)



      console.log(rows)
      res.render('result', { struct: structure,rows: rowData, db:dbname,table:tablename});


    })

  })

})







router.get('/database/:db/:name/del/:pk',function (req, res) {

  var dbname = req.params.db
  var tablename = req.params.name
  var pk=req.params.pk


  console.log("into")

  if (!dbname || !tablename) {
    console.log(res, "Database/ Table not selected")
  }

  var sql = "SHOW COLUMNS IN " + tablename + " IN " + dbname

  mysql.query(sql, [], function (err, result) {

    if (err) {
      console.log(res, err.toString(), err)
    }
    //
    // var tables = []
    //
    // for (var i = 0; i < result.length; i++) {
    //   tables.push(result[i]["Tables_in_" + dbname])
    // }
    structure = []
    for (var i = 0; i < result.length; i++) {
      structure.push(JSON.parse(JSON.stringify(result[i])))
    }
    for (var i = 0; i < structure.length; i++) {
      console.log(structure[i].Key == 'PRI')
      if (structure[i].Key == 'PRI') {
        primary = structure[i].Field

      }
    }
     sql = "DELETE FROM "+dbname+"."+ tablename+" WHERE " +primary + " = "+ pk
    console.log(sql)

    mysql.query(sql, [], function (err, result) {

      if (err) {
        console.log(res, err.toString(), err)
      }
      // console.log(JSON.parse(JSON.stringify(result))[0].city)

      res.redirect("/database/"+dbname+"/"+tablename+"/1")

    })


  })
})





router.get('/database/:db/:name/new/add', function (req, res) {

  var dbname = req.params.db
  var tablename = req.params.name


  var primary=0
  var pri=[]
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
    var fields=[]

    for (var i=0;i<result.length;i++) {
      structure.push(JSON.parse(JSON.stringify(result[i])))
    }
    for (var i=0;i<structure.length;i++) {
      console.log(structure[i].Key=='PRI')
      if(structure[i].Key=='PRI'){
        primary=structure[i].Field

      }
    if(structure[i].Extra!='auto_increment'){

      fields.push(structure[i].Field)
    }
    }
    console.log(fields)


      res.render('newrow', { struct: structure, pri:pri, db:dbname,table:tablename, field:fields});





    //
    //
    // mysql.query(sql, [], function (err, rows) {
    //
    //   if (err) {
    //     console.log(res, err.toString(), err)
    //   }
    //
    //   // console.log(rows)
    //   rowData=[]
    //
    //   for (var i=0;i<rows.length;i++) {
    //     rowData.push(JSON.parse(JSON.stringify(rows[i])))
    //   }
    //   console.log(structure)
    //   for (var i=0;i<rows.length;i++) {
    //     // console.log(eval(rowData[i]+"."+primary))
    //     // console.log(eval("rowData[i]."+primary))
    //     pri.push(eval("rowData[i]."+primary))
    //
    //   }
    //   res.render('data', { struct: structure,rows: rowData, pri:pri, db:dbname,table:tablename, prev:page-1, next:page+1, page:page});


    // })

  })

})

















router.post('/database/:db/:name/new/add', function (req, res) {

  var body=JSON.parse(JSON.stringify(req.body))
  var dbname = req.params.db
  var tablename = req.params.name
  console.log(body)



  var primary=0
  var pri=[]
  if(!dbname || !tablename) {
    console.log(res, "Database/ Table not selected")
  }

  var sql = "INSERT INTO "+dbname+"."+ tablename +" ("

  Object.keys(body).forEach(function(key){
    sql+=key+","
  })
  sql=sql.slice(0,-1)
  sql+=") VALUES( "
  Object.keys(body).forEach(function(key){
    sql+="\""+eval("body."+key)+"\""
    sql+=","
  })
  sql=sql.slice(0,-1)
sql+=")"
  console.log(sql)


  mysql.query(sql, [], function (err, result) {

    if (err) {
      console.log(res, err.toString(), err)
    }

    res.redirect("/database/"+dbname+"/"+tablename+"1")

  })

  // mysql.query(sql, [], function (err, result) {
  //
  //   if(err) {
  //     console.log(res, err.toString(), err)
  //   }
  //   //
  //   // var tables = []
  //   //
  //   // for (var i = 0; i < result.length; i++) {
  //   //   tables.push(result[i]["Tables_in_" + dbname])
  //   // }
  //   structure=[]
  //   var fields=[]
  //
  //   for (var i=0;i<result.length;i++) {
  //     structure.push(JSON.parse(JSON.stringify(result[i])))
  //   }
  //   for (var i=0;i<structure.length;i++) {
  //     console.log(structure[i].Key=='PRI')
  //     if(structure[i].Key=='PRI'){
  //       primary=structure[i].Field
  //
  //     }
  //   if(structure[i].Extra!='auto_increment'){
  //
  //     fields.push(structure[i].Field)
  //   }
  //   }
  //   console.log(fields)
  //
  //
  //     res.render('newrow', { struct: structure, pri:pri, db:dbname,table:tablename, field:fields});
  //
  //
  //
  //
  //
  //   //
  //   //
  //   // mysql.query(sql, [], function (err, rows) {
  //   //
  //   //   if (err) {
  //   //     console.log(res, err.toString(), err)
  //   //   }
  //   //
  //   //   // console.log(rows)
  //   //   rowData=[]
  //   //
  //   //   for (var i=0;i<rows.length;i++) {
  //   //     rowData.push(JSON.parse(JSON.stringify(rows[i])))
  //   //   }
  //   //   console.log(structure)
  //   //   for (var i=0;i<rows.length;i++) {
  //   //     // console.log(eval(rowData[i]+"."+primary))
  //   //     // console.log(eval("rowData[i]."+primary))
  //   //     pri.push(eval("rowData[i]."+primary))
  //   //
  //   //   }
  //   //   res.render('data', { struct: structure,rows: rowData, pri:pri, db:dbname,table:tablename, prev:page-1, next:page+1, page:page});
  //
  //
  //   // })
  //
  // })

})








module.exports = router;
