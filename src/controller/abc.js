const shortid = require("shortid");
const urlModel = require("../models/urlModel");
const validator = require("validator");
const redis = require("redis");
const { promisify } = require("util");


const redisClient = redis.createClient({
  host: 'redis-12531.c264.ap-south-1-1.ec2.cloud.redislabs.com',
  port: 12531,
  password: 'TzQYQ4tNsBYJqRAVU5hZZt46NxmDSWXm'
});

redisClient.on('error', (error) => {
  console.error('Redis Error:', error);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});
 
 

//2. Prepare the functions for each command

const setCache = promisify(redisClient.SET).bind(redisClient);
const getCache = promisify(redisClient.GET).bind(redisClient);


const shortUrl = async (req, res) => {
  try {

      if (Object.keys(req.body) === 0) return res.status(400).send({ status: false, message: "plz send url" });

      let { longUrl } = req.body;

      if (!longUrl) return res.status(400).send({ status: false, msg: "plz provide URL" });

      if (!validator.isURL(longUrl)) return res.status(400).send({ status: false, message: "enter valid Url" });

      let getDataCache = await GET_ASYNC(longUrl)   

      getDataCache = JSON.parse(getDataCache)

      if(getDataCache) 
      {return res.status(200).send({status:true,msg:"URL exist, this  is coming from cache",data:getDataCache})}



      let checkUrlExist = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, __v: 0 });

      if (checkUrlExist) {

      await SET_ASYNC(`${req.body.longUrl}`,JSON.stringify(checkUrlExist),"EX",100000)

      return res.status(200).send({status: true,message: "URL already exist, this data is comming from database",data: checkUrlExist});

    } 
    else {

      let shortIdCode = shortid.generate();

      let data = await urlModel.create({urlCode: shortIdCode,longUrl: longUrl,shortUrl: `${req.protocol}://${req.headers.host}/${shortIdCode}`,
      });
        
      let { _id, __v, ...otherData } = data._doc;

      await SET_ASYNC(longUrl,JSON.stringify(otherData),"EX",100000)

      res.status(201).send({ status: true, data: otherData });
    }

  } catch (error) {

    console.log("error in shortUrl", error.message);

    res.status(500).send({ error: error.message });
  }
};

const getUrl = async (req, res) => {
  try {
    let { urlCode } = req.params;

    if (!urlCode) return res.status(400).send({ status: false, message: "plz provide urlCode" });
    
    let getDataCache = await GET_ASYNC(urlCode)
   
    if(getDataCache) {
      console.log("hit");
      return res.status(302).redirect(getDataCache)
    }
      
    let result = await urlModel.findOne({ urlCode: urlCode });
    
    if (!result)return res.status(404).send({status: false,message: `URL Not found with this code ${urlCode}`});

    if (result) {
      await SET_ASYNC(urlCode,JSON.stringify(result.longUrl),"EX",100000)
      return res.status(302).redirect(result.longUrl);
    }

  } catch (error) {

    console.log("error in geturl", error.message);

    res.send({ error: error.message });

  }
};