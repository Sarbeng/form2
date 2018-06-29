var express = require('express');
var router = express.Router();
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.post('/employee',function(req,res,next){
  try {
      let query = url.parse(req.url, true).query;
var sql = "SELECT  staffID FROM employees where (staffID REGEXP  '"+req.body.staffID+"')  AND (staffID REGEXP  '"+req.body.H_staffID+"') AND " +
    " (staffID REGEXP  '"+req.body.I_staffID+"')  AND (staffID REGEXP  '"+req.body.GstaffID+"') ";

      var asql = "INSERT INTO loans(employees_staffID,amount,guarantor1,guarantor2,guarantor3,dates) VALUES " +
          "( (select staffID from employees where staffID  LIKE '"+req.body.staffID+"'),'"+req.body.Amount+"'," +
          " (select staffID from employees where staffID  LIKE '"+req.body.GstaffID+"')," +
          "( select staffID from employees where staffID  LIKE '"+req.body.H_staffID+"' )," +
          "(select staffID from employees where staffID  LIKE '"+req.body.I_staffID+"'),CURRENT_TIMESTAMP) ";

      //lsql is written here
      let lsql = "INSERT INTO logs(staffID,numberOfLoans)select employees_staffID,count(*) as numbers from loans GROUP by employees_staffID";

      req.getConnection(function(err,con){
       if (err) {
         console.error("SQL Connection Error",err);
         return next (err);
       }
       else {
         con.query(asql,function(err,rows,fields){
           if (err) {
             console.log("SQL Error",err);
             return (res.render('error.html'));
           }
           let resEmp = [];
           for (let empIndex in rows ){
             let empObj = rows[empIndex];
             resEmp.push(empObj);
           }
           //res.json()
          res.redirect('success.html');
         });
           if(con.query("SELECT *FROM logs where staffID = '"+req.body.staffID+"' ")){
               con.query("truncate logs ");
         con.query(lsql,function(err,rows){
               if (err){
                   console.error("LSQL Error",err);
                   return next (err);
               }
               let lemp = [];
               for (let lindex in rows){
                   let lobj = rows[lindex];
                   lemp.push(lobj);
               }
           });
       }
      }

     // while(true)
     setTimeout(function(){
         //insertion of entered values occurs at this point
        con.query("INSERT INTO logTable(entered_ID,entered_first_guarantor,entered_second_guarantor,"+
          "entered_third_guarantor,entered_amount)"
      + " VALUES ('"+req.body.staffID+"','"+req.body.GstaffID+"','"+req.body.H_staffID+"','"+req.body.I_staffID+"',"
      +" '"+req.body.Amount+"')  ",function(err){
            if (err){
                console.error("SQL Query Error",err);
                return next (err);
            }}
          );
        //checking of validity of information occurs at this point
         if(con.query("SELECT staffID FROM employees where staffID = '"+req.body.staffID+"' ")){
            con.query("UPDATE logTable SET Staff_ID_existed =1");
         }
         else{
           con.query("UPDATE logTable SET Staff_ID_exited = 0 ");
         }
     },100);

  });}
  catch(ex){
    if (ex) {
      console.error("Internal Error",ex);
      return next (ex);
    }
  }


});
