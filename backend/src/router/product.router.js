const router = require('express').Router();

router.get('/products', (req, res) => {
  res.send('Hello router!');
});

router.get('/products', (req, res) => {
  res.send('Hello router!');
});

router.post('/products', (req, res) => {
  res.send('Hello router!');
});

router.put('/products', (req, res) => {
  res.send('Hello router!');
});

router.delete('/products', (req, res) => {
  res.send('Hello router!');
});

module.exports = router;    
