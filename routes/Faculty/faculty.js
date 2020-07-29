var express = require("express");
var router = express.Router();

const Subject = require("../../models/Subject");
const Chapter = require("../../models/Chapter");
const Notes = require("../../models/Notes");
const Videos = require("../../models/Videos");
const Faculty = require("../../models/Faculty");

/* Google Drive API */
var formidable = require("formidable");
const fs = require("fs");
const { google } = require("googleapis");
const readline = require("readline");

const SCOPES = [
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive",
];
const TOKEN_PATH = "token.json";

const auth = require("./auth");
router.use(auth);

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/faculty/login");
};

const isFaculty = (req, res, next) => {
  if (req.user.faculty_id) {
    return next();
  }
  res.redirect("/faculty/login");
};
router.get("/", (req, res) => {
  res.redirect("/faculty/login");
});

router.get("/upload", isLoggedIn, isFaculty, (req, res) => {
  Subject.find({}, (err, subject) => {
    if (err) console.log(err);
    res.render("./Faculty/uploadMain", { subject: subject });
  });
});

router.get("/upload/subject/", (req, res) => {
  Subject.findById(req.query.subject)
    .populate("chapters")
    .exec((err, subject) => {
      if (err) console.log(err);
      res.render("./Faculty/upload1", { subject: subject });
    });
});

/*Uploading notes to google drive */

function authorize(credentials, callback, next, fields, req, res) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      console.log(err);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, next, fields, req, res);
  });
}

var fileID;
var filePath;
async function uploadImage(auth, next, fields, req, res) {
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: fields.title + ".jpg",
    parents: ["1HtGt_wqUnjG4-b0eAqKnZcrHzrvq9FGF"],
  };
  const media = {
    mimeType: "image/jpg",
    body: fs.createReadStream(filePath),
  };

  console.log("IN UPLOAD FILE");
  try {
    console.log("IN UPLOAD FILE 1");
    var file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log("IN UPLOAD FILE 2");
    fileID = file.data.id;
    var imageLink = "https://drive.google.com/uc?export=view&id=" + fileID;

    console.log(imageLink);
    console.log(fields);

    Chapter.findById(fields.chapter, (err, chapter) => {
      if (err) console.log(err);

      var date = new Date();

      var newNote = new Notes();

      newNote.title = fields.title;
      newNote.link = imageLink;
      newNote.faculty = req.user.username;
      newNote.facultyId = req.user.faculty_id;
      newNote.chapter = chapter.chapter_name;
      newNote.chapterId = chapter._id;
      newNote.subject = req.params.subname;
      newNote.date = date.toDateString();

      newNote.save((err, v) => {
        if (err) console.log(err);

        chapter.notes.push(v);
        chapter.save((err, c) => {
          if (err) console.log(err);
          console.log(c);
          Faculty.findById(req.user.faculty_id, (err, fac) => {
            if (err) console.log(err);
            fac.notes.push(v);
            fac.save((err, f) => {
              if (err) console.log(err);
              console.log("Faculty saved: ", f);
              res.redirect("/faculty/myuploads");
            });
          });
        });
      });
    });
  } catch (e) {
    console.log(e);
  }
}

async function uploadPdf(auth, next, fields, req, res) {
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: fields.title + ".pdf",
    parents: ["1HtGt_wqUnjG4-b0eAqKnZcrHzrvq9FGF"],
  };
  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };

  console.log("IN UPLOAD FILE");
  try {
    console.log("IN UPLOAD FILE 1");
    var file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log("IN UPLOAD FILE 2");
    fileID = file.data.id;
    var imageLink = "https://drive.google.com/uc?export=view&id=" + fileID;

    console.log(imageLink);
    console.log(fields);

    Chapter.findById(fields.chapter, (err, chapter) => {
      if (err) console.log(err);

      var date = new Date();

      var newNote = new Notes();

      newNote.title = fields.title;
      newNote.link = imageLink;
      newNote.faculty = req.user.username;
      newNote.facultyId = req.user.faculty_id;
      newNote.chapter = chapter.chapter_name;
      newNote.chapterId = chapter._id;
      newNote.subject = req.params.subname;
      newNote.date = date.toDateString();

      newNote.save((err, v) => {
        if (err) console.log(err);

        chapter.notes.push(v);
        chapter.save((err, c) => {
          if (err) console.log(err);

          Faculty.findById(req.user.faculty_id, (err, fac) => {
            if (err) console.log(err);
            fac.notes.push(v);
            fac.save((err, f) => {
              if (err) console.log(f);
              res.redirect("/faculty/myuploads");
            });
          });
        });
      });
    });
  } catch (e) {
    console.log(e);
  }
}

