const { Router } = require('express'); 
const router = Router();
//routes
router.get('/', (req, res) => {
  const data = {
    send: 200
  };
  res.json(data);
});

module.exports = router;