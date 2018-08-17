/* eslint-disable */
const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
const baseFontSize = 28
const baseWidth = 750
const baseRem = (htmlWidth/750)*28
const lineOption = {
    title: {
        text: "阅读时长统计",
        x: 'center',
        textStyle: {
            fontSize: Math.round(baseRem*1.25),
            color: '#444',
            fontFamily: 'PingFangSC-Regular'
        }
    },
    grid: {
        x: 10,
        y: 80,
        borderColor: "rgba(0,0,0,0)",
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: 1,
            interval: 0,
            data: [],
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: Math.round(baseRem),
                padding: [Math.round(baseRem*0.7), 0, 0, 0],
                color: "#b6dffa",
                interval: 0,
            }
        }
    ],
    yAxis: {
        type: 'value',
        splitNumber: 5,
        max: 100,
        min: 0,
        name: '时长 / 分钟',
        splitNumber: 5,
        nameTextStyle: {
            fontWeight: "lighter",
            fontSize: Math.round(baseRem),
            color: '#b6dffa',
            padding: [0, 0, 0, Math.round(baseRem*2)]
        },
        nameGap: 20,
        splitLine: {
            lineStyle: {
                width: 1
            }
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            fontSize: Math.round(baseRem),
            padding: [0, 10, 0, 0],
            color: "#b6dffa"
        }
    },
    series: [
        {
            name: "阅读时长统计",
            type: "line",
            data: [],
            smooth: true,
            smoothMonotone: "x",
            symbolSize: 10,
            itemStyle: {
                normal: {
                    color: "#fff",
                    borderColor: "#85d2ff",
                    borderWidth: 2,
                    shadowColor: "rgba(133, 210, 255, 0.35)",
                    shadowBlur: 3
                }
            },
            lineStyle: {
                normal: {
                    width: 3,
                    color: "#85d2ff"
                },
                emphasis: {
                    label: {
                        show: true
                    }
                }
            },
            label: {
                normal: {
                    show: true,
                    position: "top",
                    color: '#85d2ff',
                    fontSize: Math.round(baseRem)
                }
            }
        }
    ]
}
const pieOption = {
    title: {
        text: "阅读百科分布",
        textStyle: {
            fontSize: Math.round(baseRem*1.25),
            color: '#444'
        },
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    color: ['#97d4c4', '#91c3e0', '#c3b1ec', '#f0ce90', '#f8e9a2', '#eaa6a6'],
    legend: {
        orient: 'vertical',
        top: 'middle',
        right: '5%',
        itemGap: Math.round(baseRem*1.05),
        itemWidth: Math.round(baseRem*1.4),
        itemHeight: Math.round(baseRem*1.4),
        selectedMode: false,
        borderRadius: 0,
        formatter: function (name, value) {
            return name;
        }
    },
    series: [
        {
            name:'阅读百科分布',
            type:'pie',
            radius: ['25%', '45%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            silent: true, // 不响应鼠标事件
            label: {
                normal: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 3,
                    borderColor: '#fff'
                },
                emphasis: {

                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
}
export { lineOption, pieOption } 