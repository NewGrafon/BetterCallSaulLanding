const   fs = require('fs'),
        readline = require('readline'),
        { networkInterfaces } = require('os'),
        express = require('express'),
        app = express(),
        ejs = require('ejs'),
        bodyParser = require('body-parser'),
        path = require('path');


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const LifecycleEvent = process.env.npm_lifecycle_event;
const SERVER_PORT = 3011;
let localURL = "";
let DOMAIN = "";

if (LifecycleEvent == 'dev') {
    require('dotenv').config();
    localURL = `127.0.0.1:${SERVER_PORT}`;
} else {
    const nets = networkInterfaces();
    const results = {};
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    
    try {
        if (results.Ethernet[0] != (null || undefined)) localURL = `${results.Ethernet[0]}:${SERVER_PORT}`;
    } catch (e) {
        localURL = `127.0.0.1:${SERVER_PORT}`;
    } 
}

async function start() {
    try {
        if (LifecycleEvent != 'dev') 
            DOMAIN = await readAndFixFirstLine('DOMAIN.txt');
        else 
            DOMAIN = null;

        app.listen(SERVER_PORT, () => {
            if (LifecycleEvent == 'dev')
                console.log(`Link to site: ${localURL}`);
            else
                console.log(`Link to site: ${DOMAIN}`);
        });
    } catch (e) {
        console.log(e);
    }
}

async function readAndFixFirstLine(path) {
    const inputStream = fs.createReadStream(path);
    try {
        for await (const line of readline.createInterface(inputStream)) return line.replaceAll(' ', '');
        return null; // If the file is empty.
    }
    finally {
        inputStream.destroy(); // Destroy file stream.
    }
}

start();
// const WebNameToUser = DOMAIN != null ? DOMAIN : localURL;

/* ЗАПРОСЫ */
const main = '/';
app.get(main, (req, res) => {
    try {
        res.render('index', {page: main});
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

const aboutMe = '/about_me';
app.get(aboutMe, (req, res) => {
    try {
        res.render('aboutMe', {page: aboutMe});
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

const services = '/services';
app.get(services, (req, res) => {
    try {
        res.render('services', {page: services});
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

const cases = '/cases';
app.get(cases, (req, res) => {
    try {
        res.render('cases', {page: cases});
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

const news = '/news';
app.get(news, (req, res) => {
    try {
        res.render('news', {page: news});
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

const caseSingle = '/case_single';
app.get(caseSingle, (req, res) => {
    try {
        let prevPage = '';
        if (req.query.prevPage != (null || undefined))
            prevPage = req.query.prevPage == 'news' ? 'news' 
                        : req.query.prevPage == 'cases' ? 'cases' 
                        : prevPage;
        
        res.render('case_single', {page: caseSingle, previousPage: prevPage});
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

const contacts = '/contacts';
app.get(contacts, (req, res) => {
    try {
        res.render('contacts', {page: contacts});
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});