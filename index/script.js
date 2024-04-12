const headerEl = document.getElementById('navbar');
fetch('../html1/navbar.html')
    .then(response => response.text())
    .then(html => headerEl.innerHTML = html);

const div1 = document.getElementById('div1');
fetch('../html1/div1.html')
    .then(response => response.text())
    .then(html => div1.innerHTML = html);

const about = document.getElementById('about');
fetch('../html1/about.html')
    .then(response => response.text())
    .then(html => about.innerHTML = html);

const port = document.getElementById('port');
fetch('../html1/port.html')
    .then(response => response.text())
    .then(html => port.innerHTML = html);

const contact = document.getElementById('contact');
fetch('../html1/contact.html')
    .then(response => response.text())
    .then(html => contact.innerHTML = html);

const footer = document.getElementById('footer');
fetch('../html1/footer.html')
    .then(response => response.text())
    .then(html => footer.innerHTML = html);
