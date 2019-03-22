<template>
	<div class="films-detail-parent">

		<!--header-->
		<homeHeader></homeHeader>

		<!--电影分类组件-->
		<kc-container>
			<kc-container-aside width="200px"></kc-container-aside>
			<div class="search-films-detail-content">

				<img class="search-film-img" src="../../assets/images/5.png" alt="">

				<!--搜索电影展示的详情内容-->
				<div class="search-film-content">
					<div class="search-film-title">
						<h2>西游记后传
							<span>-->电影简介：</span>
						</h2>
					</div>
					<div class="search-film-info">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti dignissimos doloremque fugiat molestiae, non optio reprehenderit totam! Delectus molestiae nam quisquam vero vitae. Ducimus eos et ex porro recusandae reiciendis!
					</div>
				</div>

				<div class="search-display-button">
					<kc-button type="primary" size="small">电影详情</kc-button>
				</div>

			</div>
		</kc-container>
		<kc-container>
			<kc-container-aside width="200px"></kc-container-aside>
			<div class="search-films-detail-content">

				<img class="search-film-img" src="../../assets/images/5.png" alt="">

				<!--搜索电影展示的详情内容-->
				<div class="search-film-content">
					<div class="search-film-title">
						<h2>西游记后传
							<span>-->电影简介：</span>
						</h2>
					</div>
					<div class="search-film-info">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti dignissimos doloremque fugiat molestiae, non optio reprehenderit totam! Delectus molestiae nam quisquam vero vitae. Ducimus eos et ex porro recusandae reiciendis!
					</div>
				</div>

				<div class="search-display-button">
					<kc-button type="primary" size="small">电影详情</kc-button>
				</div>

			</div>
		</kc-container>

			<!--电影详情页面底部的分页按钮，总页数可以通过v-bind绑定数据-->
		<div class="search-split">
				<kc-pagination border layout="prev, pager, next" v-bind:total="50"></kc-pagination>
		</div>

		<HomeFooter></HomeFooter>
	</div>

</template>

<script>

	import HomeHeader from '../../components/homeHeader';
	import HomeFooter from '../../components/homeFooter';

	export default {
		name: 'filmsDetail',
		data () {
			return {
				msg: 'hidhsihi'
			}
		},

		components: {
			HomeHeader,
			HomeFooter
		}
	};
</script>

<style scoped>

	/*1*/
	.films-detail-parent{

	}

	/*2电影详情展示*/
	.search-films-detail-content{
		position: relative;
		margin-bottom: 20px;
		overflow: hidden;
		background: #FFF;
		box-shadow: 2px 2px 10px #CCC;
		width: 60%;
		height: 80%;
		border: 1px solid #ddd;
	}
	.search-film-img{
		padding: 10px;
		float: left;
		width: 180px;
		height: 260px;
		overflow: hidden;
	}
	.search-display-button{
		margin: 5px;
		position: absolute;
		right: 0px;
		bottom: 0px;
	}
	.search-film-content{
		float: left;
		padding: 10px;
		width: 440px;
	}
	.search-film-title {
		height: 30px;
		overflow: hidden;
		font-family: Arial;
	}

	.search-film-info{
		width: 100%;
		overflow: hidden;
		height: 230px;
	}

	/*3 */
	.search-split{
		display: block;
		position: absolute;
		left: 37%;
	}

</style>
