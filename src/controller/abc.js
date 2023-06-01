const express = require('express');
const urlModel = require("../models/urlModel");
const validUrl = require('valid-url');
const shortId = require('shortid');
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
    host: 'redis-12531.c264.ap-south-1-1.ec2.cloud.redislabs.com',
    port: 12531,
    password: 'TzQYQ4tNsBYJqRAVU5hZZt46NxmDSWXm'
});

client.on('error', (error) => {
    console.error('Redis Error:', error);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('ready', () => {
    console.log('Redis is ready to accept commands');
});
 
const getData = promisify(client.get).bind(client);
const setData = promisify(client.set).bind(client);

// Creating short URL for long URL
const shortingUrl = async function (req, res) {
    try {
        const longUrl = req.body.longUrl;
        if (!longUrl) return res.status(400).send({ status: false, message: "Please provide a URL" });

        if (!validUrl.isWebUri(longUrl)) {
            return res.status(400).send({ status: false, message: "Your URL is not valid" });
        }

        const cachedData = await getData(`${longUrl}`);
        cachedData = JSON.parse(cachedData)
        
        if (cachedData) {
            return res.send({ status: true, data: cachedData });
        }

        const urlExists = await urlModel.findOne({ longUrl: longUrl });
        if (urlExists) {
            return res.status(200).send({ status: true, data: urlExists });
        }

        const urlCode = shortId.generate(longUrl);
        const shortUrl = `http://localhost:3000/${urlCode}`;

        const newUrl = await urlModel.create({ longUrl, shortUrl, urlCode });

       const wait= await setData(longUrl, shortUrl, 'EX', 10);

        return res.status(200).send({ status: true, data: newUrl });
    } catch (error) {
        return res.status(500).send({ status: false, message: error });
    }
};

// Getting URL from the database
const getUrl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode;

        const cachedData = await getData(`${urlCode}`);
        if (cachedData) {
            return res.send({ status: true, data: cachedData });
        }

        const url = await urlModel.findOne({ urlCode: urlCode });
        if (!url) {
            return res.status(400).send({ status: false, message: "Please provide a valid urlCode" });
        }

        return res.status(302).redirect(url.longUrl);
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { shortingUrl, getUrl };
