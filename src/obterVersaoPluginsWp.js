const axios = require('axios')
const https = require('https')

const httpsAgent = new https.Agent({  
    rejectUnauthorized: false
})

const instancia = axios.create({  
    httpsAgent
})

async function obterVersaoPluginsWp(arg){
    try {
        let url = ''
        if(!arg){
            url = process.argv[2]
        }
        else{
            url = arg
        }
        const resposta = await instancia.get(url)
        const html = resposta.data

        const pluginsMap = new Map()
        const scriptTags = html.match(/<script[^>]*>[\s\S]*?<\/script>/g)
        if (scriptTags) {
            await Promise.all(
                scriptTags.map(async(scriptTag) => {
                    if (scriptTag.includes('wp-content/plugins')) {
                        let nomePlugin = scriptTag.match(/\/plugins\/([^/]+)\//)[1]
                        let readmePlugin = await instancia.get(url + `/wp-content/plugins/${nomePlugin}/readme.txt`)
                        readmePlugin = readmePlugin.data
                        let versaoMatch = readmePlugin.match(/Stable tag: (.+)/)
                        let versaoPlugin = versaoMatch ? versaoMatch[1].trim() : null
                        pluginsMap.set(nomePlugin, { nomePlugin: nomePlugin, versaoPlugin: versaoPlugin })
                    }
                })
            )
        }
        else console.log("Não existem plugins")

        let plugins = Array.from(pluginsMap.values())

        return plugins
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = obterVersaoPluginsWp

async function main(){
    let plugins = await obterVersaoPluginsWp()
    plugins.map((plugin) => {
        console.log('Plugin: ', plugin.nomePlugin + ' - ' + 'Versão: ', plugin.versaoPlugin)
    })
}

if (require.main === module) {
    main()
}