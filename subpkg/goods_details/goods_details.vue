<template>
	<!-- 导致问题的原因：在商品详情数据请求回来之前，data 中 goods_info 的值为 {}，因此初次渲染页面时，会导致 商品价格、商品名称 等闪烁的问题。
解决方案：判断 goods_info.goods_name 属性的值是否存在，从而使用 v-if 指令控制页面的显示与隐藏： -->
	<view v-if="goods_info.goods_name">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, i) in goods_info.pics" :key="i">
				<!-- 把当前点击图片的索引，传递到preview()处理函数中 -->
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费 -- {{cart.length}}</view>
		</view>
		<!-- 商品详情信息 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<!-- 商品导航组件 -->
		<view class="goods_nav">
		  <!-- fill 控制右侧按钮的样式 -->
		  <!-- options 左侧按钮的配置项 -->
		  <!-- buttonGroup 右侧按钮的配置项 -->
		  <!-- click 左侧按钮的点击事件处理函数 -->
		  <!-- buttonClick 右侧按钮的点击事件处理函数 -->
		  <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	// 从vuex中按需导出 mapState 辅助方法
	import {mapState} from "vuex"
	import {mapMutations} from "vuex"
	import {mapGetters} from "vuex"
	export default {
		data() {
			return {
				// 商品详情对象
				goods_info: {},
				 // 左侧按钮组的配置对象
				    options: [{
				      icon: 'shop',
				      text: '店铺'
				    }, {
				      icon: 'cart',
				      text: '购物车',
				      info: 2
				    }],
				    // 右侧按钮组的配置对象
				    buttonGroup: [{
				        text: '加入购物车',
				        backgroundColor: '#ff0000',
				        color: '#fff'
				      },
				      {
				        text: '立即购买',
				        backgroundColor: '#ffa200',
				        color: '#fff'
				      }
				    ]
			};
		},
		computed:{
			 // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
			 // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
			    ...mapState('m_cart', ['cart']),
				 // 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
				 ...mapGetters('m_cart',['total'])
		},
		onLoad(options) {
			// 获取商品id
			const goods_id = options.goods_id
			// 调用获取商品详情信息的方法
			this.getGoodsDetail(goods_id);
		},
		methods: {
			// 定义请求商品详情数据的方法
			async getGoodsDetail(goods_id) {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/detail', {
					goods_id
				});
				if (res.meta.status !== 200) return uni.$showMsg();
				// 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
				// 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;" ').replace(/webp/g, 'jpg')

				// 为 data 中的数据赋值
				this.goods_info = res.message
			},
			// 实现轮播图的预览效果
			preview(i) {
				// 调用 uni.previewImage() 方法预览图片
				uni.previewImage({
					// 预览时，默认显示图片的索引
					current: i,
					// 所有图片 url 地址的数组
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},
			// 左侧按钮的点击事件处理函数
			onClick(e){
				console.log(e)
				if(e.content.text === "购物车"){
					// 切换到购物车页面
					uni.switchTab({
						url:'/pages/cart/cart'
					})
				}
			},
			// 右侧 (加入购物车) 按钮的点击事件处理函数
			buttonClick(e){
				console.log('method:buttonClick')
				console.log(e)
				// 1.判断是否点击了加入购物车 按钮
				if(e.content.text === "加入购物车") {
					// 2.组织一个商品的对象信息
					const goods = {
						goods_id: this.goods_info.goods_id,       // 商品的Id
					    goods_name: this.goods_info.goods_name,   // 商品的名称
					    goods_price: this.goods_info.goods_price, // 商品的价格
					    goods_count: 1,                           // 商品的数量
					    goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
					    goods_state: true                         // 商品的勾选状态
					}
					// 3.通过this调用映射过来的addToCart方法，把商品信息对象存储到购物车数组中
					this.addToCart(goods)
				}
			},
			// 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
			...mapMutations('m_cart',['addToCart'])
		},
	watch:{
		// 监听购物车商品总数 total 值变化，通过形参newVal获得变化后的新值
		total: {
			handler(newVal){
			// 通过数组的 find()方法，找到哦购物车按钮的配置对象
			const findResult = this.options.find((x)=>{
				return x.text === '购物车'
			})
			console.log('watch:total')
			if(findResult) {
				// 动态为购物车按钮的info属性赋值
				findResult.info = newVal
			}	
			},
			// immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
			immediate:true
		}
	}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	// 商品信息区域的样式
	.goods-info-box {
		padding: 10px;
		padding-right: 0;

		.price {
			color: #c00000;
			font-size: 18px;
			margin: 10px 0;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
				padding-right: 10px;
			}

			// 收藏区域
			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}

		// 运费
		.yf {
			margin: 10px 0;
			font-size: 12px;
			color: gray;
		}
	}
	
	.goods-detail-container {
	  // 给页面外层的容器，添加 50px 的内padding，
	  // 防止页面内容被底部的商品导航组件遮盖
	  padding-bottom: 50px;
	}
	
	.goods_nav {
	  // 为商品导航组件添加固定定位
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	}
</style>
