#!/usr/bin/env node

import path from "path";

/**
 * Importing utility functions
 */
import { generate } from "../src/utils/generate.js";
import { ask } from "../src/utils/ask.js";
import template from "../src/utils/template.js";
import { success, error, info, empty } from "../src/utils/logger.js";
import { PROJECT } from "../src/constant.js";

/**
 * @author Moht Jaiswal
 * @description Entry point for the CLI tool `appgen`.
 * @method main
 */
async function main() {
  let project;

  const answers = await ask();
  const { projectName, projectType, language, apiType, needTestFiles } =
    answers;

  const folderName = projectName;
  info(`Generating folder structure for: ${folderName}`);

  project = template(projectType, language);

  const { files } = project(projectName, needTestFiles, apiType);
  const targetDir = path.resolve(process.cwd(), folderName);

  generate(files, targetDir);

  success(`Project "${projectName}" generated successfully!`);

  if (projectType === PROJECT.NODE) {
    success(`1. cd ${folderName}`, false);
    success(`2. npm install`, false);
    success(`3. npm start`, false);
  } else if (projectType === PROJECT.DJANGO) {
    success(`1. cd ${folderName}`, false);
    success(`2. python manage.py runserver`, false);
  } else if (projectType === PROJECT.JAVA) {
    success(`1. cd ${folderName}`, false);
    success(`2. mvn spring-boot:run`, false);
  }

  empty();
}

/**
 * Main function to run the CLI tool
 */
main().catch((err) => {
  error(`Unexpected error during project generation:, ${err}`);
  process.exit(1);
});
