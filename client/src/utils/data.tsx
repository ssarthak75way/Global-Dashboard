import React from 'react';
import {
    Description as DescriptionIcon,
    CheckCircle as CheckCircleIcon,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Forum as ForumIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';

export interface Dependency {
    name: string;
    version: string;
    description: string;
}

export interface PageRoute {
    name: string;
    route: string;
    description: string;
    icon: React.ReactNode;
}

export interface DocVersion {
    version: string;
    label: string;
    isLatest?: boolean;
    date: string;
}

export const docVersions: DocVersion[] = [
    { version: 'v1.1.0', label: 'v1.1.0 (Latest)', isLatest: true, date: 'Feb 2026' },
    { version: 'v1.0.0', label: 'v1.0.0 (Previous)', isLatest: false, date: 'Jan 2026' }
];

export const dependencies: Dependency[] = [
    { name: '@mui/material', version: '^5.15.0', description: 'Material-UI component library' }, // Adjusted to stable v5 or v6 beta
    { name: 'react', version: '^18.2.0', description: 'React library' },
    { name: 'react-router-dom', version: '^6.22.0', description: 'Routing library' }, // Adjusted to standard v6
    { name: 'axios', version: '^1.6.0', description: 'HTTP client' },
    { name: 'react-hook-form', version: '^7.51.0', description: 'Form management' },
    { name: 'zod', version: '^3.22.0', description: 'Schema validation' }, // Zod is currently v3
    { name: '@dnd-kit/core', version: '^6.1.0', description: 'Drag and drop' },
    { name: 'html2pdf.js', version: '^0.10.1', description: 'PDF generation' },
    { name: 'react-calendar-heatmap', version: '^1.9.0', description: 'Activity heatmap' },
    { name: 'react-quill-new', version: '^3.1.0', description: 'Rich text editor' }
];

export const pages: PageRoute[] = [
    {
        name: 'Landing Page',
        route: '/',
        description: 'Public landing page with platform features',
        icon: <DescriptionIcon />
    },
    {
        name: 'Login',
        route: '/login',
        description: 'User authentication page',
        icon: <PersonIcon />
    },
    {
        name: 'Signup',
        route: '/signup',
        description: 'User registration with password strength indicator',
        icon: <PersonIcon />
    },
    {
        name: 'Verify OTP',
        route: '/verify-otp',
        description: 'Email verification page',
        icon: <CheckCircleIcon />
    },
    {
        name: 'Dashboard',
        route: '/dashboard',
        description: 'User dashboard with analytics and stats',
        icon: <DashboardIcon />
    },
    {
        name: 'Profile',
        route: '/profile',
        description: 'User profile with experience, projects, and activity',
        icon: <PersonIcon />
    },
    {
        name: 'Board',
        route: '/board',
        description: 'Kanban task board with drag-and-drop',
        icon: <AssignmentIcon />
    },
    {
        name: 'Feed',
        route: '/feed',
        description: 'Social feed with posts and interactions',
        icon: <ForumIcon />
    },
    {
        name: 'Resume',
        route: '/resume',
        description: 'Professional resume builder with PDF export',
        icon: <DescriptionIcon />
    },
    {
        name: '404 Not Found',
        route: '*',
        description: 'Custom 404 error page',
        icon: <DescriptionIcon />
    }
];

export const components = {
    'Landing Components': [
        { name: 'QuoteBanner', description: 'Rotating tech quotes banner' },
        { name: 'HeroSection', description: 'Main hero section with CTA buttons' },
        { name: 'FeaturesSection', description: 'Platform features showcase' },
        { name: 'AboutSection', description: 'About the platform' },
        { name: 'HowItWorksSection', description: 'Step-by-step guide' },
        { name: 'SupportSection', description: 'Support and contact information' },
        { name: 'CTASection', description: 'Call-to-action section' },
        { name: 'LandingFooter', description: 'Footer with links and social media' }
    ],
    'Profile Components': [
        { name: 'ProfileHeader', description: 'User profile header with avatar and bio' },
        { name: 'ExperienceSection', description: 'Work experience timeline' },
        { name: 'EducationSection', description: 'Education history' },
        { name: 'ProjectsSection', description: 'User projects showcase' },
        { name: 'SkillsSection', description: 'Skills with proficiency levels' },
        { name: 'CertificationsSection', description: 'Certifications and achievements' },
        { name: 'ActivitySection', description: 'Activity heatmap and stats' }
    ],
    'Feed Components': [
        { name: 'CreatePost', description: 'Rich text post creation with markdown support' },
        { name: 'PostItem', description: 'Individual post with like/comment functionality' },
        { name: 'CommentSection', description: 'Nested comments system' },
        { name: 'PostActions', description: 'Post action buttons (like, comment, share)' }
    ],
    'Dashboard Components': [
        { name: 'StatsCard', description: 'Statistics display cards' },
        { name: 'ActivityChart', description: 'Activity visualization charts' },
        { name: 'RecentActivity', description: 'Recent user activity feed' },
        { name: 'QuickActions', description: 'Quick action buttons' }
    ],
    'Common Components': [
        { name: 'PublicNavbar', description: 'Navigation bar for public pages (auth-aware)' },
        { name: 'UserMenu', description: 'User dropdown menu' },
        { name: 'UserSearch', description: 'User search with autocomplete' },
        { name: 'FollowButton', description: 'Follow/unfollow button component' },
        { name: 'NetworkModal', description: 'Followers/following modal' },
        { name: 'ActivityHeatmap', description: 'GitHub-style activity heatmap' },
        { name: 'TokenCountdown', description: 'Session token countdown timer' },
        { name: 'Loader', description: 'Loading spinner component' },
        { name: 'CustomAlert', description: 'Premium confirmation dialog component' },
        { name: 'EditProfileDialog', description: 'Profile editing modal' }
    ]
};

export const features = [
    {
        title: 'Authentication & Authorization',
        items: [
            'Email/password authentication',
            'Google OAuth integration',
            'OTP email verification',
            'JWT token-based sessions',
            'Password strength validation',
            'Session timeout countdown'
        ]
    },
    {
        title: 'User Profile Management',
        items: [
            'Customizable profile with avatar',
            'Experience and education tracking',
            'Projects showcase',
            'Skills with proficiency levels',
            'Certifications management',
            'Activity heatmap (GitHub-style)',
            'Follow/unfollow system',
            'Network visualization'
        ]
    },
    {
        title: 'Social Features',
        items: [
            'Create posts with rich text (Markdown)',
            'Like and comment on posts',
            'Nested comments system',
            'User search and discovery',
            'Activity feed',
            'User profiles viewing'
        ]
    },
    {
        title: 'Productivity Tools',
        items: [
            'Kanban task board',
            'Drag-and-drop task management',
            'Task status tracking',
            'Professional resume builder',
            'PDF resume export',
            'Dashboard with analytics'
        ]
    },
    {
        title: 'UI/UX Features',
        items: [
            'Dark/light theme toggle',
            'Responsive design (mobile, tablet, desktop)',
            'Animated gradients and transitions',
            'Glassmorphism effects',
            'Password visibility toggle',
            'Real-time form validation',
            'Smooth scrolling navigation',
            'Custom 404 page'
        ]
    }
];

export const architecture = [
    {
        layer: 'Presentation Layer',
        description: 'React components with Material-UI',
        technologies: ['React 18', 'Material-UI 6', 'TypeScript', 'Emotion']
    },
    {
        layer: 'State Management',
        description: 'Context API for global state',
        technologies: ['AuthContext', 'ThemeContext', 'React Hooks']
    },
    {
        layer: 'Routing',
        description: 'Client-side routing with protected routes',
        technologies: ['React Router v7', 'Route Guards']
    },
    {
        layer: 'Data Layer',
        description: 'API communication and data fetching',
        technologies: ['Axios', 'REST API', 'JWT Authentication']
    },
    {
        layer: 'Form Management',
        description: 'Form handling and validation',
        technologies: ['React Hook Form', 'Zod Schema Validation']
    },
    {
        layer: 'Build & Dev Tools',
        description: 'Development and build tooling',
        technologies: ['Vite', 'TypeScript', 'ESLint', 'PostCSS']
    }
];

// API Endpoints Documentation
export interface APIEndpoint {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    description: string;
    auth: boolean;
    requestBody?: string;
    responseExample?: string;
    category: string;
}

export const apiEndpoints: APIEndpoint[] = [
    // Auth Endpoints
    {
        method: 'POST',
        path: '/api/auth/signup',
        description: 'Register a new user account',
        auth: false,
        category: 'Authentication',
        requestBody: `{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "referralCode": "ABC123" // optional
}`,
        responseExample: `{
  "message": "OTP sent to email",
  "userId": "user_123"
}`
    },
    {
        method: 'POST',
        path: '/api/auth/verify-otp',
        description: 'Verify email with OTP code',
        auth: false,
        category: 'Authentication',
        requestBody: `{
  "email": "john@example.com",
  "otp": "123456"
}`,
        responseExample: `{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "user_123", "name": "John Doe", "email": "john@example.com" }
}`
    },
    {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Login with email and password',
        auth: false,
        category: 'Authentication',
        requestBody: `{
  "email": "john@example.com",
  "password": "SecurePass123!"
}`,
        responseExample: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "user_123", "name": "John Doe", "email": "john@example.com" }
}`
    },
    {
        method: 'POST',
        path: '/api/auth/google',
        description: 'Authenticate with Google OAuth',
        auth: false,
        category: 'Authentication',
        requestBody: `{
  "credential": "google_oauth_token"
}`,
        responseExample: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "user_123", "name": "John Doe", "email": "john@example.com" }
}`
    },
    // User Endpoints
    {
        method: 'GET',
        path: '/api/users/me',
        description: 'Get current user profile',
        auth: true,
        category: 'Users',
        responseExample: `{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "bio": "Full-stack developer",
  "skills": [...],
  "experience": [...]
}`
    },
    {
        method: 'PUT',
        path: '/api/users/me',
        description: 'Update current user profile',
        auth: true,
        category: 'Users',
        requestBody: `{
  "name": "John Doe",
  "bio": "Senior Full-stack Developer",
  "avatar": "https://...",
  "skills": ["React", "Node.js", "TypeScript"]
}`,
        responseExample: `{
  "message": "Profile updated successfully",
  "user": { ... }
}`
    },
    {
        method: 'GET',
        path: '/api/users/search',
        description: 'Search for users by name or email',
        auth: true,
        category: 'Users',
        responseExample: `{
  "users": [
    { "id": "user_123", "name": "John Doe", "avatar": "https://..." },
    { "id": "user_456", "name": "Jane Smith", "avatar": "https://..." }
  ]
}`
    },
    {
        method: 'GET',
        path: '/api/users/:userId',
        description: 'Get user profile by ID',
        auth: true,
        category: 'Users',
        responseExample: `{
  "id": "user_123",
  "name": "John Doe",
  "bio": "Full-stack developer",
  "followers": 150,
  "following": 200
}`
    },
    // Posts Endpoints
    {
        method: 'GET',
        path: '/api/posts',
        description: 'Get all posts (feed)',
        auth: true,
        category: 'Posts',
        responseExample: `{
  "posts": [
    {
      "id": "post_123",
      "content": "Hello World!",
      "author": { "id": "user_123", "name": "John Doe" },
      "likes": 42,
      "comments": 5,
      "createdAt": "2026-02-12T10:00:00Z"
    }
  ]
}`
    },
    {
        method: 'POST',
        path: '/api/posts',
        description: 'Create a new post',
        auth: true,
        category: 'Posts',
        requestBody: `{
  "content": "This is my new post with **markdown** support!"
}`,
        responseExample: `{
  "message": "Post created successfully",
  "post": { "id": "post_123", ... }
}`
    },
    {
        method: 'POST',
        path: '/api/posts/:postId/like',
        description: 'Like or unlike a post',
        auth: true,
        category: 'Posts',
        responseExample: `{
  "message": "Post liked",
  "likes": 43
}`
    },
    {
        method: 'POST',
        path: '/api/posts/:postId/comments',
        description: 'Add a comment to a post',
        auth: true,
        category: 'Posts',
        requestBody: `{
  "content": "Great post!",
  "parentId": null // optional, for nested comments
}`,
        responseExample: `{
  "message": "Comment added",
  "comment": { "id": "comment_123", ... }
}`
    },
    // Follow Endpoints
    {
        method: 'POST',
        path: '/api/users/:userId/follow',
        description: 'Follow or unfollow a user',
        auth: true,
        category: 'Social',
        responseExample: `{
  "message": "User followed",
  "following": true
}`
    },
    {
        method: 'GET',
        path: '/api/users/:userId/followers',
        description: 'Get user followers list',
        auth: true,
        category: 'Social',
        responseExample: `{
  "followers": [
    { "id": "user_456", "name": "Jane Smith", "avatar": "https://..." }
  ]
}`
    },
    // Activity Endpoints
    {
        method: 'GET',
        path: '/api/users/:userId/activity',
        description: 'Get user activity heatmap data',
        auth: true,
        category: 'Activity',
        responseExample: `{
  "activity": [
    { "date": "2026-02-12", "count": 5 },
    { "date": "2026-02-11", "count": 3 }
  ],
  "stats": {
    "currentStreak": 7,
    "longestStreak": 15,
    "totalPosts": 142
  }
}`
    }
];

