const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../src/models/User');
const CompanyProfile = require('../src/models/CompanyProfile');
const Job = require('../src/models/Job');
const env = require('../src/config/env');

const seedJobs = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing jobs to ensure a fresh starting state
    await Job.deleteMany({});
    console.log('Cleared existing jobs.');

    // 1. Seed Company Accounts and Profiles
    const companiesData = [
      {
        email: 'recruiter.google@example.com',
        fullName: 'Sundar Pichai',
        companyName: 'Google Inc.',
        industry: 'Technology',
        website: 'https://google.com',
        description: 'Google is a global technology leader focused on improving the ways people connect with information.',
        size: '1000+',
        foundedYear: 1998,
        logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=200'
      },
      {
        email: 'recruiter.stripe@example.com',
        fullName: 'Patrick Collison',
        companyName: 'Stripe',
        industry: 'FinTech',
        website: 'https://stripe.com',
        description: 'Stripe is a financial infrastructure platform for the internet. Millions of companies use Stripe to accept payments.',
        size: '501-1000',
        foundedYear: 2010,
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'
      },
      {
        email: 'recruiter.vercel@example.com',
        fullName: 'Guillermo Rauch',
        companyName: 'Vercel',
        industry: 'Cloud Computing & Tech',
        website: 'https://vercel.com',
        description: 'Vercel provides the developer experience and infrastructure to build, deploy, and scale the web.',
        size: '201-500',
        foundedYear: 2015,
        logoUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=200'
      }
    ];

    const seededCompanies = [];

    for (const cData of companiesData) {
      // Find or create User
      let user = await User.findOne({ email: cData.email });
      if (user) {
        console.log(`Company user ${cData.email} already exists. Updating details.`);
        user.role = 'company';
        user.isVerified = true;
        await user.save();
      } else {
        user = new User({
          fullName: cData.fullName,
          email: cData.email,
          password: 'CompanyPass123!',
          role: 'company',
          isVerified: true
        });
        await user.save();
      }

      // Check if CompanyProfile exists, or clear it to prevent unique index constraint error on userId
      await CompanyProfile.deleteOne({ userId: user._id });
      
      const profile = new CompanyProfile({
        userId: user._id,
        companyName: cData.companyName,
        industry: cData.industry,
        website: cData.website,
        description: cData.description,
        size: cData.size,
        foundedYear: cData.foundedYear,
        logoUrl: cData.logoUrl,
        verificationStatus: 'verified'
      });
      await profile.save();
      console.log(`Registered company: ${cData.companyName}`);
      seededCompanies.push(profile);
    }

    const [google, stripe, vercel] = seededCompanies;

    // 2. Seed Job Postings
    const jobsData = [
      {
        companyId: google._id,
        title: 'Senior Software Engineer, Search Core',
        description: `We are looking for a Senior Software Engineer to join Google's Core Search Infrastructure team. You will build and scale the database pipelines that serve billions of search queries daily.

Responsibilities:
- Optimize low-latency index retrieval systems.
- Collaborate with AI/ML research teams to integrate semantic retrieval models.
- Maintain high availability and performance across geo-replicated data centers.`,
        requirements: [
          '5+ years of experience in systems engineering',
          'Proficiency in C++, Go, or Rust',
          'Strong understanding of distributed database consistency protocols',
          'B.S. or M.S. in Computer Science or equivalent'
        ],
        skills: ['Systems Engineering', 'Distributed Databases', 'Go', 'C++', 'Algorithmic Optimization'],
        location: 'Mountain View, CA',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 145000,
        salaryMax: 195000
      },
      {
        companyId: google._id,
        title: 'Data & Analytics Scientist',
        description: `Join Google Cloud's analytics department to build statistical models that evaluate service load efficiency, system telemetry, and cost footprints.

Responsibilities:
- Perform predictive analysis on server virtualization patterns.
- Draft reports for infrastructure capacity management.
- Automate pipelines translating telemetry to cloud operations alerts.`,
        requirements: [
          '3+ years of experience in data analytics or data science',
          'Strong proficiency in SQL and Python analytics stack (Pandas, Numpy)',
          'Experience building interactive telemetry dashboards'
        ],
        skills: ['Data & Analytics', 'Python', 'SQL', 'Data Science', 'Data Pipelines'],
        location: 'New York, NY',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 110000,
        salaryMax: 150000
      },
      {
        companyId: stripe._id,
        title: 'Staff Frontend Engineer, Dashboard Team',
        description: `Stripe's Dashboard is the portal through which millions of companies manage their financial metrics. We are seeking a Staff Frontend Engineer to lead component architecture and render critical financial interfaces.

Responsibilities:
- Lead the migration of core components to modular styling guidelines.
- Optimize frontend state management structures for dynamic rendering.
- Build clean interface tools and charts for recruiters and financial analysts.`,
        requirements: [
          '8+ years of professional web application engineering experience',
          'Expertise in JavaScript, TypeScript, and modern frameworks (Angular/React)',
          'In-depth knowledge of browser engine optimization and asset caching'
        ],
        skills: ['Software Engineering', 'Angular', 'TypeScript', 'Tailwind CSS', 'Web Performance'],
        location: 'San Francisco, CA',
        jobType: 'full-time',
        experienceLevel: 'lead',
        salaryMin: 180000,
        salaryMax: 240000
      },
      {
        companyId: stripe._id,
        title: 'Product Design Architect',
        description: `We are looking for a Product Designer to establish unified visual frameworks for complex payment workflows.

Responsibilities:
- Create wireframes and high-fidelity screen templates for dashboard configurations.
- Eliminate visual friction from payment checkout experiences.
- Align with technical teams on visual design systems.`,
        requirements: [
          '4+ years of UI/UX design experience',
          'Strong portfolio showing complex data visualizations and wireframes',
          'Proficiency in Figma, vector tools, and interaction design'
        ],
        skills: ['Product Design', 'UI/UX Design', 'Figma', 'Visual Identity', 'Typography'],
        location: 'Remote',
        jobType: 'remote',
        experienceLevel: 'senior',
        salaryMin: 130000,
        salaryMax: 175000
      },
      {
        companyId: stripe._id,
        title: 'Marketing Campaigns Lead',
        description: `Lead Stripe's regional marketing campaigns targeted at software engineering teams and startups.

Responsibilities:
- Define localized content strategies for developer channels.
- Evaluate advertisement yield metrics and organic conversion ratios.
- Collaborate with event managers to run developer hackathons.`,
        requirements: [
          '5+ years of experience in product marketing, developer relations, or brand marketing',
          'Exceptional written communication skills',
          'Experience running paid ad attribution campaigns'
        ],
        skills: ['Marketing & Sales', 'Digital Strategy', 'Developer Relations', 'Campaign Management'],
        location: 'Chicago, IL',
        jobType: 'full-time',
        experienceLevel: 'lead',
        salaryMin: 120000,
        salaryMax: 160000
      },
      {
        companyId: vercel._id,
        title: 'Developer Advocate, Web Technologies',
        description: `Help shape the future of Next.js and frontend cloud hosting. Speak directly to developers, build educational resources, and communicate community feedback back to product engineering.

Responsibilities:
- Create blog posts, video walk-throughs, and code examples detailing web architecture.
- Present at technical conferences globally.
- Coordinate with engineering teams to fix community developer bottlenecks.`,
        requirements: [
          '3+ years of developer advocacy, software engineering, or technical writing experience',
          'Strong knowledge of modern Javascript web framework architecture (Vite, Next, Angular)',
          'Active participant in developer ecosystems'
        ],
        skills: ['Software Engineering', 'JavaScript', 'Next.js', 'Technical Writing', 'Developer Advocacy'],
        location: 'Remote',
        jobType: 'remote',
        experienceLevel: 'mid',
        salaryMin: 115000,
        salaryMax: 165000
      },
      {
        companyId: vercel._id,
        title: 'DevOps Security Specialist',
        description: `Join Vercel Security to build compliance validation pipelines, analyze cloud security footprints, and secure serverless functions.

Responsibilities:
- Build policy enforcement rules into build infrastructure.
- Mitigate cloud container access risks.
- Conduct threat modeling on global Edge CDN gateways.`,
        requirements: [
          '5+ years of experience in security engineering or Cloud DevOps',
          'Familiarity with AWS, GCP, Cloudflare, or AWS Lambda',
          'Expertise in Linux container sandboxing and networking'
        ],
        skills: ['Software Engineering', 'DevOps', 'Cloud Security', 'Kubernetes', 'AWS'],
        location: 'Austin, TX',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 150000,
        salaryMax: 200000
      },
      {
        companyId: vercel._id,
        title: 'UI Design Intern',
        description: `Join the Vercel design system team for a 6-month internship focused on interface assets, accessibility, and documentation.

Responsibilities:
- Design accessible SVG icon sets and visual components.
- Conduct user research sessions with open-source community maintainers.
- Draft layout variations for documentation pages.`,
        requirements: [
          'Currently enrolled in or recently graduated from a design program',
          'Proficiency in Figma and basic understanding of CSS layouts',
          'High attention to detail'
        ],
        skills: ['Product Design', 'Figma', 'UI/UX Design', 'Accessibility', 'Web Layouts'],
        location: 'San Francisco, CA',
        jobType: 'internship',
        experienceLevel: 'entry',
        salaryMin: 45000,
        salaryMax: 65000
      }
    ];

    for (const jData of jobsData) {
      const job = new Job({
        companyId: jData.companyId,
        title: jData.title,
        description: jData.description,
        requirements: jData.requirements,
        skills: jData.skills,
        location: jData.location,
        jobType: jData.jobType,
        experienceLevel: jData.experienceLevel,
        salaryMin: jData.salaryMin,
        salaryMax: jData.salaryMax,
        status: 'active',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days deadline
      });
      await job.save();
      console.log(`Created job: ${jData.title}`);
    }

    console.log('Job database seeding complete!');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding job data:', error.message);
    process.exit(1);
  }
};

seedJobs();
