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
          //here in take a log of the users actions. everything that he does.
             con.query("INSERT INTO logTable(entered_ID,entered_first_guarantor,entered_second_guarantor,entered_third_guarantor,entered_amount,date_and_time_information_was_entered) " +
                 "VALUES ('"+req.body.staffID+"','"+req.body.GstaffID+"'," +
                 "'"+req.body.H_staffID+"','"+req.body.I_staffID+"','"+req.body.Amount+"',CURRENT_TIMESTAMP)");
              setTimeout(function(){
              if(con.query("SELECT staffID from employees where staffID LIKE '"+req.body.staffID+"'")&&
                  con.query("SELECT staffID from employees where staffID LIKE '"+req.body.GstaffID+"'")
                  &&con.query("SELECT staffID FROM employees WHERE staffID LIKE '"+req.body.H_staffID+"'")&&
                  con.query("SELECT staffID FROM employees WHERE staffID LIKE '"+req.body.I_staffID+"'  ")){
                  con.query("UPDATE logTable SET Staff_ID_existed ='yes',first_guarantor_existed ='yes', second_guarantor_existed ='yes' ," +
                      "third_guarantor_existed='yes'  where entered_ID = " +
                      "( select staffID from employees where staffID LIKE '"+req.body.staffID+"') ",function(err,rows){
                     if (err){ console.error("SQL Error",err);}

                  });
              }/*
                  con.query("INSERT INTO logTable (entered_first_guarantor)VALUES ('"+req.body.GstaffID+"')");
                  if (con.query("SELECT staffID from employees where staffID LIKE '"+req.body.GstaffID+"') ")){
                      con.query("UPDATE logTable SET first_guarantor_existed= 'yes' where entered_ID = ''",function(err){
                          if (err){console.error("SQL Error",err);}
                      })
                  }*/
          },1000);

              //logging guarantors



  });}
  catch(ex){
    if (ex) {
      console.error("Internal Error",ex);
      return next (ex);
    }
  }


});
