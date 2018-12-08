#! /home/alexga/.nvm/versions/node/v10.5.0/bin/node

const fs = require("fs-extra");
const colors = require("colors");

try {
    fs.removeSync("./public/");
    console.log(`Backend public folder ${colors.underline.red("deleted")} successfully!`);
} catch(e) {
    console.error(e)
}