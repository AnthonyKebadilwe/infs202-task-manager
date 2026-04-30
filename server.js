const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
   res.json({ message: 'Task Manager API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



