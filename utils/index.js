import Global from './global';
import Auth from './auth';
import Util from './util';
//for mixins
export default {
	methods: {
		...Global,
		...Auth,
		...Util
	}
};