// Getting Started Guide
export interface GettingStartedStep {
    title: string;
    description: string;
    code?: string;
    notes?: string[];
}

export const gettingStartedSteps: GettingStartedStep[] = [
    {
        title: '1. Clone the Repository',
        description: 'Clone the DevConnect repository to your local machine',
        code: `git clone https://github.com/your-org/devconnect.git
cd devconnect`,
        notes: ['Ensure you have Git installed on your system']
    },
    {
        title: '2. Install Dependencies',
        description: 'Install both client and server dependencies',
        code: `# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install`,
        notes: ['Node.js version 18+ is required', 'npm version 9+ is recommended']
    },
    {
        title: '3. Environment Configuration',
        description: 'Set up environment variables for both client and server',
        code: `# Server .env file
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Client .env file
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id`,
        notes: [
            'Never commit .env files to version control',
            'Use strong, unique values for JWT_SECRET',
            'Configure Gmail app password for email functionality'
        ]
    },
    {
        title: '4. Start MongoDB',
        description: 'Ensure MongoDB is running locally or use a cloud instance',
        code: `# Start MongoDB locally (if installed)
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest`,
        notes: ['MongoDB 5.0+ is recommended', 'Alternatively, use MongoDB Atlas for cloud hosting']
    },
    {
        title: '5. Run the Application',
        description: 'Start both the server and client in development mode',
        code: `# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm run dev`,
        notes: [
            'Server runs on http://localhost:5000',
            'Client runs on http://localhost:5173',
            'Hot reload is enabled for both'
        ]
    },
    {
        title: '6. Access the Application',
        description: 'Open your browser and navigate to the application',
        notes: [
            'Navigate to http://localhost:5173',
            'Create a new account or login',
            'Check your email for OTP verification',
            'Start exploring the platform!'
        ]
    }
];

