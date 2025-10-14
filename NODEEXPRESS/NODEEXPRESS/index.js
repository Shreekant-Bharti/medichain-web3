const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/UserAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection failed:", err));

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ratingsGiven: [
    {
      to: String,
      score: {
        communication: Number,
        confidence: Number,
        responsibility: Number,
        collaboration: Number,
        adaptability: Number
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const taskDocSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  link: { type: String, required: true }
});

const meetReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  docLink: { type: String }
});

const User = mongoose.model('User', userSchema);
const TaskDoc = mongoose.model('TaskDoc', taskDocSchema);
const MeetReport = mongoose.model('MeetReport', meetReportSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pages')));

// Token Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Token missing");

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

// Routes
app.get('/', (req, res) => {
  res.redirect('/lsland.html');
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: cleanedEmail });
    if (existing) return res.status(400).send("User already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email: cleanedEmail, password: hashedPassword });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Registration successful", token });

  } catch (error) {
    console.error("[REGISTER] Error:", error);
    res.status(500).send("Internal server error");
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/dashboard', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
});

app.get('/api/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('name email ratingsGiven');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/rate', verifyToken, async (req, res) => {
  try {
    const { to, ratings } = req.body;
    const fromUserId = req.user.userId;
    const user = await User.findById(fromUserId);

    if (!to || typeof ratings !== 'object') return res.status(400).json({ message: "Missing data" });

    const criteria = ["communication", "confidence", "responsibility", "collaboration", "adaptability"];
    const score = {};
    for (let key of criteria) {
      if (!ratings[key] || ratings[key] < 1 || ratings[key] > 10) {
        return res.status(400).json({ message: `Invalid rating for ${key}` });
      }
      score[key] = ratings[key];
    }

    const existing = user.ratingsGiven.find(r => r.to === to);
    if (existing) {
      existing.score = score;
      existing.date = new Date();
    } else {
      user.ratingsGiven.push({ to, score, date: new Date() });
    }

    await user.save();
    res.json({ message: `Reviewed ${to}`, score });

  } catch (err) {
    console.error("Rating error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get reviews received by current user
// Get reviews received by current user
app.get('/api/reviews', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId).select('name');
    const allUsers = await User.find(); // <-- fetch all users including self

    const reviews = [];

    allUsers.forEach(user => {
      user.ratingsGiven.forEach(rating => {
        if (rating.to === currentUser.name) {
          reviews.push({
            from: user.name,
            score: rating.score
          });
        }
      });
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching received reviews:", error);
    res.status(500).json({ message: "Failed to fetch received reviews" });
  }
});



app.post('/api/task-docs', verifyToken, async (req, res) => {
  try {
    const { date, link } = req.body;
    if (!date || !link) return res.status(400).json({ message: "Missing data" });

    const doc = await TaskDoc.findOneAndUpdate(
      { userId: req.user.userId, date: new Date(date) },
      { link },
      { upsert: true, new: true }
    );

    res.json({ message: "Saved", doc });
  } catch (err) {
    console.error("Task doc error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/task-docs', verifyToken, async (req, res) => {
  try {
    const docs = await TaskDoc.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD THIS ROUTE to fix "adding meet reports" issue
app.post('/api/meet-reports', verifyToken, async (req, res) => {
  try {
    const { date, description, docLink } = req.body;
    if (!date || !description) return res.status(400).json({ message: "Date and description required" });

    await MeetReport.create({
      userId: req.user.userId,
      date: new Date(date),
      description,
      docLink
    });

    res.json({ message: "Meet report saved" });
  } catch (err) {
    console.error("Meet report error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/meet-reports', verifyToken, async (req, res) => {
  try {
    const reports = await MeetReport.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/export-reviews', verifyToken, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).send("Date is required");

    const start = new Date(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const allUsers = await User.find();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('GD Reviews');

    sheet.columns = [
      { header: 'Reviewer', key: 'from' },
      { header: 'Reviewee', key: 'to' },
      { header: 'Communication', key: 'communication' },
      { header: 'Confidence', key: 'confidence' },
      { header: 'Responsibility', key: 'responsibility' },
      { header: 'Collaboration', key: 'collaboration' },
      { header: 'Adaptability', key: 'adaptability' },
      { header: 'Date', key: 'date' },
      { header: 'Average Score', key: 'average' }
    ];

    allUsers.forEach(user => {
      user.ratingsGiven.forEach(rating => {
        const d = new Date(rating.date);
        if (d >= start && d < end) {
          const avg = (
            rating.score.communication +
            rating.score.confidence +
            rating.score.responsibility +
            rating.score.collaboration +
            rating.score.adaptability
          ) / 5;

          sheet.addRow({
            from: user.name,
            to: rating.to,
            ...rating.score,
            date: d.toLocaleDateString(),
            average: avg.toFixed(2)
          });
        }
      });
    });

    res.setHeader('Content-Disposition', `attachment; filename=gd-reviews-${date}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Export error:", err);
    res.status(500).send("Export failed");
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}/lsland.html`));
