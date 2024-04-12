const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql');
const querystring = require('querystring');

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
        pathname = '/index/index.html'; // Default to index.html
    }

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

    if (req.method === 'POST' && parsedUrl.pathname === '/submit-form') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const formData = querystring.parse(body);
                const sql = 'INSERT INTO forms (name, email, message) VALUES (?, ?, ?)';
                connection.query(sql, [formData.name, formData.email, formData.message], (err, result) => {
                    if (err) {
                        console.error('Error inserting data into MySQL:', err);
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal Server Error');
                    } else {
                        console.log('Data inserted successfully');

                        // Redirect to index.html in the index folder
                        const redirectPathname = '/index/index.html';

                        // Send response with script for popup and reloading the page
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(`
                            <script>
                                alert('Form submitted successfully');
                                setTimeout(function() {
                                    window.location.href = '${redirectPathname}'; // Redirect to index.html
                                }, 1000); // Delay for 1 second (1000 milliseconds)
                            </script>
                        `);
                    }
                });
            } catch (error) {
                console.error('Error parsing form data:', error);
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Bad Request');
            }
        });
    } else {
        fs.readFile(path.join(__dirname, pathname), (err, data) => {
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
