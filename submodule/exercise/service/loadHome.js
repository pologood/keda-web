import axios from './ajax';

import myGlobal from '../utils/myGlobal'

//es6的箭头函数
/*
function f1(id, name){
	return ...;
	}

等同于=====>
  f1= (id, name) =>{}
 */
export const load_home_rotateFilms = () =>{
	return axios.ajax4exercise('https://api.douban.com/v2/movie/in_theaters?city=苏州&start=0&count=6', 'get');
}
