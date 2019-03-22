const user = {
	state: {},
	mutations: {
		logout (state, vm) {
			sessionStorage.clear();
			window.location.href = 'index.html';
		}
	}
};

export default user;
