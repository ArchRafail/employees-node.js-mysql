const express = require('express');
const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

const app = express();

// Create Database
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, err => {
        if (err) {
            throw err;
        }
        res.send('Database Created');
    })
});

// Create Table
app.get('/createemployees', (req, res) => {
    let sql = 'CREATE TABLE employees(id int AUTO_INCREMENT, name VARCHAR(255), designation VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, err => {
        if (err) {
            throw err;
        }
        res.send('Employees table Created');
    });
});

// Insert Employee
app.get('/employees1', (req, res) => {
    let employee = {name: 'Jake Smith', designation: 'Chief Executive Officer'};
    let sql = 'INSERT INTO employees SET ?';
    let query = db.query(sql, employee, err => {
        if (err) {
            throw err;
        }
        res.send('Employee 1 added');
    });
});

// Select employees
app.get('/getemployees', (req, res) => {
    let sql = 'SELECT * FROM employees';
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json({msg: 'Employees details fetched', results});
    });
});

// Update employee
app.get('/updateemployee/:id', (req, res) => {
    let newEmployee = {
        name: 'John Doe',
        designation: 'Technology Manager'
    };
    let conditions = buildConditions(newEmployee);
    let sql = 'UPDATE employees SET ' + conditions.where + ' WHERE id = ' + req.params.id;
    console.log(db.query(sql, conditions.values,));
    let query = db.query(sql, conditions.values, (err) => {
        if (err) {
            throw err;
        }
        res.send('Employee updated');
    });
});

// Delete employee
app.get('/deleteemployee/:id', (req, res) => {
    let sql = `DELETE FROM employees WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err) => {
        if (err) {
            throw err;
        }
        res.send('Employee deleted');
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

function buildConditions(params) {
    let conditions = [];
    let values = [];

    if (typeof params.name !== 'undefined') {
        conditions.push("name = ?");
        values.push(params.name);
    }

    if (typeof params.designation !== 'undefined') {
        conditions.push("designation = ?");
        values.push(params.designation);
    }

    return {
        where: conditions.length ?
            conditions.join(', ') : '1',
        values: values
    };
}