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
        con.query("INSERT INTO logTable(entered_ID,userName,userDepartment,entered_first_guarantor,entered_second_guarantor,"+
          "entered_third_guarantor,entered_amount,date_and_time_information_was_entered)"
      + " VALUES ('"+req.body.staffID+"',(select name from employees where staffID like '"+req.body.staffID+"' ),"
      +"(select department from employees where staffID LIKE '"+req.body.staffID+"' ),"
      +" '"+req.body.GstaffID+"','"+req.body.H_staffID+"','"+req.body.I_staffID+"'"
      +", '"+req.body.Amount+"',CURRENT_TIMESTAMP)  ",function(err){
            if (err){
                console.error("SQL Query Error",err);
                return next (err);
            }}
          );

         con.query("UPDATE logTable SET Staff_ID_existed = case when entered_ID ="+
         "(select staffID from employees where staffID LIKE '"+req.body.staffID+"') then '1' else '0'"
         +"end WHERE entered_ID LIKE '"+req.body.staffID+"' ");


         con.query("UPDATE logTable SET first_guarantor_existed = case when entered_first_guarantor ="+
         "(select staffID from employees where staffID LIKE '"+req.body.GstaffID+"') then '1' else '0'"
         +"end WHERE entered_ID LIKE '"+req.body.staffID+"' ");
         
         con.query("UPDATE logTable SET second_guarantor_existed = case when entered_second_guarantor ="+
         "(select staffID from employees where staffID LIKE '"+req.body.H_staffID+"') then '1' else '0'"
         +"end WHERE entered_ID LIKE '"+req.body.staffID+"' ");

         
         con.query("UPDATE logTable SET third_guarantor_existed = case when entered_third_guarantor ="+
         "(select staffID from employees where staffID LIKE '"+req.body.I_staffID+"') then '1' else '0'"
         +"end WHERE entered_ID LIKE '"+req.body.staffID+"' ")

     },100);

  });}
  catch(ex){
    if (ex) {
      console.error("Internal Error",ex);
      return next (ex);
    }
  }


});



router.post('/approveDis',function(req,res,next){
    try{
        let query = url.parse(req.url,true).query;
        let sql = "UPDATE ";

        req.getConnection(function(err,con){
            if (err){
                console.error("SQL Connection Error",err);
                return next (err);
            }
            else{
                con.query(sql,function(err,rows){
                    if (err){
                        console.log("SQL Error",err);
                        return next (err);
                    }
                    let resEmp = [];
                    for (var userIndex in rows) {
                        let userObj = rows[userIndex];
                        resEmp.push(userObj);
                    }
                   // res.send('Success eh')
                    res.json(resEmp);
                });
            }

        });
    }
    catch (ex){
        if (ex){
            console.error("Internal Error",ex);
            return next (ex);
        }
    }
});


router.get('/getInfo',function(req,res,next){
    try{
        let query = url.parse(req.url,true).query;
        let sql = "SELECT entered_ID as Staff_Number,UserName as Name, entered_amount as Amount_applied," +
            " date_and_time_information_was_entered as Date_Applied,entered_first_guarantor as First_Guarantor, " +
            "entered_second_guarantor as Second_Guarantor,entered_third_guarantor as Third_Guarantor FROM logTable " +
            "WHERE staff_ID_existed AND first_guarantor_existed AND second_guarantor_existed AND third_guarantor_existed ";

        req.getConnection(function(err,con){
            if (err){
                console.error("SQL Connection Error",err);
                return next (err);
            }
            else{
                con.query(sql,function(err,rows){
                    if (err){
                        console.log("SQL Error",err);
                        return next (err);
                    }
                    let resEmp = [];
                    for (var userIndex in rows) {
                        let userObj = rows[userIndex];
                        resEmp.push(userObj);
                    }
                    // res.send('Success eh')
                    res.json(resEmp);
                });
            }

        });
    }
    catch (ex){
        if (ex){
            console.error("Internal Error",ex);
            return next (ex);
        }
    }
});
