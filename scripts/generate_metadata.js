const metadata = require("../data.json");
const fs = require('fs');

function main() {
  var i = 1;
  for (const data of metadata) {
    var d = JSON.stringify(data);
    fs.writeFile("metadata/" + String(i), d, function(err){
        if(err) return console.log(err);
        console.log('Metadata added');
    });

    i ++;
  }
}

main();
