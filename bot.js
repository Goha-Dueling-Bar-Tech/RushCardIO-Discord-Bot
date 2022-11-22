require("dotenv").config();
const { Client, Intents } = require("discord.js");
const express = require('express')
const app = express()
const port = process.env.PORT
const server = app.listen(port)
server.keepAliveTimeout = 60 * 1000;
server.headersTimeout = 61 * 1000;

const { fetchData } = require("./fetcher")

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.once("ready", () => {
    client.channels.cache.forEach(async c => {
        const channelId = c.id
        if(c.guild.me.permissionsIn(c.id).has('MANAGE_WEBHOOKS') && c.guild.me.permissionsIn(c.id).has('SEND_MESSAGES') && c.name.includes('playground')) {
            console.log(c.name)

            const data  = await fetchData()

            const filteredData = data.filter(obj => {
                const { latter } = obj
                if (latter.toLowerCase().includes('minute')) {
                    return true
                }
                if (latter.toLowerCase().includes('second')) {
                    return true
                }

                return false
            })

            for (let obj of filteredData) {
                const { url, title, author } = obj
                c.send(`
🆕 Deck Posted By **${author}** 📰
🔎 Check *${title}* out at ${url} 🔗
                `)
            }
        }
    })
})


app.get('/', async (req, res) => {
    res.end('ran')
})


client.login(process.env.TOKEN);