// Best Practices
export interface BestPractice {
    category: string;
    practices: {
        title: string;
        description: string;
        example?: string;
    }[];
}

export const bestPractices: BestPractice[] = [
    {
        category: 'Code Organization',
        practices: [
            {
                title: 'Component Structure',
                description: 'Keep components small and focused. Extract reusable logic into custom hooks.',
                example: `// Good: Small, focused component
const UserCard = ({ user }) => (
  <Card>
    <Avatar src={user.avatar} />
    <Typography>{user.name}</Typography>
  </Card>
);

// Better: Extract complex logic
const useUserData = (userId) => {
  const [user, setUser] = useState(null);
  // ... fetch logic
  return user;
};`
            },
            {
                title: 'File Naming',
                description: 'Use PascalCase for components, camelCase for utilities, and descriptive names.',
                example: `// Components
UserProfile.tsx
CreatePost.tsx

// Utilities
formatDate.ts
apiClient.ts

// Hooks
useAuth.ts
useTheme.ts`
            },
            {
                title: 'Folder Structure',
                description: 'Group related files by feature, not by type.',
                example: `// Good: Feature-based
components/
  profile/
    ProfileHeader.tsx
    ExperienceSection.tsx
  feed/
    CreatePost.tsx
    PostItem.tsx`
            }
        ]
    },
    {
        category: 'State Management',
        practices: [
            {
                title: 'Use Context Wisely',
                description: 'Only use Context for truly global state. Use local state for component-specific data.',
                example: `// Global: AuthContext, ThemeContext
// Local: Form state, UI toggles

const [isOpen, setIsOpen] = useState(false); // Local
const { user } = useAuth(); // Global`
            },
            {
                title: 'Avoid Prop Drilling',
                description: 'Use Context or composition to avoid passing props through multiple levels.',
                example: `// Bad: Prop drilling
<Parent user={user}>
  <Child user={user}>
    <GrandChild user={user} />

// Good: Context
const { user } = useAuth();`
            }
        ]
    },
    {
        category: 'Performance',
        practices: [
            {
                title: 'Memoization',
                description: 'Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders.',
                example: `// Memoize expensive calculations
const sortedUsers = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);`
            },
            {
                title: 'Code Splitting',
                description: 'Use React.lazy and Suspense for route-based code splitting.',
                example: `const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loader />}>
  <Dashboard />
</Suspense>`
            }
        ]
    },
    {
        category: 'TypeScript',
        practices: [
            {
                title: 'Type Everything',
                description: 'Avoid using "any". Define proper interfaces and types.',
                example: `// Bad
const user: any = fetchUser();

// Good
interface User {
  id: string;
  name: string;
  email: string;
}
const user: User = fetchUser();`
            },
            {
                title: 'Use Type Guards',
                description: 'Create type guards for runtime type checking.',
                example: `function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}`
            }
        ]
    },
    {
        category: 'Security',
        practices: [
            {
                title: 'Never Store Secrets in Code',
                description: 'Always use environment variables for sensitive data.',
                example: `// Bad
const API_KEY = 'sk_live_123456';

// Good
const API_KEY = import.meta.env.VITE_API_KEY;`
            },
            {
                title: 'Sanitize User Input',
                description: 'Always validate and sanitize user input on both client and server.',
                example: `// Use Zod for validation
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const result = userSchema.safeParse(input);`
            }
        ]
    }
];

