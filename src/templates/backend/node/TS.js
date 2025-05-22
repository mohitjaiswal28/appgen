export default function NodeTS(
  projectName = "",
  needTestFiles = false,
  type = "Rest"
) {
  const baseName = projectName || "express-ts-appgen";
  const isGraphQL = type === "GraphQL";

  const files = {
    "README.md": `# ${baseName}

## Scripts

- \`npm run dev\` – Start in development mode
- \`npm start\` – Start in production mode
`,
    "package.json": `{
  "name": "${baseName.toLowerCase().replace(/\s+/g, "-")}",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "test": "jest"
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
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "supertest": "^6.3.3"
  }
}`,
    "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true
  }
}`,
    ".env": `PORT=3000
NODE_ENV=development`,
    ".gitignore": `node_modules
dist
.env
logs
coverage`,
    "src/index.ts": `import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { port } from './config';
import { logger } from './middlewares';

const app = express();
app.use(express.json());
app.use(logger);

${
  isGraphQL
    ? `
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schemas';
import root from './graphql/resolvers';

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));
`
    : `
import routes from './routes';
app.use('/api', routes);
`
}

app.listen(port, () => console.log(\`Server running on port \${port}\`));`,
    "src/config/index.ts": `import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT || 3000;
export const env = process.env.NODE_ENV || 'development';`,
    "src/middlewares/logger.ts": `import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
};`,
    "src/middlewares/index.ts": `export * from './logger';`,
    "src/models/index.ts": `export {};`,
    "src/services/index.ts": `export {};`,
    "src/utils/index.ts": `export {};`,
  };

  if (isGraphQL) {
    files[
      "src/graphql/schemas/index.ts"
    ] = `import { buildSchema } from 'graphql';

export default buildSchema(\`
  type Query {
    hello: String
  }
\`);`;

    files["src/graphql/resolvers/index.ts"] = `export default {
  hello: () => "Hello from GraphQL"
};`;

    if (needTestFiles) {
      files[
        "src/graphql/__tests__/hello.test.ts"
      ] = `describe('GraphQL Hello', () => {
  it('should return hello string', () => {
    expect('Hello from GraphQL').toBe('Hello from GraphQL');
  });
});`;
    }
  } else {
    files["src/routes/index.ts"] = `import { Router } from 'express';
import healthRouter from './health.route';

const router = Router();

router.use('/health', healthRouter);

export default router;`;

    files["src/routes/health.route.ts"] = `import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';

const router = Router();

router.get('/', healthCheck);

export default router;`;

    files[
      "src/controllers/health.controller.ts"
    ] = `import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response): void => {
  res.status(200).json({ status: 'Healthy like a thor 🔥', timestamp: new Date() });
};`;

    files["src/controllers/index.ts"] = `export * from './health.controller';`;

    if (needTestFiles) {
      files[
        "src/routes/__tests__/health.route.test.ts"
      ] = `import request from 'supertest';
import express from 'express';
import healthRoute from '../health.route';

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
        "src/controllers/__tests__/health.controller.test.ts"
      ] = `import { healthCheck } from '../health.controller';
import { Request, Response } from 'express';

describe('healthCheck', () => {
  it('should send status UP', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    healthCheck(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'Healthy like a thor 🔥' }));
  });
});`;

      files[
        "src/middlewares/__tests__/logger.test.ts"
      ] = `import { logger } from '../logger';
import { Request, Response, NextFunction } from 'express';

describe('Logger Middleware', () => {
  it('should call next()', () => {
    const req = { method: 'GET', url: '/test' } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    logger(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});`;
    }
  }

  return { files };
}
