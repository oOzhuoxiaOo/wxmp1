<template>
	<view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'/subpkg/goods_details/goods_details?goods_id=' + item.goods_id">
					<image :src="item.image_src" mode=""></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandle(item)">
				<image :src="item.image_src" class="nav-img" ></image>
			</view>
		</view>
		
		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,index) in floorList" :key="index">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class='floor-title'></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧一个图片 大盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"  mode="widthFix" :style="{width: item.product_list[0].image_width + 'rpx'}"></image>
					</navigator>
					<!-- 右侧四个小图片 大盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" :url="item2.url" v-for="(item2,index2) in item.product_list" :key="index2" v-if="index2!==0">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图数据列表，默认为空数组
				swiperList:[],
				// 分类导航的数据列表,默认空数组
				navList:[],
				// 楼层的数据列表,默认空数组
				floorList:[]
			};
		},
		// 小程序home页面刚加载时调用方法,初始化数据
		onLoad() {
			// 获取轮播图数据
			this.getSwiperList();
			// 获取导航分类数据
			this.getNavList();
			// 获取楼层数据
			this.getFloorList();
			
		},
		methods: {
			// 获取轮播图数据的方法
			 async getSwiperList(){
				 // 发起请求
				const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
				//  请求失败
				if(res.meta.status !== 200) return uni.$showMsg('轮播图列表数据请求失败');
				//  请求成功，为data中数据赋值
				this.swiperList = res.message
				// uni.$showMsg('轮播图数据请求成功')
				// console.log(res) //debug 打印获取的数据 校验数据情况
			},
			// 获取导航数据的方法
			async getNavList(){
				// 发起请求
				const {data:res} = await uni.$http.get('/api/public/v1/home/catitems')
				//  请求失败
				if(res.meta.status !== 200) return uni.$showMsg('导航列表数据请求失败');
				//  请求成功，为data中数据赋值
				this.navList = res.message
				// uni.$showMsg('导航数据请求成功')
				// console.log(res) //debug 打印获取的数据 校验数据情况
			},
			// 获取楼层数据的方法
			async getFloorList(){
				// 发起请求
				const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
				//  请求失败
				if(res.meta.status !== 200) return uni.$showMsg('楼层数据请求失败');
				// 由于请求来的navigator_url不符合要求，修改一下自定义一个url
				res.message.forEach(floor=>{
					floor.product_list.forEach((prod)=>{
						prod.url = "/subpkg/goods_list/goods_list?" + prod.navigator_url.split('?')[1]
					})
				})
				//  请求成功，为data中数据赋值
				this.floorList = res.message
				uni.$showMsg('楼层数据请求成功')
				console.log(res) //debug 打印获取的数据 校验数据情况
			},
			// nav-item项 被点击时候的 事件处理函数
			navClickHandle(item){
				// 判断点击的是哪个 nav
				if(item.name === '分类'){
					uni.switchTab({
						url:"/pages/cate/cate"
					})
				}
			},
			
		}
	}
</script>

<style lang="scss">
	// 轮播图
	swiper{
		height: 330rpx;
		
		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	// 导航分类
	.nav-list{
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
		.nav-img{
			width: 128rpx;
			height: 140rpx;
		}
	}
	
	// 楼层标题
	.floor-title {
		display: flex;
		height: 60rpx;
		width: 100%;
	}
	
	.right-img-box {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: space-around;
	}
	
	.floor-img-box {
	  display: flex;
	  padding-left: 10rpx;
	}
</style>
