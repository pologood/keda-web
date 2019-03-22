<template>
	<div class="box-padding">
		test page<br>
		ID:
		<kc-input v-model="test.id"></kc-input>
		testcol:
		<kc-input v-model="test.testcol"></kc-input>
		{{test}}
		<kc-button type="primary" size="small" @click="setName">测试</kc-button>
		<kc-button type="primary" size="small" @click="loadTest">LOAD</kc-button>
	</div>
</template>

<script>
	import { findTest } from '../../service/testMgt.js';

	export default {
		data () {
			return {
				test: {id: '', testcol: ''}
			};
		},
		methods: {
			setName(){
				this.test.testcol = 'def';
			},
			loadTest(){
				if (this.test.id) {
					findTest(this.test.id).then(res => {
						console.log(res);
						this.test = res.result;
					}, err => {
						this.$message.warning(err);
						this.userDataLoading = false;
					});
				}
			}
		},
		components: {}
	}
	;

</script>
