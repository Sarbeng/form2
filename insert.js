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

        con.query("SELECT entered_ID as Staff_Number,UserName as Name, entered_amount as Amount_applied," +
            " date_and_time_information_was_entered as Date_Applied,entered_first_guarantor as First_Guarantor, " +
            "entered_second_guarantor as Second_Guarantor,entered_third_guarantor as Third_Guarantor FROM logTable " +
            "WHERE staff_ID_existed AND first_guarantor_existed AND second_guarantor_existed AND third_guarantor_existed ",function(err,rows){
        if (err) {
            console.error("SQL error ", err);
        }
        console.log(rows);    });

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