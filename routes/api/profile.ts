import { Request, Response } from "express";
const express = require("express");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const auth = require("../../middleware/auth");

const router = express.Router();

// @routes         GET api/profile/me
// @desc           Get current users profile
// @access         Private
router.get("/me", auth, async (req: any, res: Response) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res
        .status(400)
        .send({ msg: "There is no profile for this user." });
    }

    res.json(profile);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json("Server error...");
  }
});

// @routes         POST api/profile
// @desc           Create or update user profile
// @access         Private
router.post("/", [
  auth,
  [check("status").not().isEmpty(), check("skills").not().isEmpty()],
  async (req: any, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    interface ProfileFields {
      user?: String;
      company?: String;
      website?: String;
      location?: String;
      status?: String;
      bio?: String;
      githubusername?: String;
      skills?: [String];
      social?: Social;
    }

    // Build profile object
    const profileFields: ProfileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills
        .split(",")
        .map((skill: any) => skill.trim());

    interface Social {
      youtube?: String;
      twitter?: String;
      facebook?: String;
      linkedin?: String;
      instagram?: String;
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // if profile update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error("Server Error");
    }
  },
]);

module.exports = router;
