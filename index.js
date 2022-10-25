const   fs = require('fs'),
        readline = require('readline'),
        { networkInterfaces } = require('os'),
        express = require('express'),
        app = express(),
        ejs = require('ejs'),
        path = require('path');


app.set('view engine', 'ejs');
app.set('views', 'views');

//app.use(bodyParser.urlencoded({ extended: true }));
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

start();
// const WebNameToUser = DOMAIN != null ? DOMAIN : localURL;

/* ЗАПРОСЫ */

app.get('/', (req, res) => {
    try {
        res.render('index');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

app.get('/about_me', (req, res) => {
    try {
        res.render('aboutMe');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

app.get('/services', (req, res) => {
    try {
        res.render('services');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

app.get('/cases', (req, res) => {
    try {
        res.render('cases');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

app.get('/news', (req, res) => {
    try {
        res.render('news');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

app.get('/news_single', (req, res) => {
    try {
        res.render('news_single');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

app.get('/contacts', (req, res) => {
    try {
        res.render('contacts');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});