// Security Features
export const securityFeatures = [
    {
        title: 'Authentication Flow',
        description: 'Multi-step authentication with email verification',
        features: [
            'Email/password registration with strong password requirements',
            'OTP verification via email',
            'Google OAuth 2.0 integration',
            'JWT token-based sessions with expiry',
            'Secure password hashing with bcrypt',
            'Session timeout with countdown timer'
        ]
    },
    {
        title: 'Authorization',
        description: 'Role-based access control and route protection',
        features: [
            'Protected routes requiring authentication',
            'JWT token validation on every request',
            'User-specific data access control',
            'Automatic token refresh mechanism'
        ]
    },
    {
        title: 'Data Protection',
        description: 'Secure data handling and storage',
        features: [
            'HTTPS-only in production',
            'Environment variables for sensitive data',
            'Input validation with Zod schemas',
            'XSS protection with sanitized inputs',
            'CORS configuration for API security',
            'Rate limiting on API endpoints'
        ]
    }
];

// Development Workflow
export const developmentWorkflow = {
    gitWorkflow: [
        {
            step: 'Create Feature Branch',
            command: 'git checkout -b feature/your-feature-name',
            description: 'Always create a new branch for each feature or bug fix'
        },
        {
            step: 'Make Changes',
            command: '# Edit files, test locally',
            description: 'Develop your feature with frequent commits'
        },
        {
            step: 'Commit Changes',
            command: 'git add .\ngit commit -m "feat: add user profile editing"',
            description: 'Use conventional commit messages (feat, fix, docs, style, refactor, test, chore)'
        },
        {
            step: 'Push to Remote',
            command: 'git push origin feature/your-feature-name',
            description: 'Push your branch to the remote repository'
        },
        {
            step: 'Create Pull Request',
            command: '# Create PR on GitHub',
            description: 'Create a PR with a clear description of changes'
        },
        {
            step: 'Code Review',
            command: '# Wait for review and approval',
            description: 'Address review comments and make necessary changes'
        },
        {
            step: 'Merge to Main',
            command: 'git checkout main\ngit pull origin main\ngit merge feature/your-feature-name',
            description: 'Merge after approval and passing all tests'
        }
    ],
    testingStrategy: [
        'Write unit tests for utility functions',
        'Test components with React Testing Library',
        'Integration tests for API endpoints',
        'E2E tests for critical user flows',
        'Run tests before committing: npm test',
        'Maintain >80% code coverage'
    ],
    deploymentProcess: [
        'Ensure all tests pass locally',
        'Update version in package.json',
        'Build production bundle: npm run build',
        'Test production build locally',
        'Deploy to staging environment first',
        'Run smoke tests on staging',
        'Deploy to production after approval',
        'Monitor logs and metrics post-deployment'
    ]
};

