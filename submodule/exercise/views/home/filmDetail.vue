<template>
	<div>
		<!--header组件调用-->
		<HomePage></HomePage>

		<!--影片详情页的编写-->
		<kc-container height="400px">
			<kc-container-aside width="200px"></kc-container-aside>
			<div class="filmDetail-container">
					<img class="filmDetail-img" src="../../assets/images/test.jpg" alt="">

					<div class="filmDetail-content">
						<div class="filmDetail-title">
							<h2>西游记后传&nbsp;  &nbsp;  &nbsp;
							</h2>
						</div>

						<div class="filmDetail-info">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci beatae commodi consectetur dicta dignissimos dolor dolorem eaque error est facere minima nihil quasi quisquam rem sapiente tenetur ullam vero, voluptatem!
						</div>
					</div>

				<div class="display-storyline-button">


						<kc-button type="primary" size="small">剧情详细介绍</kc-button>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At consectetur, ex minus omnis praesentium sed suscipit vel. Accusamus consequatur eius, excepturi explicabo iusto molestias officiis. Dolores itaque possimus quas suscipit.</div>
				</div>
				<!--这边的按钮需要操作，验证用户是否已经购买则显示观看界面；如果没有购买则显示购买按钮，
				如果用户尚未登录，点击之后显示 -->
				<div class="filmDetail-button">
					<kc-button type="primary" size="small">购买观看</kc-button>
				</div>
			</div>

		</kc-container>


		<!--在电影的详情页可以将首页的当前热映的电影组件放在这边；电影详情的功能可以通过点击触发显示-->
		<!--当前热映的影片展示-->
		<div class="block">
			<span class="demonstration"></span>
			<kc-carousel :interval="4000" type="card" height="300px">
				<kc-carousel-item v-for="(item, index) in imgs" :key="index">
					<img v-bind:src="item.imgurl" alt="">
				</kc-carousel-item>
			</kc-carousel>
		</div>

		<!--footer组件的调用-->
		<HomeFooter></HomeFooter>
	</div>
</template>

<script>
	import a from '../../assets/images/1.jpg';
	import b from '../../assets/images/2.jpg';
	import c from '../../assets/images/3.jpg';
	import d from '../../assets/images/4.jpg';
	import f from '../../assets/images/5.png';

	import HomePage from '../../components/homeHeader';
	import HomeFooter from '../../components/homeFooter';

	export default {
		name: 'filmDetail',
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
		components: {
			HomePage,
			HomeFooter
		}

	};
</script>

<style scoped>
	.filmDetail-container{
		position: relative;
		margin-bottom: 20px;
		overflow: hidden;
		background: #FFF;
		box-shadow: 2px 2px 10px #CCC;
		width: 60%;
		height: 80%;
		border: 1px solid #ddd;
	}

	.filmDetail-img{
		padding: 10px;
		float: left;
		width: 180px;
		height: 260px;
		overflow: hidden;
	}
	.filmDetail-content{
		float: left;
		padding: 10px;
		width: 440px;
	}
	.filmDetail-title{
		height: 30px;
		overflow: hidden;
		font-family: Arial;
	}
	.filmDetail-info{
		width: 100%;
		overflow: hidden;
		height: 230px;
	}
	.filmDetail-button{
		margin: 5px;
		position: absolute;
		right: 0px;
		bottom: 0px;
	}
	.display-storyline-button{
		position: absolute;
		left: 200px;
		bottom: 7px;
		margin: 5px;
	}
</style>
