const router = require('express').Router();
const User = require('../models/User');

//CRUD処理
//ユーザー情報の更新
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json({ error: '権限がありません' });
  }
});

//ユーザー情報の削除
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json({ error: '権限がありません' });
  }
});

// //ユーザー情報の取得
// router.get('/:id', async (req, res) => {
//     try {
//       const user = await User.findById(req.params.id);
//       const { password, updatedAt, ...other } = user._doc;
//       return res.status(200).json(other);
//     } catch (err) {
//       return res.status(500).json(err);
//     }
// });

//クエリからユーザー情報の取得
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

    try {
      const user = userId 
        ? await User.findById(userId) 
        : await User.findOne({ username: username });

      const { password, updatedAt, ...other } = user._doc;
      return res.status(200).json(other);
    } catch (err) {
      return res.status(500).json(err);
    }
});

//ユーザーのフォロー
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
      });
      await currentUser.updateOne({
        $push: {
          followings: req.params.id,
        },
      });
      } else {
        return res.status(403).json({ error: 'すでにフォローしています' });
      }

      return res.status(200).json('フォローに成功しました');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json({ error: '自分自身はフォローできません' });
  }
});

//ユーザーのフォロー
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
      });
      await currentUser.updateOne({
        $pull: {
          followings: req.params.id,
        },
      });
      return res.status(200).json('フォロー解除しました');

      } else {
        return res.status(403).json({ error: 'すでにフォロー解除しています' });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json({ error: '自分自身はフォロー解除できません' });
  }
});

module.exports = router;