// FAQ Section
export interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

export const faqs: FAQItem[] = [
    {
        category: 'Getting Started',
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button on the homepage, fill in your name, email, and password. You\'ll receive an OTP via email to verify your account. Once verified, you can start building your profile!'
    },
    {
        category: 'Getting Started',
        question: 'What are the system requirements?',
        answer: 'DevConnect works on all modern browsers (Chrome, Firefox, Safari, Edge). For development, you need Node.js 18+, npm 9+, and MongoDB 5.0+. The platform is fully responsive and works on desktop, tablet, and mobile devices.'
    },
    {
        category: 'Profile & Resume',
        question: 'How do I download my resume as PDF?',
        answer: 'Navigate to the Resume page, customize your resume template and content, then click the "Download PDF" button. Your resume will be generated with professional formatting optimized for ATS systems.'
    },
    {
        category: 'Profile & Resume',
        question: 'Can I customize my profile URL?',
        answer: 'Currently, profile URLs are based on your user ID. Custom URLs are planned for a future release. You can track this feature request in our roadmap.'
    },
    {
        category: 'Social Features',
        question: 'How does the activity heatmap work?',
        answer: 'The activity heatmap tracks your daily contributions including posts, comments, profile updates, and task completions. It helps you visualize your consistency and build streaks, similar to GitHub\'s contribution graph.'
    },
    {
        category: 'Social Features',
        question: 'Can I delete my posts or comments?',
        answer: 'Yes! You can delete your own posts and comments at any time. Click the three-dot menu on your post/comment and select "Delete". Note that this action cannot be undone.'
    },
    {
        category: 'Technical',
        question: 'Is my data secure?',
        answer: 'Absolutely! We use industry-standard security practices including bcrypt password hashing, JWT authentication, HTTPS encryption, input validation, and regular security audits. Your data is stored securely and never shared with third parties.'
    },
    {
        category: 'Technical',
        question: 'How long do sessions last?',
        answer: 'Sessions last for 24 hours by default. You\'ll see a countdown timer in the navbar showing your remaining session time. You can extend your session by refreshing your token before it expires.'
    },
    {
        category: 'Features',
        question: 'What is the Kanban board used for?',
        answer: 'The Kanban board is your personal task management tool. Create tasks, organize them into columns (Todo, In Progress, Done), and drag-and-drop to update their status. Perfect for tracking your projects and goals!'
    },
    {
        category: 'Features',
        question: 'Can I use Markdown in posts?',
        answer: 'Yes! All posts support full Markdown formatting including headers, bold, italic, links, code blocks, lists, and more. This makes it easy to share technical content with proper formatting.'
    }
];

