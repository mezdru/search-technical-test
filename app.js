const AnimalsController = require("./controllers/AnimalsController");
const { data } = require("./data/data");

// NOTE: I've chosen a more complex solution than necessary for this problem, as it involves a technical test
/**
 * Evaluates command-line arguments to perform the requested action
 * @param {Array<String>} args
 */
function evaluateCmd(args) {
  const cmd = args.filter((arg) => arg.search("--") !== -1);

  if (cmd.length !== 1) {
    process.stderr.write(
      `Error: You must provide 1 command, try '--filter="some pattern"' or '--count'\n`
    );
    process.exit(1);
  }

  const animalsController = new AnimalsController(data);
  const [cmdName, cmdValue] = cmd[0].split("=");

  switch (cmdName) {
    case "--filter":
      if (!cmdValue) {
        process.stderr.write(
          `Error: the command is not valid, try '--filter="some pattern"' or '--count'\n`
        );
        process.exit(1);
      }
      const results = animalsController.filter(cmdValue);
      results.length &&
        process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
      break;

    case "--count":
      process.stdout.write(
        `${JSON.stringify(animalsController.count(), null, 2)}\n`
      );
      break;

    case "--help":
      process.stdout.write("Commands:\n\n");
      process.stdout.write(
        `--filter="some pattern"      allows you to retrieve animals with the pattern in their name\n`
      );
      process.stdout.write(
        `--count                    allows you to display the data with the number of child elements for each parent entity\n`
      );
      break;

    default:
      process.stderr.write(
        `Error: Unknown command '${cmdName}', try '--filter="some pattern"' or '--count'\n`
      );
      process.exit(1);
  }
}

evaluateCmd(process.argv);
