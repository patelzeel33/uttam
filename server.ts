import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Define Application Schema
const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  hasLicense: { type: String },
  experience: { type: String },
  status: { type: String, default: 'pending' },
  hoursLogged: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

// Avoid schema overwrite issue on hot reloads
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Connect to MongoDB Atlas
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  } else {
    console.warn('⚠️ MONGODB_URI is not set. Database operations will fail or return empty.');
  }

  // API Routes MUST be defined BEFORE Vite middleware
  app.get('/api/health', async (req, res) => {
    let count = 0;
    try {
      if (mongoose.connection.readyState === 1) {
        count = await Application.countDocuments();
      }
    } catch (e) {}
    res.json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'no_db', applicationsCount: count });
  });

  // Handle registration submissions
  app.post('/api/register', async (req, res) => {
    try {
      if (!MONGODB_URI || mongoose.connection.readyState !== 1) {
        return res.status(500).json({ error: 'Database not connected. Please provide MONGODB_URI in Settings.' });
      }

      const data = req.body;
      
      // Basic validation
      if (!data.fullName || !data.phoneNumber) {
        return res.status(400).json({ error: 'Full Name and Phone Number are required' });
      }

      const application = new Application({
        ...data,
        status: 'pending',
        hoursLogged: 0,
      });

      await application.save();
      console.log('New application saved to DB:', application._id);

      res.status(201).json({ 
        message: 'Application submitted successfully',
        applicationId: application._id
      });
    } catch (error) {
      console.error('Error processing registration:', error);
      res.status(500).json({ error: 'Failed to process registration' });
    }
  });

  // Admin route to view applications (for demo purposes)
  app.get('/api/applications', async (req, res) => {
    try {
      if (!MONGODB_URI || mongoose.connection.readyState !== 1) {
        return res.json([]); // Return empty list if no connection
      }

      const applications = await Application.find().sort({ submittedAt: -1 }).lean();
      
      // Format _id to id to match frontend expectations
      res.json(applications.map(app => ({
        ...app,
        id: app._id.toString()
      })));
    } catch (error) {
       console.error('Error fetching applications:', error);
       res.status(500).json({ error: 'Failed to retrieve applications' });
    }
  });

  // Admin route to update an application
  app.patch('/api/applications/:id', async (req, res) => {
    try {
      if (!MONGODB_URI || mongoose.connection.readyState !== 1) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;
      const { status, hoursLogged } = req.body;
      
      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (hoursLogged !== undefined) updateData.hoursLogged = Number(hoursLogged);

      const updatedApp = await Application.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      ).lean();
      
      if (!updatedApp) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json({
        ...updatedApp,
        id: updatedApp._id.toString()
      });
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({ error: 'Failed to update application' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