// Troubleshooting Guide
export interface TroubleshootingItem {
    issue: string;
    symptoms: string[];
    solutions: string[];
    category: string;
}

export const troubleshooting: TroubleshootingItem[] = [
    {
        category: 'Authentication',
        issue: 'Cannot receive OTP email',
        symptoms: [
            'Email not arriving after signup',
            'Waiting more than 5 minutes',
            'Checked spam folder'
        ],
        solutions: [
            'Verify your email address is correct',
            'Check your spam/junk folder',
            'Ensure your email provider isn\'t blocking automated emails',
            'Try resending the OTP from the verification page',
            'Contact support if issue persists after 10 minutes'
        ]
    },
    {
        category: 'Authentication',
        issue: 'Session expires too quickly',
        symptoms: [
            'Getting logged out unexpectedly',
            'Token expired errors',
            'Frequent re-login required'
        ],
        solutions: [
            'Check the session countdown timer in the navbar',
            'Refresh your token before it expires',
            'Ensure your system clock is accurate',
            'Clear browser cache and cookies',
            'Disable browser extensions that might interfere with authentication'
        ]
    },
    {
        category: 'Profile',
        issue: 'Profile changes not saving',
        symptoms: [
            'Updates don\'t persist after refresh',
            'Error messages when saving',
            'Form validation errors'
        ],
        solutions: [
            'Ensure all required fields are filled',
            'Check for validation errors highlighted in red',
            'Verify your session is still active',
            'Try refreshing the page and re-entering data',
            'Check browser console for specific error messages'
        ]
    },
    {
        category: 'Performance',
        issue: 'Slow page loading',
        symptoms: [
            'Pages take long to load',
            'Images loading slowly',
            'Laggy interactions'
        ],
        solutions: [
            'Check your internet connection speed',
            'Clear browser cache (Ctrl+Shift+Delete)',
            'Disable unnecessary browser extensions',
            'Try a different browser',
            'Check if the issue occurs on all pages or specific ones'
        ]
    },
    {
        category: 'Features',
        issue: 'Kanban drag-and-drop not working',
        symptoms: [
            'Cannot drag tasks',
            'Tasks snap back to original position',
            'Drop zones not highlighting'
        ],
        solutions: [
            'Ensure JavaScript is enabled in your browser',
            'Try using a mouse instead of trackpad',
            'Refresh the page to reset the board state',
            'Check if browser extensions are interfering',
            'Update your browser to the latest version'
        ]
    },
    {
        category: 'Development',
        issue: 'MongoDB connection failed',
        symptoms: [
            'Server won\'t start',
            'Connection timeout errors',
            'ECONNREFUSED errors'
        ],
        solutions: [
            'Ensure MongoDB is running: mongod',
            'Check MONGODB_URI in .env file',
            'Verify MongoDB is listening on port 27017',
            'Check firewall settings',
            'Try connecting with MongoDB Compass to test connection'
        ]
    }
];

// Migration Guides
export interface MigrationGuide {
    fromVersion: string;
    toVersion: string;
    breaking: string[];
    steps: string[];
    notes: string[];
}

export const migrationGuides: MigrationGuide[] = [
    {
        fromVersion: 'v1.0.0',
        toVersion: 'v1.1.0',
        breaking: [
            'ConfirmDialog component removed - use CustomAlert instead',
            'Native alert() calls replaced with CustomToast',
            'Build chunk configuration updated - may affect custom builds'
        ],
        steps: [
            'Update all ConfirmDialog imports to CustomAlert',
            'Replace alert() calls with useToast() hook',
            'Update vite.config.ts if you have custom chunk configuration',
            'Run npm install to update dependencies',
            'Test all confirmation dialogs and notifications',
            'Update any custom components using old alert patterns'
        ],
        notes: [
            'CustomAlert provides better UX with glassmorphic design',
            'CustomToast is globally available via ToastContext',
            'Build chunks are now optimized to be under 500kB',
            'All changes are backward compatible except for removed components'
        ]
    }
];