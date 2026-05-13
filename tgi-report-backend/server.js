const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// --- 1. Middleware သတ်မှတ်ခြင်း ---
app.use(express.json());

// CORS Setting - Frontend ကနေ လှမ်းခေါ်ရင် Error မတက်အောင် ခွင့်ပြုပေးခြင်း
const allowedOrigins = [
  'http://localhost:3000',
  'https://tgi-japanese-language-report-system.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// --- 2. MongoDB ချိတ်ဆက်ခြင်း ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 3. Schema နှင့် Model သတ်မှတ်ခြင်း ---

// User Schema (Admin & Sensei)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['admin', 'sensei'], default: 'sensei' },
  createdAt: { type: Date, default: Date.now }
});

// Report Schema
const reportSchema = new mongoose.Schema({
  senseiId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senseiName: String,
  level: String,
  classType: String,
  classTime: String,
  minnaProgress: Object,
  kanjiProgress: Object,
  n3Progress: Object,
  otherReason: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Report = mongoose.model('Report', reportSchema);

// --- 4. Middleware for JWT Verification ---
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

// --- 5. Authentication Routes ---

/**
 * @POST /api/auth/login
 * User login
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role: user.role, name: user.name }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 6. User Management Routes (Admin Only) ---

/**
 * @POST /api/users
 * Create new user (Admin only)
 */
app.post('/api/users', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const { email, password, name, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role: role || 'sensei'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }
    });
  } catch (error) {
    console.error("User Creation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @GET /api/users
 * Get all users (Admin only)
 */
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @PUT /api/users/:id
 * Update user (Admin only)
 */
app.put('/api/users/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const { id } = req.params;
    const { email, name, role, password } = req.body;

    const updateData = { email, name, role };
    if (password) {
      updateData.password = await bcryptjs.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @DELETE /api/users/:id
 * Delete user (Admin only)
 */
app.delete('/api/users/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 7. Report Routes ---

/**
 * @POST /api/reports
 * Create report
 */
app.post('/api/reports', verifyToken, async (req, res) => {
  try {
    const newReport = new Report({
      senseiId: req.user.id,
      ...req.body,
      senseiName: req.user.name
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: "Report saved successfully!",
      report: newReport
    });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @GET /api/reports
 * Get all reports
 */
app.get('/api/reports', verifyToken, async (req, res) => {
  try {
    let query = {};
    
    // If user is sensei, only show their reports
    if (req.user.role === 'sensei') {
      query.senseiId = req.user.id;
    }

    const allReports = await Report.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reports: allReports });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @GET /api/reports/:id
 * Get single report
 */
app.get('/api/reports/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    // Check if user has access
    if (req.user.role === 'sensei' && report.senseiId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Get Report Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @PUT /api/reports/:id
 * Update report
 */
app.put('/api/reports/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    // Check if user has access
    if (req.user.role === 'sensei' && report.senseiId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const updatedReport = await Report.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: "Report updated successfully!",
      report: updatedReport
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @DELETE /api/reports/:id
 * Delete report
 */
app.delete('/api/reports/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    // Check if user has access
    if (req.user.role === 'sensei' && report.senseiId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    await Report.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Report deleted successfully!"
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 8. Initialize Admin Account ---
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'waddy@tgi.com' });
    if (!adminExists) {
      const hashedPassword = await bcryptjs.hash('Waddy@tgi', 10);
      const adminUser = new User({
        email: 'waddy@tgi.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin'
      });
      await adminUser.save();
      console.log("✅ Admin account created: waddy@tgi.com");
    }
  } catch (error) {
    console.error("Admin Initialization Error:", error);
  }
};

// --- 9. Server စတင်ခြင်း ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initializeAdmin();
});