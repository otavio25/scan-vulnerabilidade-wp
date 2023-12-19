const fs = require("fs");
const mongoose = require("mongoose");
const inforVersaoWordPress = require("./inforVersaoWp");
const informacaoTema = require("./inforTema");
const informacaoPlugins = require("./infoPlugins");

const url = process.argv[2];
const nomeArquivo = url.replace("https://", "");

function validarURL(string) {
  const regexUrl = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  return regexUrl.test(string);
}

async function geraRelatorio() {
  try {
    if (!validarURL(url)) {
      console.log("A URL fornecida não é válida.");
      process.exit(1);
    }

    let resultadoVersaoWp = await inforVersaoWordPress();
    let resultadoInforTema = await informacaoTema();
    let resultadoInforPlugins = await informacaoPlugins();
    let relatorio = {
      version: resultadoVersaoWp,
      main_theme: resultadoInforTema,
      plugins: resultadoInforPlugins.plugins,
    };

    fs.writeFile(
      `${nomeArquivo}.json`,
      JSON.stringify(relatorio, null, 2),
      (err) => {
        if (err) {
          console.error("Erro ao salvar o arquivo:", err);
        } else {
          console.log("Relatório salvo com sucesso em " + nomeArquivo);
        }
      }
    );

    mongoose.connection.close();
  } catch (error) {
    console.log("Erro: ", error.message);
  }
}

if (require.main === module) {
  geraRelatorio();
}
