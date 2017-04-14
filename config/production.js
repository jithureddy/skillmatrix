module.exports = {
	log: "debug",
	ws: {
		url: 'ws://52.178.27.219:8090/'
	},
	http:{
		url: 'http://52.178.27.219:8090/'
	},
	db: {
    	provider: "mongodb",
    	connection: "mongodb://localhost:27017/mc_prod",
    	workItemsCollection: 'work_items',
    	containersCollection: 'containers'
  	},
  	bot: {
    appId:'03733acc-90f3-4f6d-9647-ff221fbdcb33',
    appPass: 'bjpiZCJECNRM8Cbaj50DYsQ'
  }
};
