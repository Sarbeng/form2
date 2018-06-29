var mysql = require('mysql');

var con = mysql.createConnection({
        hostname: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'loanschema'
    }
);

let values = [
  ['1','Kwadwo','Biology'],
    ['2','Sarbeng','Health'],
    ['3','Baafi','Health'],
    ['4','Josephine','Law'],
    ['5','Boakye','Law'],
    ['6','Asantewaa','Law']
];

con.connect(function(err){
    if (err) throw err;
});
/*if(con.query("SELECT *FROM logs where staffID = 3 ")){
    con.query("truncate logs ");
    con.query("INSERT INTO logs(staffID,numberOfLoans)select employees_staffID,count(*) as numbers from loans GROUP by(employees_staffID) ",function(err,rows){
        if (err) {
            console.error("SQL error ", err);
        }
        console.log(rows);    });
}*/
/*
con.query("INSERT INTO employees VALUES ?",[values],function(err,rows){
    if (err) {
        console.error("SQL error ", err);
    }
    console.log(rows);
});*/

/*con.query("INSERT INTO logTable(Staff_ID_existed) VALUES('y') where entered_ID LIKE '\"+req.body.staffID+\"'",[values],function(err,rows){
    if (err) {
        console.error("SQL error ", err);
    }
    console.log(rows);
});*/

con.end();