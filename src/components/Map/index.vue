<template>
    <div ref="chart" class="divStyle"></div>
</template>

<script>
import theme from "@/assets/theme";

export default {
    name: "Map",
    data() {
        return {
            x_data: JSON.parse(sessionStorage.getItem('provinces')),
            y_data: JSON.parse(sessionStorage.getItem('avgs')),
            data: []
        }
    },
    created() {

    },
    mounted() {
        this.getData()
        this.setCharts()
    },
    methods: {
        getData(){
            for (let i = 0; i < this.x_data.length; i++) {
                const d = {};
                d.name = this.x_data[i]
                d.value = this.y_data[i]
                this.data.push(d)
            }
        },
        setCharts() {
            const chart = this.$echarts.init(this.$refs.chart, theme);
            var option = {
                title: {  //标题样式
                    text: '中国地图',
                    x: "center",
                    textStyle: {
                        fontSize: 18,
                        color: "black"
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        if (params.name) {
                            return params.name + ' : ' + (isNaN(params.value) ? 0 : parseInt(params.value));
                        }
                    },
                },
                visualMap: {//视觉映射组件
                    top: 'bottom',
                    left: 'left',
                    min: 50,
                    max: 100,
                    text: ['High', 'Low'],
                    realtime: false,  //拖拽时，是否实时更新
                    calculable: true,  //是否显示拖拽用的手柄
                    // inRange: {
                    //     color: ['lightskyblue', 'yellow', 'orangered']
                    // }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                series: [
                    {
                        name: '模拟数据',
                        type: 'map',
                        map: 'china',
                        roam: true,//是否开启鼠标缩放和平移漫游
                        label: {
                            show: true,
                            position: 'inside',
                            color: 'black'
                        },
                        emphasis: {//是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
                            label: {
                                show: true,
                                position: 'inside',
                                color: 'black'
                            }
                        },
                        top: "10%",//组件距离容器的距离
                        data: this.data
                    }
                ]
            };
            chart.setOption(option)
        }
    }
}
</script>

<style scoped>
.divStyle{
    width: 100%;
    height: 100%;
    border:1px solid;
    border-radius: 5px;
}
</style>