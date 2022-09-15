const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');


//投稿を作成する
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を更新する
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userId === post.userId || req.body.isAdmin) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json(post);
    } else {
      return res.status(403).json({ error: '権限がありません' });
    }
  } catch (err) {
    return res.status(403).json(err);
  } 
});

//投稿を削除する
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userId === post.userId || req.body.isAdmin) {
      await post.deleteOne();
      return res.status(200).json('投稿削除に成功しました');
    } else {
      return res.status(403).json({ error: '権限がありません' });
    }
  } catch (err) {
    return res.status(403).json(err);
  } 
});

//投稿を取得する
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
      return res.status(200).json(post);
  } catch (err) {
    return res.status(403).json(err);
  } 
});

//投稿にいいねをする
router.put('/:id/like', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({
          $push: {
            likes: req.body.userId,
          },
      });
      return res.status(200).json('いいねに成功しました');
      } else {
        await post.UpdateOne({
          $pull: {
            likes: req.body.userId,
        }
      });
      return res.status(200).json('いいねを解除しました');
     }
    } catch (err) {
      return res.status(500).json(err);
    }
});

//タイムラインの取得
router.get('/timeline/:userId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({userId: currentUser._id});
    
    const followingPosts = await Promise.all(
      currentUser.followings.map((followingsId) => {
        return Post.find({userId: followingsId});
      })
    );
    return res.status(200).json(userPosts.concat(...followingPosts));

  } catch (err) {
    return res.status(500).json(err);
  }
});

//自分の投稿をタイムラインとして取得
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({username: req.params.username});
    const posts = await Post.find({userId: user._id});
    
    return res.status(200).json(posts);

  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;