const express = require('express');
const router = express.Router();
const https = require('https');

let url = 'https://shielded-headland-24739.herokuapp.com/static/users.txt';

const fetchData = (url, func) => {
  https.get(url, res => {
    res.setEncoding('utf-8');
    let body = '';
    res.on('data', data => {
      body += data;
    });
    res.on('end', () => {
      func(body);
    });
  });
};

const parseData = (data, func) => {
  let users = [];
  data.split('|').forEach(element => {
    let user = {};
    element.split('&').forEach(elem => {
      let ele = elem.split('=');
      user[ele[0]] = ele[1];
    });
    users.push(user);
  });
  func(users);
};

router.get('/', (req, res) => {
  res.send('Test');
});

router.get('/users', (req, res) => {
  fetchData(url, (data) => {
    parseData(data, (users)=>{
      res.send(users);
    });
  });
});

module.exports = router;
