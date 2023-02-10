const express = require('express')
const mysql = require('mysql');   
const app = express();
const bodyParser = require('body-parser')


app.set('view engine','ejs')
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'project',
    port: '3306'
})

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL database = ', err)
        return;
    }
    console.log('MySQL successfully connected!');
})



app.get('/', (req, res) => {
  connection.query('SELECT * FROM employee', (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching employee' })
    } else {
      res.render('pages/index', {result})
    }
  })
})

app.get("/create_employee", (req, res) => {
  res.render("pages/create_employee");
});

app.post('/create_employee', (req, res) => {
    const { ugdn, name, job_title,department,email } = req.body;
    connection.query('INSERT INTO employee ( ugdn , name, job_title, department, email) VALUES(?, ?, ?,? ,?)', [ugdn, name, job_title,department,email] , (err, results, fields) => {
      if (err) {
        res.status(500).send({ error: 'Error inserting todo' })
      } else {
        res.redirect('/')
      }
    })
  })

// DELETE

app.post('/delete', (req, res) => {
  const ugdn = req.body.ugdn;
  const sql = 'DELETE FROM employee WHERE ugdn = ?';
  connection.query(sql, [ugdn], (error, results) => {
    if (error) throw error;
    return res.redirect('/');
  });
});

app.get("/edit_employee/:ugdn", async (req, res) => {
  const ugdn = req.params.ugdn;
  connection.query("SELECT * FROM employee WHERE ugdn = ?", [ugdn], (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.status(400).send();
    }
    res.render("pages/edit_employee", { employee: results[0] });
  });
});

app.patch("/update_employee", async (req, res) => {
  const ugdn = req.body.ugdn;
  const { name, job_title, department, email } = req.body;

  try {
    connection.query(
      "UPDATE employee SET name = ?, job_title = ?, department = ?, email = ? WHERE ugdn = ?",
      [name, job_title, department, email, ugdn],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.redirect("/");
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// READ
app.get("/read", async (req, res) => {
    try {
        connection.query("SELECT * FROM employee", (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// READ single users from db
app.get("/read/single/:ugdn", async (req, res) => {
    const ugdn = req.params.ugdn;

    try {
        connection.query("SELECT * FROM employee WHERE ugdn = ?", [ugdn], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// UPDATE data
app.patch("/update/:ugdn", async (req, res) => {
    const ugdn = req.params.ugdn;
    const newname = req.body.newname;

    try {
        connection.query("UPDATE employee SET name = ? WHERE ugdn = ?", [newname, ugdn], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({ message: "name updated successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})




app.listen(3000, () => console.log('Server is running on port 3000'));