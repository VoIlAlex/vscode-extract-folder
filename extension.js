// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  let config = vscode.workspace.getConfiguration("extractFolder");

  let disposable = vscode.commands.registerCommand(
    "extension.extractFolderHere",
    async function(folderURI) {
      // The code you place here will be executed every time your command is executed

      let pathToFolder = null;
      if (folderURI !== null) {
        pathToFolder = folderURI._fsPath;
      } else {
        pathToFolder = await vscode.window.showInputBox({
          placeHolder: "Path to a folder to extract"
        });
      }
      if (pathToFolder === null || pathToFolder === undefined) {
        vscode.window.showErrorMessage("Wrong path.");
        return;
      }

      if (!fs.lstatSync(pathToFolder).isDirectory()) {
        vscode.window.showErrorMessage(
          'Only folders could be extracted."' +
            pathToFolder +
            '" is not a folder.'
        );
        return;
      }

      let filesInFolder = fs.readdirSync(pathToFolder);
      filesInFolder.forEach(fileName => {
        let filePath = pathToFolder + "/" + fileName;
        let newFileFolder = pathToFolder.substring(
          0,
          pathToFolder.lastIndexOf("\\") + 1
        );
        // in case of linux path
        if (newFileFolder === "") {
          newFileFolder = pathToFolder.substring(
            0,
            pathToFolder.lastIndexOf("/") + 1
          );
        }
        let newFilePath = newFileFolder + "/" + fileName;
        fs.renameSync(filePath, newFilePath);
      });

      if (config.get("deleteFolderAfterExtraction") === true) {
        fs.rmdirSync(pathToFolder);
      }
    }

    /*

    // Get workspace folder

    let newFileFolder = null;
    let workspaceFolders = vscode.workspace.workspaceFolders;
    workspaceFolders.forEach(folder => {
      if (pathToFolder.includes(folder.uri._fsPath))
        newFileFolder = folder.uri._fsPath;
    });

    */
  );

  context.subscriptions.push(disposable);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
