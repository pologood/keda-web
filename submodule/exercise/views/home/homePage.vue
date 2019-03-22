<template>
	<div>
		<!--测试引入局部组件  success-->
		<homeHeader></homeHeader>

		<!--轮播图的效果-->
		<div class="home-display-content">
			<kc-carousel :interval="4000" type="card" height="300px">
				<kc-carousel-item v-for="(item, index) in imgs" :key="index">

					<img v-bind:src="item.imgurl" alt="">
					<!--<img v-bind:src="item.subjects.images.medium" alt="点击进入电影详情">-->
				</kc-carousel-item>
			</kc-carousel>
		</div>

		<kc-button type="primary" size="small" v-on:click="startLoadFilms">加载</kc-button>


		<!--当前热映的影片展示-->
		<div class="block">
			<span class="demonstration"></span>
			<kc-carousel height="150px">
				<kc-carousel-item v-for="item in 4" :key="item">
					<h3>{{ item }}</h3>
				</kc-carousel-item>
			</kc-carousel>
		</div>


		<!--影片的分类-->
		<div class="home-films-category">
			<kc-tabs type="card" v-on:click="handlerClick">

				<kc-tab-pane label="剧情片" name="first">
					<!--分类的电影展示-->
					<kc-carousel :interval="4000" type="card" height="200px">
						<kc-carousel-item v-for="item in 3" :key="item">
							<h3>{{ item }}</h3>
						</kc-carousel-item>
					</kc-carousel>
				</kc-tab-pane>

				<kc-tab-pane label="爱情片" name="second">
					<kc-carousel :interval="4000" type="card" height="200px">
						<kc-carousel-item v-for="item in 3" :key="item">
							<h3>{{ item }}</h3>
						</kc-carousel-item>
					</kc-carousel>
				</kc-tab-pane>

				<kc-tab-pane label="恐怖片" name="third">
					<kc-carousel :interval="4000" type="card" height="200px">
						<kc-carousel-item v-for="item in 3" :key="item">
							<h3>{{ item }}</h3>
						</kc-carousel-item>
					</kc-carousel>
				</kc-tab-pane>

				<kc-tab-pane label="动画片" name="fourth">
					<kc-carousel :interval="4000" type="card" height="200px">
						<kc-carousel-item v-for="item in 3" :key="item">
							<h3>{{ item }}</h3>
						</kc-carousel-item>
					</kc-carousel>
				</kc-tab-pane>
			</kc-tabs>
		</div>
	</div>


</template>

<script>

	//<!--导入axios的异步获取轮播图的方法-->
	// import {load_home_rotateFilms} from '../../service/loadHome';

	//本地测试轮播图的图片。 success
	import a from '../../assets/images/1.jpg';
	import b from '../../assets/images/2.jpg';
	import c from '../../assets/images/3.jpg';
	import d from '../../assets/images/4.jpg';
	import f from '../../assets/images/5.png';

	//测试导入局部组件
	import HomeHeader from '../../components/homeHeader'

	export default {
		name: 'homePage',
		data () {
			return {
				imgs:[
					{imgurl: a},
					{imgurl: b},
					{imgurl: c},
					{imgurl: d},
					{imgurl: f}
				]
			}
		},
		methods: {
			startLoadFilms(){
				load_home_rotateFilms().then(res => {
					this.imgs = res.result;

				})
			},
			handlerClick(tab, event){
				console.log(tab, event);
			}
		},
		// beforeMount: {
		// 	handlerClick(tab, event){
		// 		console.log(tab, event);
		// 	}
		// },
		//使用局部组件，需要注册，将其作为子组件
		components: {
			HomeHeader
		}
	};
</script>

<style scoped>

	/*box-padding设置padding=0*/
	.box-padding{
		padding: 0;
	}

	/*<!--header的css效果-->*/
	/*.header{*/
		/*width: 100%;*/
		/*border: 1px solid #e4e7ed;*/
		/*position: absolute;*/
	/*}*/
	/*.header-search-style{*/
		/*padding-left: 20px;*/
		/*width: 40rem;*/
		/*height: 2.2rem;*/
		/*border-radius: 30px;*/
		/*display: inline-block;*/
	/*}*/
	/*.header-user-img{*/
		/*padding-left: 20px;*/
		/*display: inline-block;*/
	/*}*/
	/*.header-button{*/
		/*padding-top: 2px;*/
		/*padding-left: 20px;*/
		/*display: inline-block;*/
	/*}*/
	/*.header-search-cinemas{*/
		/*padding-top: 2px;*/
		/*display: inline-block;*/
		/*position: absolute;*/
		/*right: 500px;*/
	/*}*/
	/*.header-user-settings{*/
		/*padding-top: 2px;*/
		/*display: inline-block;*/
		/*position: absolute;*/
		/*right: 200px;*/
	/*}*/

	/*轮播图的css效果 + 当前热映的影片展示效果*/
	.kc-carousel__item h3 {
		color: #475669;
		font-size: 14px;
		opacity: 0.75;
		line-height: 200px;
		margin: 0;
	}

	.kc-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.kc-carousel__item:nth-child(2n+1) {
		background-color: #d3dce6;
	}

	.home-display-content{
		padding-top: 20px;
	}

	/*影片的分类样式*/
	.home-films-category{
		padding-top: 20px;
	}
</style>
