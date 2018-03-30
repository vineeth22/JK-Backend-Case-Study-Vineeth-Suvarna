const express = require('express');
const router = express.Router();
const https = require('https');

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

const getUser = (userId, users, func) => {
  let index = -1;
  for (let i = 0; i < users.length; i += 1) {
    if (users[i].id === userId) {
      index = i;
      break;
    }
  }
  if (index !== -1) {
    func(users[index]);
  } else {
    func('User does not exist');
  }
}

let url = 'https://shielded-headland-24739.herokuapp.com/static/users.txt';

router.get('/', (req, res) => {
  res.send('Test');
});

router.get('/users', (req, res) => {
  fetchData(url, (data) => {
    parseData(data, (users) => {
      res.send(users);
    });
  });
});

router.get('/users/:user_id', (req, res) => {
  fetchData(url, (data) => {
    parseData(data, (users) => {
      let userId = req.params.user_id;
      getUser(userId, users, (user) => {
        res.send(user);
      });
    });
  });
});

module.exports = router;
