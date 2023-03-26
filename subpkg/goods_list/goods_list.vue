<template>
	<view>
		<view class="goods-list">
			<view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
				<my-goods :goods="item"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象(接口需求)
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类ID
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10,
				},
				// 商品列表数据
				goodsList: [],
				// 查询到的商品总数
				total: 0,
				// 节流阀
				isLoading: false
				
			};
		},
		onLoad(options) {
			//  将页面跳转时携带的参数 保存到queryObj对象中
			console.log(options)
			this.queryObj.query = options.query || '';
			this.queryObj.cid = options.cid || '';
			// 调用获取商品列表的方法
			this.getGoodsList();

		},
		methods: {
			// 获取商品列表的方法
			async getGoodsList(cb) {
				this.isLoading = true;
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
				this.isLoading = false;
				  // 只要数据请求完毕，就立即按需调用 cb 回调函数
				cb && cb();
				if (res.meta.status !== 200) return uni.$showMsg();
				// 为数据赋值 通过展开运算符，进行新旧数据拼接
				this.goodsList = [...this.goodsList,...res.message.goods];
				this.total = res.message.total;
			},
			// 点击跳转到商品详情页面
			gotoDetail(item){
				uni.navigateTo({
					url: '/subpkg/goods_details/goods_details?goods_id=' + item.goods_id
				});
			}
		},
		// 触底的事件
		onReachBottom() {
			 // 判断是否还有下一页数据
			  if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if(this.isLoading) return;
			// 页码+1
			this.queryObj.pagenum +=1;
			// 重新获取列表数据
			this.getGoodsList();
		},
		// 上拉刷新
		onPullDownRefresh() {
			 // 1. 重置关键数据
			  this.queryObj.pagenum = 1
			  this.total = 0
			  this.isloading = false
			  this.goodsList = []
			  // 2. 重新发起请求
			    this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
