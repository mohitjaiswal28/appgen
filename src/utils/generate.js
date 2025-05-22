import fs from "fs";
import path from "path";

/**
 * @author Mohit Jaiswal
 * @description Utility function to generate files based on a template structure.
 * @method generate
 * @param {Object} files - A mapping of relative file paths to their content.
 * @param {string} targetDir - The absolute path where the files should be created.
 */
export function generate(files, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(targetDir, relativePath);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
  }
}
