/**
 * Importing utility functions
 */
import { error } from "./logger.js";

/**
 * Importing templates
 */
import NodeJS from "../templates/backend/node/JS.js";
import NodeTS from "../templates/backend/node/TS.js";
import Django from "../templates/backend/python/Django.js";
import Java from "../templates/backend/java/Java.js";

/**
 * Importing constants
 */
import { PROJECT, LANGUAGE } from "../constant.js";

/**
 * @author Moht Jaiswal
 * @description Utility function to select the appropriate template based on project type and language.
 * @method template
 * @param {string} projectType
 * @param {string} language
 * @returns {Function}
 */
export default function template(projectType, language) {
  if (projectType === PROJECT.NODE) {
    if (language === LANGUAGE.JS) {
      return NodeJS;
    } else if (language === LANGUAGE.TS) {
      return NodeTS;
    }
  } else if (projectType === PROJECT.DJANGO) {
    return Django;
  } else if (projectType === PROJECT.JAVA) {
    return Java;
  }

  error(`Unsupported project type (${projectType}) or language (${language}).`);

  throw new Error(
    `Unsupported project type (${projectType}) or language (${language}): ${error.message}`
  );
}
