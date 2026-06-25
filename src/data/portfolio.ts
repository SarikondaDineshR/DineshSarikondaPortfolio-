export const profile = {
  name: { first: "Dinesh", last: "Sarikonda", full: "Dinesh Sarikonda" },
  email: "Dinesh.work009@gmail.com",
  phone: "615-413-7172",
  linkedin: "linkedin.com/in/dineshsarikonda",
  website: "dineshsarikonda.com",
  role: "Senior .NET Full-Stack Developer",
  tagline: "Building enterprise-grade systems that scale.",
  bio: "Seasoned Full-Stack .NET Developer with 12+ years of progressive experience designing, developing and deploying enterprise applications across finance, healthcare and public-sector domains. Specialized in .NET, C# and cloud ecosystems, delivering secure, scalable and high-performance distributed systems.",
  available: true,
  location: { based: "United States", availability: "Open to opportunities" },
  stats: [
    { value: "12+", label: "Years\nExperience" },
    { value: "20+", label: "Projects\nDelivered" },
    { value: "6", label: "Companies\nWorked At" },
  ],
  pills: [".NET Architect", "Full Stack Engineer", "Cloud Specialist", "Microservices"],
};

export const experiences = [
  {
    company: "Vialto Partners",
    location: "Stanford, CT",
    role: "Senior .NET Full Stack Developer",
    duration: "Jan 2026 – Present",
    current: true,
    highlights: [
      "Designed AI-driven workflow automation using .NET 8, orchestrating approval processes and background execution across distributed services.",
      "Implemented CQRS and Clean Architecture principles, improving scalability and maintenance of complex business workflows.",
      "Containerized services with Docker and Dapr; integrated Azure DevOps CI/CD pipelines across multiple environments.",
    ],
    tech: [".NET 8", "CQRS", "Hangfire", "Docker", "Dapr", "Azure DevOps", "xUnit"],
  },
  {
    company: "Betterment",
    location: "New York, NY",
    role: "Senior .NET Full Stack Developer",
    duration: "Nov 2024 – Jan 2026",
    current: false,
    highlights: [
      "Modernized core digital banking platform with microservices and CQRS, ensuring PCI DSS and FFIEC compliance.",
      "Built RESTful APIs with ASP.NET Core 8.0 and responsive Angular 17 frontends with RxJS and NgRx.",
      "Deployed containerized microservices to Azure Kubernetes Service (AKS) and governed APIs via Azure API Management.",
    ],
    tech: ["ASP.NET Core 8", "Angular 17", "Azure AKS", "Entity Framework", "Azure Event Hubs", "Blazor"],
  },
  {
    company: "State of New York – Financial Services",
    location: "New York, NY",
    role: "Senior .NET Full Stack Developer",
    duration: "Aug 2020 – Oct 2024",
    current: false,
    highlights: [
      "Delivered enterprise digital banking modules for deposits, loans and customer onboarding using ASP.NET Core 6.0.",
      "Integrated RabbitMQ for event-driven communication across transaction, fraud detection and notification systems.",
      "Built financial dashboards with Angular 17, HTML5, CSS3 and Bootstrap emphasizing responsive UX design.",
    ],
    tech: ["ASP.NET Core 6", "Angular 17", "RabbitMQ", "Azure Functions", "Docker", "Azure AKS"],
  },
  {
    company: "HCA Healthcare",
    location: "Nashville, TN",
    role: ".NET Full Stack Developer",
    duration: "May 2018 – Jul 2020",
    current: false,
    highlights: [
      "Designed high-performance microservices using ASP.NET Core 3.0 for financial data processing and audit automation.",
      "Created SSIS packages for complex ETL processes across multi-source financial datasets for reporting and analytics.",
      "Implemented OAuth2 and deployed Azure Functions for automated triggers, enabling near-real-time dashboard updates.",
    ],
    tech: ["ASP.NET Core 3", "Angular 14", "Azure DevOps", "SSIS", "SQL Server", "Python"],
  },
  {
    company: "Santander Bank",
    location: "Boston, MA",
    role: ".NET Developer",
    duration: "Sep 2015 – Apr 2018",
    current: false,
    highlights: [
      "Developed secure web applications using ASP.NET MVC and Core 2.2 for member enrollment and claims systems.",
      "Built responsive healthcare dashboards with React 15 and Bootstrap for providers and care coordinators.",
      "Deployed containerized microservices on Amazon ECS with AWS Fargate, ensuring HIPAA data-retention standards.",
    ],
    tech: ["ASP.NET MVC", "React 15", "AWS ECS", "Amazon RDS", "AWS Lambda", "Amazon SQS"],
  },
  {
    company: "Discover Financial",
    location: "Riverswood, IL",
    role: ".NET Developer",
    duration: "Jan 2013 – Aug 2015",
    current: false,
    highlights: [
      "Built government benefit-eligibility web modules using ASP.NET WebForms and ADO.NET with complex T-SQL queries.",
      "Generated compliance reports with SSRS and hosted databases on Amazon RDS with secure S3 document storage.",
      "Deployed internal web apps on Amazon EC2 with CloudWatch monitoring for 24/7 system availability.",
    ],
    tech: ["ASP.NET WebForms", "ADO.NET", "SQL Server", "SSRS", "Amazon EC2", "Amazon RDS"],
  },
];

export const skills = {
  "Backend": [".NET / C#", "ASP.NET Core", "ASP.NET MVC", "Web API", "Blazor Server", "Entity Framework Core", "LINQ", "ADO.NET"],
  "Frontend": ["Angular (1.x–17)", "React (up to 18)", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Bootstrap", "RxJS / NgRx"],
  "Cloud & DevOps": ["Microsoft Azure", "AWS", "Google Cloud Platform", "Docker", "Kubernetes / AKS", "Azure DevOps", "CI/CD Pipelines", "Terraform"],
  "Architecture": ["Microservices", "CQRS", "Domain-Driven Design", "Clean Architecture", "REST APIs", "Event-Driven Systems", "Azure API Management"],
  "Databases": ["SQL Server", "Azure SQL", "Azure Cosmos DB", "MongoDB", "PostgreSQL", "Amazon RDS", "Oracle", "Redis"],
  "Messaging": ["RabbitMQ", "Azure Event Hubs", "Amazon SQS", "Google Pub/Sub", "MSMQ", "Apache Kafka"],
};

export const certifications = [
  {
    name: "Azure Solutions Architect",
    issuer: "Microsoft",
    badge: "AZ",
    color: "#0078D4",
  },
  {
    name: "AI Practitioner",
    issuer: "Amazon Web Services",
    badge: "AWS",
    color: "#FF9900",
  },
  {
    name: "Cloud Solution Architect",
    issuer: "Google Cloud Platform",
    badge: "GCP",
    color: "#4285F4",
  },
];

export const education = {
  degree: "Bachelor of Science in Computer Science and Engineering",
  year: "May 2010",
};
