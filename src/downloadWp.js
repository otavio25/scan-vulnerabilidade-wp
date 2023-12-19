const crypto = require('crypto')
const fs = require('fs')
const inforVersaoWp = require('./inforVersaoWp')
const axios = require('axios')
const admZip = require('adm-zip')
const rimraf = require('rimraf')

async function downloadWp() {
    try{
        let versaoWp = process.argv[2]
        const url = `https://br.wordpress.org/wordpress-${versaoWp}-pt_BR.zip`

        // realiza download do arquivo wordpress
        const writer = fs.createWriteStream(`wordpress-${versaoWp}-pt_BR.zip`)
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        })
        response.data.pipe(writer)

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })

        //descompacta pasta zipada
        const descompactaArquivo = new admZip(`./wordpress-${versaoWp}-pt_BR.zip`)
        descompactaArquivo.extractAllTo('./')

        const caminhoArquivo = 'wordpress/wp-admin/js/customize-controls.min.js'
        const dadosDoArquivo = fs.readFileSync(caminhoArquivo, 'utf-8')
        const hash = calcularHashMD5(dadosDoArquivo)
        //remove arquivo .zip
        fs.unlinkSync(`./wordpress-${versaoWp}-pt_BR.zip`)
        // remove pasta descompactada
        rimraf.sync('./wordpress')
        let resultado = await inforVersaoWp({version: versaoWp, name: caminhoArquivo, hashMD5: hash})
        console.log(resultado)
    }catch (error) {
        return { erro: error.message }
    }
}

function calcularHashMD5(dados) {
    const hash = crypto.createHash('md5')
    hash.update(dados)
    const hashHex = hash.digest('hex')
    return hashHex
}

downloadWp();
