const axios = require('axios')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const model = require('./database/pluginSchema')
const obterVersaoPluginsWp = require('./obterVersaoPluginsWp')
const scanVulnerabilidadePlugin = require('./scanVulnerabilidadePlugin')
dotenv.config({path: '../.env' })

async function infoPlugins(){
    try {
        let url = process.argv[2]
        let plugins = await obterVersaoPluginsWp(url)
        let objetoInfoPlugins = {}
        await Promise.all(
            plugins.map(async(plugin) => {
                let infoPlugin = await model.findOne({"slug": plugin.nomePlugin, "version": plugin.versaoPlugin})
                if(!infoPlugin){
                    const repostaApi = await axios.get(`https://api.wordpress.org/plugins/info/1.0/${plugin.nomePlugin}.json`)
                    const documento = repostaApi.data
                    await model.updateOne({slug: plugin.nomePlugin}, documento, { upsert: true})
                    infoPlugin = documento
                }
                const propriedadesDesejadas = propriedadesDesejadasPlugins(infoPlugin, plugin)
                const vulnerabilidadePlugin = await scanVulnerabilidadePlugin(propriedadesDesejadas)
                propriedadesDesejadas.vulnerabilities = vulnerabilidadePlugin
                objetoInfoPlugins[plugin.nomePlugin] = propriedadesDesejadas
            })
        )
        //console.log({plugins: objetoInfoPlugins})
        return {plugins: objetoInfoPlugins}
    } catch (error) {
        console.log(error.message)
    } finally{
        mongoose.connection.close()
        .catch((error) => {
            console.error('Erro ao fechar a conexão com o banco de dados:', error.message)
        })
    }
}

function propriedadesDesejadasPlugins(infoPlugin, plugin){
    const desatualizado = plugin.versaoPlugin != infoPlugin.version

    if(desatualizado){
        if (require.main === module) {
            console.log(`Plugin ${plugin.nomePlugin} (${plugin.versaoPlugin}) está desatualizada, assim que possível atualizar para a ${infoPlugin.version} sendo ${infoPlugin.version} a versão latest`)
        }
    }
    return {
        name: infoPlugin.name,
        slug: infoPlugin.slug,
        last_updated: infoPlugin.last_updated,
        version: {
            number: plugin.versaoPlugin
        },
        added: infoPlugin.added,
        outdated: desatualizado,
        latest_version: infoPlugin.version
    }
}

module.exports = infoPlugins

infoPlugins()