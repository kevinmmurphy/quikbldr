const cpp = require('./cppgen');
const util = require('util');
const prog = require('commander');
const fs = require('fs');

//
// program arguments
//
prog.version('0.0.1')
  .option('-f, --file [file]', 'The input json file of objects', './input.json')
  .option('-c, --clean', 'clean build files dir')
  .parse(process.argv);
//
// cleanbuild dir
//
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
if (prog.clean)
{
    console.log("Cleaning build dir.");
    deleteFolderRecursive('./build');
    console.log("Making build dir.");
    fs.mkdir('./build'); 
    return;
}

const input = require(prog.file);
console.log("\n *START* \n");
console.log(util.inspect(input.Classes, {showhidden: true }));
console.log('Iterating objects');

const len = input.Classes.length;
for(var i = 0; i < len; i++)
{
    console.log('    ' + util.inspect(input.Classes[i])); 
    cpp.createClass(input.Classes[i]);
}



console.log("\n *EXIT* \n");

