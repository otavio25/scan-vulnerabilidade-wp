const axios = require("axios");
const mongoose = require("mongoose");
const obterVersaoWordPress = require("./obterVersaoWP");
const model = require("./database/versaoWpSchema");

async function inforVersaoWordPress(versaoWp) {
  try {
    let versao
    let hashFile = []
    let versaoExistente
    if(versaoWp){
      versao = versaoWp.version
      hashFile = [{name: versaoWp.name, hashMD5: versaoWp.hashMD5}]
      versaoExistente = await model.findOne({ 'version.number': versao, 'files.hashMD5':  versaoWp.hashMD5});
    }
    else{
      versao = (await obterVersaoWordPress()).versaoWp;
      versaoExistente = await model.findOne({ 'version.number': versao });
    }
    let resultado = {};
    if (!versaoExistente) {
      const apiWp = await axios.get(
        "http://api.wordpress.org/core/stable-check/1.0/"
      );
      const dadosApi = apiWp.data;
      versaoExistente = {
        version:{
          number: versao,
          status: dadosApi[versao]
        },
        files: hashFile
      }
      await model.updateOne({'version.number': versaoExistente.version.number}, versaoExistente, {upsert: true})
    }
    resultado = {
      version: {
        number: versaoExistente.version.number,
        status: versaoExistente.version.status,
      },
    };
    return resultado;
  } catch (error) {
    return { erro: error.message };
  }
}

if (require.main === module) {
  inforVersaoWordPress().then((result) => {
    if (result.erro) {
      console.log(result.erro);
    } else {
      console.log(result); 
    }
    mongoose.connection.close();
  });
} else {
  module.exports = inforVersaoWordPress;
}
