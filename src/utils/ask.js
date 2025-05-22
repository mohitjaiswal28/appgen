import inquirer from "inquirer";
import questions from "../configs/questions.js";

/**
 * @author Mohit Jaiswal
 * @description Prompts the user for project setup configuration using Inquirer.
 * @method ask
 * @returns {Promise<Object>} User-selected project configuration.
 */
export const ask = async () => {
  return inquirer.prompt(questions);
};