function fun1(req, res, next) {
  console.log("In fun1");
  const form = formidable({ multiples: true });

  form.parse(req, function (err, fields, files) {
    if (err) console.log(err);

    filePath = files.note.path;

    if (fields.type == "pdf") {
      fs.readFile("credentials.json", (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        authorize(JSON.parse(content), uploadPdf, next, fields, req, res);
      });
    } else {
      fs.readFile("credentials.json", (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        authorize(JSON.parse(content), uploadImage, next, fields, req, res);
      });
    }
  });
}

router.post("/upload/:subname/chapter/notes", fun1, (req, res) => {
  res.redirect("/myuploads");
});

/* Uploading videos ====================================== */

router.post("/upload/:subname/chapter/videos", (req, res) => {
  Chapter.findById(req.body.chapter, (err, chapter) => {
    if (err) console.log(err);
    var date = new Date();

    var newVideo = new Videos(req.body);

    newVideo.faculty = req.user.username;
    newVideo.facultyId = req.user.faculty_id;
    newVideo.chapter = chapter.chapter_name;
    newVideo.chapterId = chapter._id;
    newVideo.subject = req.params.subname;
    newVideo.date = date.toDateString();

    newVideo.save((err, v) => {
      if (err) console.log(err);

      chapter.videos.push(v);
      chapter.save((err, c) => {
        if (err) console.log(err);

        Faculty.findById(req.user.faculty_id, (err, fac) => {
          if (err) console.log(err);
          fac.videos.push(v);
          fac.save((err, f) => {
            if (err) console.log(err);
            res.redirect("/faculty/myuploads");
          });
        });
      });
    });
  });
});

/*My uploads */
router.get("/myuploads", isLoggedIn, isFaculty, (req, res) => {
  Faculty.findById(req.user.faculty_id)
    .populate("notes")
    .populate("videos")
    .exec((err, fac) => {
      res.render("./Faculty/myuploads", { faculty: fac });
    });
});

/*Delete uploads*/
router.delete("/:fid/video/delete/:vid/:cid", (req, res) => {
  console.log("In fun");
  Faculty.findById(req.params.fid, (err, faculty) => {
    var idx = faculty.videos.indexOf(req.params.vid);
    faculty.videos.splice(idx, 1);
    faculty.save((err, f) => {
      if (err) console.log(err);
      Videos.findByIdAndRemove(req.params.vid, (err) => {
        if (err) console.log(err);
        else {
          Chapter.findById(req.params.cid, (err, chapter) => {
            idx = chapter.videos.indexOf(req.params.vid);
            chapter.videos.splice(idx, 1);
            chapter.save();
          });
          res.status(200).json({ status: "success" });
        }
      });
    });
  });
});

router.delete("/:fid/note/delete/:nid/:cid", (req, res) => {
  Faculty.findById(req.params.fid, (err, faculty) => {
    var idx = faculty.notes.indexOf(req.params.nid);
    faculty.notes.splice(idx, 1);
    faculty.save((err, f) => {
      if (err) console.log(err);
      Notes.findByIdAndRemove(req.params.nid, (err) => {
        if (err) console.log(err);
        else {
          Chapter.findById(req.params.cid, (err, chapter) => {
            idx = chapter.notes.indexOf(req.params.nid);
            chapter.notes.splice(idx, 1);
            chapter.save();
          });
          res.status(200).json({ status: "success" });
        }
      });
    });
  });
});

module.exports = router;
