import chalk from "chalk";
import figures from "figures";

/**
 * @author Mohit Jaiswal
 * @description Logger utility function to display info messages in the console.
 * @method info
 * @param {string} message - The message to display.
 */
function info(message) {
  const infoLabel = chalk.bgBlue.white.bold(` ${figures.info} INFO `);
  const infoMessage = chalk.blueBright(message);

  console.log(`\n${infoLabel} ${infoMessage}\n`);
}

/**
 * @author Mohit Jaiswal
 * @description Logger utility functions to display success messages in the console.
 * @method success
 * @param {string} message - The message to display.
 * @param {boolean} label - If true, adds the label with newline.
 */
function success(message, label = true) {
  const successLabel = chalk.bgGreen.black.bold(` ${figures.tick} SUCCESS `);
  const successMessage = chalk.greenBright(message);

  if (label) {
    console.log(`\n${successLabel} ${successMessage} 🎉\n`);
  } else {
    console.log(`${successMessage}`);
  }
}

/**
 * @author Mohit Jaiswal
 * @description Logger utility functions to display error messages in the console.
 * @method error
 * @param {string} message - The message to display.
 */
function error(message) {
  console.log(
    `\n${chalk.bgRed.white.bold(` ${figures.cross} ERROR `)} ${chalk.redBright(
      message
    )} ❌\n`
  );
}

/**
 * @author Mohit Jaiswal
 * @description Logger utility functions to display empty lines in the console.
 * @method empty
 */
function empty() {
  console.log();
}

export { info, success, error, empty };
