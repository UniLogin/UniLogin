class CounterfactualTransactionsService {

	// TODO make this an actual storage
	constructor() {
		this.counterFactualContracts = {};
	}

	upsertData(identityContract, fullData) {
		this.counterFactualContracts[identityContract] = fullData;
	}

	getData(identityContract) {
		return this.counterFactualContracts[identityContract]
	}

	removeData(identityContract) {
		delete this.counterFactualContracts[identityContract];
	}
}

export default CounterfactualTransactionsService;