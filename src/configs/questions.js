/**
 * @author Moht Jaiswal
 * @description This module contains the configuration for the prompts used in the CLI tool.
 * @method questions
 * @returns {Array} An array of prompt configurations for user input.
 */
const questions = [
  {
    type: "list",
    name: "projectType",
    message: "Select the type of project you'd like to create:",
    choices: ["Node", "Django", "Java"],
  },
  {
    type: "list",
    name: "language",
    message: "Choose your preferred programming language:",
    choices: ["JavaScript", "TypeScript"],
    when: (answers) => answers.projectType === "Node",
  },
  {
    type: "list",
    name: "apiType",
    message: "Would you like to include an API in your project?",
    choices: ["REST", "GraphQL"],
  },
  {
    type: "confirm",
    name: "needTestFiles",
    message: "Include sample test files to get started quickly?",
    default: false,
  },
  {
    type: "input",
    name: "projectName",
    message: "Enter your project name:",
    default: "my-project",
    validate: (input) =>
      input && input.trim() !== "" ? true : "Project name cannot be empty.",
  },
];

export default questions;
