const axios = require("axios");
const informacaoTema = require("./obterTema");
const model = require("./database/temaSchema");
const mongoose = require("mongoose");
const url = process.argv[2];

async function obterInforTema() {
  try {
    const obterTema = await informacaoTema(url);
    let temaExistente = await model.findOne({ slug: obterTema.nomeTema });
    let objTema = {};
    if (!temaExistente) {
      const respostaApiWordPress = await axios.get(
        `https://api.wordpress.org/themes/info/1.1/?action=theme_information&request[slug]=${obterTema.nomeTema}`
      );
      const dadosTema = respostaApiWordPress.data;
      const resultado = await model.create(dadosTema);
      temaExistente = resultado;
    }

    objTema = {
      style_name: temaExistente.name,
      slug: obterTema.nomeTema,
      latest_version: temaExistente.version,
      outdated: temaExistente.version !== obterTema.versao,
      version: {
        number: obterTema.versaoTema,
      },
    };
    
    if (require.main === module) {
      console.log(objTema); 
      mongoose.connection.close();
    }
    
    return objTema;
  } catch (error) {
    console.error(error);
  }
}

if (require.main === module) {
  obterInforTema();
} else {
  module.exports = obterInforTema;
}
