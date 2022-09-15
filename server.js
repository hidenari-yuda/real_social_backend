const express = require('express'); 
const app = express();
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');
const PORT = 8000;
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

//データベースに接続
mongoose.connect(
  process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
  console.log('Connected to database!');
})
.catch((err) => {
  console.log('ERROR:', err);
}); 

//ミドルウェアの設定
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//ローカルサーバーの設定
app.listen(PORT, () => console.log('Server is running on port ' + PORT));