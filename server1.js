const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root3600',
    database: 'portfolio'
});
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    let pathname = parsedUrl.pathname;
    if (pathname === '/') {
        pathname = '/html1/contact.html'; // Default to index.html
    }

    // Map requested URLs to corresponding files
    const fileTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
    };

    const extname = path.extname(pathname);
    const contentType = fileTypes[extname] || 'text/plain';
    let filePath;

    if (extname === '.html') {
        // For HTML files
        const htmlFiles = {
            '/index/index.html': '/index/index.html',
            '/html1/navbar.html': 'html1/navbar.html',
            '/html1/div1.html': 'html1/div1.html',
            '/html1/about.html': 'html1/about.html',
            '/html1/port.html': 'html1/port.html',
            '/html1/contact.html': 'html1/contact.html',
            '/html1/footer.html': 'html1/footer.html'
        };
        filePath = path.join(__dirname, htmlFiles[pathname]);
    } else {
        // For other files (like images)
        const imageFiles = {
            '/images/API.jpg': 'images/API.jpg',
            '/images/js.jpg': 'images/js.jpg',
            '/images/js2.jpg': 'images/js2.jpg',
            '/images/node.jpg': 'images/node.jpg',
            '/images/css.jpg': 'images/css.jpg',
            '/images/img1.jpg': 'images/img1.jpg',
            '/images/react.jpg': 'images/react.jpg',
            '/images/express.jpg': 'images/express.jpg',
            '/images/img2.jpg': 'images/img2.jpg'
        };
        filePath = path.join(__dirname, imageFiles[pathname]);
    }
    if (req.method === 'POST' && parsedUrl.pathname === '/submit') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });

        req.on('end', () => {
            try {
                const formData = JSON.parse(body);
                const sql = 'INSERT INTO forms (name, email, message) VALUES (?, ?, ?)';
                connection.query(sql, [formData.name, formData.email, formData.message], (err, result) => {
                    if (err) {
                        console.error('Error inserting data into MySQL:', err);
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal Server Error');
                    } else {
                        console.log('Data inserted successfully');
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('Data inserted successfully');
                    }
                });
            } catch (error) {
                console.error('Error parsing form data:', error);
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Bad Request');
            }
        });
    } else {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('File not found');
            } else {
                res.writeHead(200, {'Content-Type': contentType});
                res.end(data);
            }
        });
    }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});