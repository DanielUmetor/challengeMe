import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/index.js';

// Get the current directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'static' directory
app.use(express.static(path.join(__dirname, 'static')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/html/index.html'));
});

// Users Routes
app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/user/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users WHERE userID = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/register', async (req, res) => {
    const { userName, userSurname, userAge, userEmail, userPwd } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Users (userName, userSurname, userAge, userEmail, userPwd) VALUES (?, ?, ?, ?, ?)', 
        [userName, userSurname, userAge, userEmail, userPwd]);
        res.status(201).json({ userID: result.insertId });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.patch('/user/:id', async (req, res) => {
    const { userName, userSurname, userAge, userEmail, userPwd } = req.body;
    try {
        await pool.query('UPDATE Users SET userName = ?, userSurname = ?, userAge = ?, userEmail = ?, userPwd = ? WHERE userID = ?', 
        [userName, userSurname, userAge, userEmail, userPwd, req.params.id]);
        res.json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Users WHERE userID = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Products Routes
app.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Products');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/product/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Products WHERE prodID = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/addProduct', async (req, res) => {
    const { prodName, prodQuantity, prodPrice, prodURL, userID } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Products (prodName, prodQuantity, prodPrice, prodURL, userID) VALUES (?, ?, ?, ?, ?)', 
        [prodName, prodQuantity, prodPrice, prodURL, userID]);
        res.status(201).json({ prodID: result.insertId });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.patch('/product/:id', async (req, res) => {
    const { prodName, prodQuantity, prodPrice, prodURL } = req.body;
    try {
        await pool.query('UPDATE Products SET prodName = ?, prodQuantity = ?, prodPrice = ?, prodURL = ? WHERE prodID = ?', 
        [prodName, prodQuantity, prodPrice, prodURL, req.params.id]);
        res.json({ message: 'Product updated' });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.delete('/product/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Products WHERE prodID = ?', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
