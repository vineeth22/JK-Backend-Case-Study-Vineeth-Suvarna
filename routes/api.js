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
};

const getWords = (n, chars, func) => {
  let l = chars.length;
  let words = [];
  for (let i = 0; i < n; i += 1) {
    let word = '';
    for (let j = 0; j < 6; j += 1) {
      word += chars.charAt(Math.floor(Math.random() * l));
    }
    words.push(word);
  }
  func(words);
};

let url = 'https://shielded-headland-24739.herokuapp.com/static/users.txt';

router.get('/', (req, res) => {
  let data = {};
  data.base_path_url = '/api';
  data.valid_api_endpoints_url = '/';
  data.fetch_users_url = '/users';
  data.fetch_users_by_user_id_url = '/users/{user_id}';
  data.generate_random_words_url = '/words?q={query}{&chars,n}';
  res.send(data);
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

router.get('/data', (req, res) => {
  let chars = req.query.chars;
  let n = req.query.n;
  const chartest = new RegExp('^[A-Za-z]+$');
  const ntest = new RegExp('^[0-9]+$');
  if (ntest.test(n) && chartest.test(chars)) {
    n = parseInt(n, 10);
    getWords(n, chars, (words) => {
      res.send(words);
    });
  } else {
    res.send('Invalid parameters');
  }
});

module.exports = router;
