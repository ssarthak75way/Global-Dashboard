export interface GettingStartedStep {
    title: string;
    description: string;
    code?: string;
    notes?: string[];
}

export const gettingStartedSteps: GettingStartedStep[] = [
    {
        title: '1. Fork and Clone the Repository',
        description: 'Fork the repository to your GitHub account and clone it locally',
        code: `# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/devconnect.git
cd devconnect`,
        notes: ['Replace YOUR_USERNAME with your GitHub username', 'Ensure you have Git installed']
    },
    {
        title: '2. Install Dependencies',
        description: 'Install dependencies for both client and server',
        code: `# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install`,
        notes: ['Requires Node.js 18+ and npm', 'This may take a few minutes']
    },
    {
        title: '3. Configure Environment Variables',
        description: 'Set up environment variables for both client and server',
        code: `# Server (.env in server directory)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Client (.env in client directory)
VITE_API_URL=http://localhost:5000`,
        notes: [
            'Create .env files in both client and server directories',
            'Never commit .env files to version control',
            'For email, use Gmail App Password for EMAIL_PASS',
            'MongoDB must be running locally or use MongoDB Atlas'
        ]
    },
    {
        title: '4. Set Up MongoDB',
        description: 'Ensure MongoDB is installed and running',
        code: `# Start MongoDB locally (macOS with Homebrew)
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify connection
mongosh mongodb://localhost:27017`,
        notes: ['Alternatively, use MongoDB Atlas for cloud database', 'Database will be created automatically on first run']
    },
    {
        title: '5. Run Development Servers',
        description: 'Start both client and server in development mode',
        code: `# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm run dev`,
        notes: [
            'Server runs on http://localhost:5000',
            'Client runs on http://localhost:5173',
            'Both support hot reload for development'
        ]
    },
    {
        title: '6. Create a Feature Branch',
        description: 'Always create a new branch for your contributions',
        code: `# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Example:
git checkout -b feature/add-dark-mode`,
        notes: ['Use descriptive branch names', 'Follow the naming convention: feature/, bugfix/, or docs/']
    },
    {
        title: '7. Make Your Changes',
        description: 'Follow the project coding standards and best practices',
        notes: [
            'Write clean, readable code with proper TypeScript types',
            'Follow the existing code structure and patterns',
            'Add comments for complex logic',
            'Test your changes thoroughly',
            'Ensure no lint errors (npm run lint)',
            'Update documentation if needed'
        ]
    },
    {
        title: '8. Commit and Push',
        description: 'Commit your changes with clear, descriptive messages',
        code: `# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add dark mode toggle to navbar"

# Push to your fork
git push origin feature/your-feature-name`,
        notes: [
            'Use conventional commit messages (feat:, fix:, docs:, etc.)',
            'Keep commits focused and atomic',
            'Write clear commit messages explaining what and why'
        ]
    },
    {
        title: '9. Create a Pull Request',
        description: 'Submit your changes for review',
        notes: [
            'Go to the original repository on GitHub',
            'Click "New Pull Request"',
            'Select your fork and branch',
            'Write a clear PR description explaining your changes',
            'Link any related issues',
            'Wait for code review and address feedback',
            'Once approved, your PR will be merged!'
        ]
    }
];
