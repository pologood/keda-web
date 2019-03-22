<template>
	<div class="tags-view-container">
		<div @click.prevent.stop="goForward()" class="go-forward-btn" v-if="visitedViews.length>=12">
			<span><i class="kc-icon-arrow-left"></i></span>
		</div>
		<div ref="scrollPane" class="tags-view-wrapper" :class="{'tags-view-offset':visitedViews.length>=12}">
			<!-- <scroll-pane ref="scrollPane" class="tags-view-wrapper" :class="{'tags-view-offset':visitedViews.length>=12}"> -->
			<router-link
				v-for="(tag,index) in visitedViews"
				ref="tag"
				:class="isActive(tag)?'active':''"
				:to="{ path: tag.url}"
				:key="tag.id"
				tag="span"
				@click.native="changePath(tag.url)"
				class="tags-view-item">
				<span class="kc-icon-dot" :class="isActive(tag)?'active':''"></span>
				<span class="tags-view-txt" :title="tag.title">{{ tag.title }}</span>
				<span class="kc-icon-close" @click.prevent.stop="closeSelectedTag(tag,index)" ></span>
			</router-link>
			<!-- </scroll-pane> -->
		</div>
		<div @click.prevent.stop="goBack()" class="go-back-btn" v-if="visitedViews.length>=12">
			<span><i class="kc-icon-arrow-right"></i></span>
		</div>
	</div>
</template>

<script>
	import ScrollPane from '../ScrollPane/index';

	export default {
		components: { ScrollPane },
		props: {
			// tagList: {
			// 	type: Array
			// }
		},
		data() {
			return {
				visitedViews: [],
				tagList: []
			};
		},
		computed: {
			/*visitedViews() {
                return this.tagList.slice(this.tagList.length-3,this.tagList.length);
            }*/
		},
		watch: {
			tagList(newVal){
				if(newVal.length > 12){
					this.visitedViews = newVal.slice(newVal.length - 12, newVal.length);
				}else{
					this.visitedViews = newVal;
				}
			},
			'$route': function () { //路由变化，改变面包屑
				let res = this.getActiveTag();
				this.$emit('isChange', res);
			}
		},
		mounted() {
			this.tagList = this.$store.state.main.tagList;
		},
		methods: {
			changePath(url){
				console.log(url, 'url---------------------');
				this.$emit('changeUrl', url);
			},
			isActive(tag) { //激活状态
				return tag.url === this.$route.path;
			},
			getActiveTag(){ //获取当前激活标签
				let res = '';
				for (let i = 0, len = this.visitedViews.length; i < len; i++) {
					if (this.visitedViews[i].url === this.$route.path) {
						res = this.visitedViews[i];
						return res;
					}
				}
			},
			closeSelectedTag(view, index) { //关闭某个标签
				if (this.visitedViews.length === 1) { //保留一个页签（暂定）
					return;
				}
				for(let i = 0; i < this.tagList.length; i++){
					if(this.visitedViews[index] == this.tagList[i]){
						this.tagList.splice(i, 1);
						console.log('$route', this.$route.path);
						console.log('$view', view);
						if(this.$route.path == view.url){
							this.$router.push(this.tagList[this.tagList.length - 1].url);
						}
					}
				}
			},
			goForward(){  //向前获取tab
				if(this.tagList[0] == this.visitedViews[0]){
					return;
				}
				for(var i = 0; i < this.tagList.length; i++){
					if(this.visitedViews[0] == this.tagList[i]){
						if(this.tagList[i - 1]){
							this.visitedViews.unshift(this.tagList[i - 1]);
						}
						this.visitedViews.pop();
						return;
					}
				}
			},
			goBack(){  //向后获取tab
				if(this.tagList[this.tagList.length - 1] == this.visitedViews[this.visitedViews.length - 1]){
					return;
				}
				for(var i = 0; i < this.tagList.length; i++){
					if(this.visitedViews[this.visitedViews.length - 1] == this.tagList[i]){
						if(this.tagList[i + 1]){
							this.visitedViews.push(this.tagList[i + 1]);
						}
						this.visitedViews.shift();
						return;
					}
				}
			}
		}
	};
</script>
