const JS = (projectName, needTestFiles = false, type = "Rest") => {
  const baseName = projectName || "express-js-appgen";
  const isGraphQL = type === "GraphQL";

  const files = {
    "README.md": `# ${baseName}

## Scripts

- \`npm run dev\` - Start in development mode
- \`npm start\` - Start in production mode
`,

    "package.json": `{
  "name": "${baseName.toLowerCase().replace(/\s+/g, "-")}",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3"${
      isGraphQL
        ? `,
    "graphql": "^16.6.0",
    "express-graphql": "^0.12.0"`
        : ""
    }
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "supertest": "^6.3.3",
    "jest": "^29.0.0"
  }
}`,

    ".env": `PORT=3000
NODE_ENV=development`,

    ".gitignore": `node_modules
.env
logs
coverage`,

    "src/index.js": `const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const { port } = require('./config');
const { logger } = require('./middlewares');
app.use(logger);

${
  isGraphQL
    ? `
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schemas');
const root = require('./graphql/resolvers');

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));
`
    : `
const routes = require('./routes');
app.use('/api', routes);
`
}

app.listen(port, () => console.log(\`Server running on port \${port}\`));`,

    "src/config/index.js": `require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};`,

    "src/middlewares/logger.js": `module.exports = (req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
};`,

    "src/middlewares/index.js": `const logger = require('./logger');

module.exports = {
  logger
};`,

    "src/models/index.js": `module.exports = {};`,

    "src/services/index.js": `module.exports = {};`,

    "src/utils/index.js": `module.exports = {};`,
  };

  if (isGraphQL) {
    files[
      "src/graphql/schemas/index.js"
    ] = `const { buildSchema } = require('graphql');

module.exports = buildSchema(\`
  type Query {
    hello: String
  }
\`);`;

    files["src/graphql/resolvers/index.js"] = `module.exports = {
  hello: () => {
    return "Hello from GraphQL";
  }
};`;

    if (needTestFiles) {
      files[
        "src/graphql/__tests__/hello.test.js"
      ] = `describe('GraphQL Hello', () => {
  it('should return hello string', () => {
    expect('Hello from GraphQL').toBe('Hello from GraphQL');
  });
});`;
    }
  } else {
    files["src/routes/index.js"] = `const express = require('express');
const router = express.Router();

router.use('/health', require('./health.route'));

module.exports = router;`;

    files["src/routes/health.route.js"] = `const express = require('express');
const router = express.Router();
const { healthCheck } = require('../controllers/health.controller');

router.get('/', healthCheck);

module.exports = router;`;

    files[
      "src/controllers/health.controller.js"
    ] = `exports.healthCheck = (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
};`;

    files[
      "src/controllers/index.js"
    ] = `const healthController = require('./health.controller');

module.exports = {
  ...healthController
};`;

    if (needTestFiles) {
      files[
        "src/routes/__tests__/health.test.js"
      ] = `const request = require('supertest');
const express = require('express');
const healthRoute = require('../health.route');

const app = express();
app.use('/health', healthRoute);

describe('Health Route', () => {
  it('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'UP');
  });
});`;

      files[
        "src/controllers/__tests__/health.controller.test.js"
      ] = `const { healthCheck } = require('../health.controller');

describe('healthCheck', () => {
  it('should send status UP', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    healthCheck(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'Healthy like a thor 🔥' }));
  });
});`;

      files[
        "src/middlewares/__tests__/logger.test.js"
      ] = `const logger = require('../logger');

describe('Logger Middleware', () => {
  it('should call next()', () => {
    const req = { method: 'GET', url: '/test' };
    const res = {};
    const next = jest.fn();

    logger(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});`;
    }
  }

  return { files };
};

export default JS;
