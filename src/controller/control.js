const express = require('express');
const urlModel = require("../models/urlModel");
const validUrl = require('valid-url');
const shortId=require('shortid');
//creating short url for long url
const shortingUrl=async function(req,res){
    try{
       
       const longUrl=req.body.longUrl
       
       if(!validUrl.isWebUri(longUrl)){
       return res.status(400).send({status:false,message:"Your URL is not a valid URL"})
       }
       
       const urlExists=await urlModel.findOne({longUrl:longUrl})
      
       if(urlExists){
       return res.status(200).send({status:true,data:urlExists})
       }
    
       const urlCode=shortId.generate(longUrl)
       const shortUrl=`http://localhost:3000/${urlCode}`
        
       const newUrl=await urlModel.create({longUrl,shortUrl,urlCode});
       return res.status(200).send({status:true,data:newUrl})

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }

    
    const urlExists = await urlModel.findOne({ longUrl }, { _id: 0, __v: 0 });

    if (urlExists) {
      await setCache(longUrl, JSON.stringify(urlExists), "EX", 100000);
      return res.status(200).send({ status: true, message: "URL exists in database", data: urlExists });
    }

  
    const urlCode = shortId.generate(longUrl);
    const shortUrl = `${baseUrl}${urlCode}`;

  
    const data = await urlModel.create({ longUrl, shortUrl, urlCode });
    const { _id, __v, ...Data } = data._doc;


    await setCache(urlCode, JSON.stringify(Data), "EX", 100000);

    return res.status(200).send({ status: true, data: Data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//===========================GO TO ORIGINAL URL========================================================
const getUrl = async (req, res) => {
  try {
    const urlCode = req.params.urlCode;

    if (!urlCode) {
      return res.status(400).send({ status: false, message: "Please provide a urlCode" });
    }

  
    let getDataCache = await getCache(urlCode);

    if (getDataCache) {
      const url = JSON.parse(getDataCache);
      return res.status(302).redirect(url.longUrl);
    }

    const url = await urlModel.findOne({ urlCode }, { _id: 0, __v: 0 });

    if (!url) {
      return res.status(400).send({ status: false, message: `URL not found with the code ${urlCode}` });
    }

    await setCache(urlCode, JSON.stringify(url), "EX", 100000);
    return res.status(302).redirect(url.longUrl);

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { shortUrl, getUrl };
