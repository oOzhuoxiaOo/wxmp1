<template>

	<view class="search-box">
		<!-- 使用 uni-ui 提供的搜索组件 -->
		<uni-search-bar @input="input" :radius="100" cancelButton="none" bgColor="#fff"></uni-search-bar>
		
		<!-- 搜索历史 -->
		<view class="history-box" v-show="searchResults.length === 0">
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item,i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 定时器的timerID
				timer: null,
				// 搜索关键词
				kw:'',
				// 搜索建议结果列表
				searchResults:[],
				// 搜索历史的列表
				historyList:[],
				// 3
			};
		},
		computed:{
			historys(){
				 // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
				    // 而是应该新建一个内存无关的数组，再进行 reverse 反转
				    return [...this.historyList].reverse()
			}
		},
		methods:{
			input(e){
				// 清除 timer 对应的定时器
				clearTimeout(this.timer)
				// 重新启动一个定时器，并把timerID 赋值给 this.timer
				this.timer = setTimeout(()=>{
					// 如果500毫秒内，没有触发新的输入事件，则为搜索关键词赋值
					this.kw = e;
					console.log(e)
					
					// 调用获取搜索建议列表的方法
					this.getSearchResults();
				},500)
				
			},
			async getSearchResults(){
				// 判断关键词是否为空
				if(this.kw==='') {
					this.searchResults = []
					return
				}
				
				// 发起请求，获取搜索1建议列表
				const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw})
				if(res.meta.status !== 200) return uni.$showMsg();
				this.searchResults = res.message;
				console.log(res)
				//  查询到搜索建议后，保存关键词
				this.saveSearchHistory();
			},
			
			gotoDetail(goods_id){
				uni.navigateTo({
					url: '/subpkg/goods_details/goods_details?goods_id =' + goods_id
				})
			},
			// 保存关键词的方法
			saveSearchHistory(){
				 this.historyList.push(this.kw)
				 // 将array数组转化为 set 对象
				 const set = new Set(this.historyList);
				 // 调用Set对象的delete方法，移除对应元素
				 set.delete(this.kw)
				 // 调用set对象的add方法，向Set中添加元素
				 set.add(this.kw)
				 // 将Set对象转化为 Array数组
				 this.historyList = Array.from(set);
				 // 调用 uni.setStorageSync(key,value) 将搜索记录持久化存储到本地
				 uni.setStorageSync('kw',JSON.stringify(this.historyList));
				 // 1
			 },
			 // 清空历史记录的方法
			 clearHistory(){
				 // 清空data中保存的历史记录
				 this.historyList = [];
				 // 清空本地保存的历史记录
				 uni.setStorageSync('kw','[]')
			 },
			 gotoGoodsList(item){
				 uni.navigateTo({
					 // (item 就是kw)
				 	url: '/subpkg/goods_list/goods_list?query=' + item
				 })
			 }
		},
		onLoad() {
			// 在onLoad生命周期函数中 加载本地存储的搜索历史记录
			this.historyList = JSON.parse(uni.getStorageSync('kw')||'[]')
		}
	}
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}

.sugg-list {
  padding: 0 5px;

  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
// 美化搜索区域列表的样式
.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
