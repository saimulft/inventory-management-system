const express = require("express")
const router = express.Router()
// const connectDatabase = require('../config/connectDatabase')
const { SellingPartnerApiAuth } = require('@sp-api-sdk/auth')
const { ListingsItemsApiClient } = require('@sp-api-sdk/listings-items-api-2021-08-01')

const auth = new SellingPartnerApiAuth({
    clientId: 'amzn1.application-oa2-client.9d6308380bbb400499a6468fc9c8f647',
    clientSecret: 'amzn1.oa2-cs.v1.cefc75ed7c8f152ada6d0a43cc6c3bb85f3e4325c538844725222c8fb58bb55d',
    refreshToken: 'Atzr|IwEBIEjdKUqUrMM9AvsHydz3ujjSQ1Mn8sdpZua25xwY6OgImWc0Wzl0KHWG_Y1LNmvabA1pwIEuadXrrDjpY0In6E_VKZIX_S92UHYdgnpsnnNqu6AUH7aT54JJS5MFT_320mS1ZpaqVDoRpf9BWtThMqBb62d6OVNKQubvg2HF5LPf_q6Hm8eI7WSXQOppvWyaZ0lh9J29O8xl5-AiIFJbizJG5YvwPvJ2gKrg1nLKcl6ma0G_8frDniIUKZMnczAVbT87O1mCsHRoCXT6OGW26LD6toONyOpG82z4Wqn99p9jvItrYFEs9DgnPSeZQuvvXe0CD0f4scAAGFVzESmZW9FQ',
})
const run = async () => {

    router.get('/amazon_list', async (req, res) => {

        const client = new ListingsItemsApiClient({
            auth,
            region: 'eu',
            logging: {
                request: {
                    logger: console.debug
                },
                response: {
                    logger: console.debug
                },
                error: true,
            },
        })
       res.send(client);

    })
}
run()

module.exports = router;