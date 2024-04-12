const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root3600',
  database: 'portfolio'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/html1', express.static(path.join(__dirname, 'html1')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/html1/contact.html'));
});

function insertFormData(name, email, message) {
  const sql = 'INSERT INTO forms (name, email, message) VALUES (?, ?, ?)';
  connection.query(sql, [name, email, message], (err, results) => {
    if (err) {
      console.error('Error inserting data into the forms table: ' + err.stack);
      return;
    }
    console.log('Inserted data into the forms table.');
  });
}

// Example route to handle form submissions
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;
  insertFormData(name, email, message);
  res.send('Form submitted successfully!');
});

// Close the connection when the server stops
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error('Error closing the database connection: ' + err.stack);
      return;
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
