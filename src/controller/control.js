const express = require('express');
const urlModel = require("../models/urlModel");
const validUrl = require('valid-url');
const shortId = require('shortid');
//creating short url for long url
const shortingUrl = async function (req, res) {
    try {

        const longUrl = req.body.longUrl

        if (!longUrl) return res.status(400).send({ status: false, message: "Please provide URL" })

        if (!validUrl.isWebUri(longUrl)) {
            return res.status(400).send({ status: false, message: "Your URL is not a valid URL" })
        }
        const baseUrl = "http://localhost:3000/"
        if (!baseUrl) return res.status(400).send({ status: false, message: "Invalid request, please provide baseUrl" })

        const urlExists = await urlModel.findOne({ longUrl: longUrl })

        if (urlExists) {
            return res.status(200).send({ status: true, data: urlExists })
        }

        const urlCode = shortId.generate(longUrl)
        const shortUrl = `http://localhost:3000/${urlCode}`


        const newUrl = await urlModel.create({ longUrl, shortUrl, urlCode });
        return res.status(200).send({ status: true, data: newUrl })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//getting url from database
const getUrl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode
        const url = await urlModel.findOne({ urlCode: urlCode })
        if (!url) {
            return res.status(400).send({ status: false, message: "please provide a valid urlCode" })
        }
        //return res.status(200).send({status:true,data:url.longUrl})
        return res.status(302).redirect(url.longUrl)
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

module.exports = { shortingUrl, getUrl }
