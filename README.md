# form2

 con.query("INSERT INTO logtable(entered_ID,entered_first_guarantor,entered_second_guarantor,entered_third_guarantor,entered_amount," +
                  "date_time_information_was_entered) VALUES ('"+req.body.staffID+"','"+req.body.GstaffID+"','"+req.body.H_staffID+"'," +
                  "'"+req.body.I_staffID+"',CURRENT_TIMESTAMP)");

                    if(con.query("SELECT staffID from employees where staffID LIKE '"+req.body.staffID+"'")&&
                                    con.query("SELECT staffID from employees where staffID LIKE '"+req.body.GstaffID+"'")
                                    &&con.query("SELECT staffID FROM employees WHERE staffID LIKE '"+req.body.H_staffID+"'")&&
                                    con.query("SELECT staffID FROM employees WHERE staffID LIKE '"+req.body.I_staffID+"'  ")){
                                    con.query("UPDATE logTable SET Staff_ID_existed ='yes',first_guarantor_existed ='yes', second_guarantor_existed ='yes' ," +
                                        "third_guarantor_existed='yes'  where entered_ID = " +
                                        "( select staffID from employees where staffID LIKE '"+req.body.staffID+"') ",function(err,rows){
                                       if (err){ console.error("SQL Error",err);}

                                    });
                                }