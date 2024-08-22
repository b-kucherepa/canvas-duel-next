import fs from "fs/promises";
import nextConfig from "./next.config.mjs";

function replaceAbsolutePrefix() {
  fs.readFile(`./${nextConfig.distDir}/index.html`, "utf8")
    .then((data) => data.replace(/"\//g, `\"`))
    .then((replacedData) =>
      fs.writeFile(`./${nextConfig.distDir}/index.html`, replacedData, "utf8")
    )
    .catch((error) => console.log(error));
}

replaceAbsolutePrefix();
