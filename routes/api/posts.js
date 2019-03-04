const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const validatePostInput = require("../../validation/post");

const Post = require("../../models/post");
const Profile = require("../../models/profile");

router.get("/test", (req, res) => res.json({ msg: "Posts works!" }));

// GET all posts
router.get("/", (req, res) => {
  Post.find()
    .sort({ data: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404))
    .json({ nopostsfound: "Posts not found" });
});
// GET a post via ID
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: "Post not found" }));
});

// POST to Create Post api/posts -Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }, (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      // If any errors, send 400
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  })
);

// DELETE /api/post/:id -private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }
          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

//POST to api/posts/like/:id
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res.status(400).json({ alreadyliked: "User already liked" });
          }
          //Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

//POST to api/posts/unlike/:id
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res.status(400).json({ alreadyliked: "User hasn't Liked" });
          }
          //get like index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //Splice out of array
          post.likes.splice(removeIndex, 1);
          //save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res
            .status(404)
            .json({ postnotfound: "Post not found for unlike action" })
        );
    });
  }
);

//POST to add comments api/posts/comment/:id -Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      // If any errors, send 400
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //Add to comments array
        post.comment.unshift(newComment);
        //save
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        releaseEvents.status(404).json({ postnotfound: "No post found" })
      );
  }
);

//DELETE to add comments api/posts/comment/:id/:comment_id -Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      // If any errors, send 400
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
       //check if post exisits
       if(post.comment.filter(comment => comment._id.toString() === req.params.comment_id).length === 0 ){
         return res.status(404).json({ commentdoesntexist: 'Comment doesn;t exisit.'})
       }
       //GET remove index
       const removeIndex = post.comments 
       .map(item => item._id.toString())
       .index(req.params.comment_id);

       //Splice out
       post.comments.splice(removeIndex, 1);
       //save
       post.save().then(post => releaseEvents.json(post));
      })
      .catch(err =>
        releaseEvents.status(404).json({ postnotfound: "No post found" })
      );
  }
);

module.exports = router;
