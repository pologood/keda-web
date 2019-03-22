<template>

	<!--KFront Base的栅格布局---24 -->
	<kc-row>
		<kc-col :span="24">
			<div class="grid-content bg-purple-light">
				<!--用户头像-->
				<div class="header-user-img">
					<kc-avatar icon="info" size="large"></kc-avatar>
				</div>
				<!--输入框-->
				<div class="header-search-style">
					<kc-input   placeholder="搜索电影"></kc-input>
				</div>

				<div class="header-button">
					<!--按钮-->
					<kc-row>
						<kc-button type="primary" icon="kc-icon-search">搜索</kc-button>
					</kc-row>
				</div>
				<!--搜索影院-->
				<div class="header-search-cinemas">
					<kc-button type="primary" icon="kc-icon-view">影院</kc-button>
				</div>
				<!--个人中心-->
				<div class="header-user-settings">
					<kc-button type="info " icon="kc-icon-setting">个人中心</kc-button>
				</div>
			</div>
		</kc-col>
	</kc-row>
</template>

<script>
	export default {
		name: 'homeHeader'
	};
</script>

<!--首页的header样式-->
<style scoped>
	<!--header的css效果-->
	.header{
		width: 100%;
		border: 1px solid #e4e7ed;
		position: absolute;
	}
	.header-search-style{
		padding-top: 15px;
		padding-left: 80px;
		width: 40rem;
		/*设置居中*/
		/*text-align: center;*/
		margin: 0 auto;
		border-radius: 30px;
		display: inline-block;
	}
	.header-user-img{
		padding-top: 15px;
		padding-left: 20px;
		display: inline-block;
	}
	.header-button{
		padding-top: 15px;
		padding-left: 20px;
		display: inline-block;
	}
	.header-search-cinemas{
		padding-top: 15px;
		display: inline-block;
		position: absolute;
		right: 500px;
	}
	.header-user-settings{
		padding-top: 15px;
		display: inline-block;
		position: absolute;
		right: 200px;
	}

	/*KFront Base栅格布局24的效果*/
	.kc-col {
		border-radius: 4px;
	}

	.kc-row {
		position: relative;
		margin-bottom: 20px;
	}
	.bg-purple-light {
		background: #e5e9f2;
	}
</style>
