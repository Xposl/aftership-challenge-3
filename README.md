## The challenge
---

* DOWNLOAD this repository to your own Github public repository.
* Create a new repo, name it by using this shortGUID generator
* Do NOT fork, as other candidates would be able to see your solution easily.
* Use [beanstalkd](http://kr.github.io/beanstalkd/), mongodb, nodejs
* Get the xe.com exchange rate, store it in mongodb for every 1 min.


## Goal
----
Code a currency exchagne rate `worker`

1. Input currency from USD, to HKD
2. Get USD to HKD currency every 1 min, save 10 successful result to mongodb.
3. If any problem during the get rate attempt, retry it delay with 3s
4. If failed more than 3 times, give up the job.

#### The worker should:
Scale horizontally (can run in more than 1 process in many different machines)

## How to run this worker?
---

1. Seed my job in beanstalkd. here I use tube_name = 'xposl'

2. I had Code a nodejs worker, get the job from beanstalkd, get the data from xe.com and save it to mongodb. Exchange rate need to be round off to `2` decmicals in `STRING` type.
	
	a. If request fail, reput to the tube and delay with 3s.

	b. If request is done, reput to the tube and delay with 60s.

#### I had write a settings file in config/configs.js to set the config of this worker, please make sure the config is right to your system
  module.exports = {
	beanTalk: {
	  host: [the aftership beanstalk host],

     	//the port of this server
		port: 11300,

		//the tubes list in this worker
		tubes: ['xposl']

	},

	handlers: {
		currency_rate:	{
			mongodb: {
			
				//the mongodb server I had to save the result
				url: 'mongodb://aftership:123123@ds029960.mongolab.com:29960/aftership_challenge',
				collection: 'currency'
			},
			success: {
				//how may time will try if the request success, here is 10
				time: 10,

				//when will the next request start if success this time, here means 10 sec
				delay: 10
			},
			failed: {
				//how may time will try if the request failed
				time: 3,
				//when will the next request start if failed this time, here means 3 sec
				delay: 3
			}
		}
	}
};

3. run the work use command 'node index' in the root folder of this project

There will display some information like

####
```
  worker init
  worker start

```
Now add a new job with the payload data like
##### beanstalk payload for getting HKD to USD currency, because use fivebeans worker to finish it the payload now use:
```
{
  "type" : "currency_rate",
  "payload" : [
    {
      "from": "HKD",
      "to": "USD"
    },
	{
      "from": "HKD",
      "to": "AUD"
    }
  ]
}

```

The command window will display:
#### Send a new request
```
new request
get result of  { from: 'HKD', to: 'AUD' }
get result of  { from: 'HKD', to: 'USD' }
the result is  { from: 'HKD',
  to: 'AUD',
  create_at: Wed Mar 11 2015 19:56:28 GMT+0800 (CST),
  value: '0.13',
  error: 0,
  message: 'success' }
the result is  { from: 'HKD',
  to: 'USD',
  create_at: Wed Mar 11 2015 19:56:28 GMT+0800 (CST),
  value: '0.13',
  error: 0,
  message: 'success' }
Request Success 1
Data save successful!

```


After the task finish, the success result will be store in the mongodb database like
##### mongodb data:
```
{
    "_id": {
        "$oid": "550020edcee03fc211818eb0"
    },
    "from": "HKD",
    "to": "USD",
    "create_at": {
        "$date": "2015-03-11T11:03:06.839Z"
    },
    "value": "0.13",
    "error": 0,
    "message": "success"
}
```


