# AppGen

**AppGen** is a next-generation project scaffolding tool that empowers teams to launch clean, production-ready project structure. AppGen eliminates boilerplate, accelerates delivery, and enforces best practices from day one.

> 🚀 One CLI. Instant structure. Zero friction.

> ⭐️ A simple CLI tool to generate a clean project structures for your amazing projects.

---

## 🚀 Key Features

- **Supports**: Node, Django and Java project.
- **REST or GraphQL**: Choose your API style (REST or GraphQL) at project creation.
- **Testing Ready**: Optional Jest + Supertest test suites for reliable code.
- **Enterprise Architecture**: Modular, scalable folder structure for real-world projects.
- **DevOps Friendly**: Auto-generates `.env`, `.gitignore`, and logging setup.
- **Team-Ready**: Consistent codebase for teams of any size.

---

## 📋 Usage

To scaffold a new project with AppGen, follow these steps:

1. **Create a new project with @mohitjaiswal/appgen:**

   ```bash
   npx @mohitjaiswal/appgen
   ```

2. **Follow the interactive prompts** to select:

   - Project type (Node, Django, Java)
   - API style (REST or GraphQL)
   - Testing setup (Jest + Supertest, optional)

3. **Navigate to your project folder:**

   ```bash
   cd my-project
   ```

4. **Start building!**  
   Your project comes pre-configured with recommended structure, environment files, and testing setup.

---

## 🚀 Output Structure (Node with REST Example)

```
my-app/
├── README.md
├── package.json
├── .env
├── .gitignore
├── src/
│   ├── index.js
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
```

> 🧪 Test files are auto-generated under `__tests__/` when `--withTests` is enabled.

---

## 💡 Why Choose AppGen?

- **Save Weeks of Setup**: Go from zero to production-ready in minutes.
- **Best Practices by Default**: Enforces structure, testing, and configuration.
- **Built for Teams**: Scalable architecture for solo devs and large teams alike.

