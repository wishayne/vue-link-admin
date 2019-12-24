// 自定义数据

var data = {
    //部分icon的图
    icon_img: 'http://pic.c-ctrip.com/platform/online/home/un_header_footer20160610.png',
    //部分icon的图标2 (主要是飞机图标.房子图标...)
    small_img: 'http://pic.c-ctrip.com/platform/online/home/un_icon_index_type20170111.png',

    //机票模块(下方)
    ticket_data: {
		top_nav: ['国际特价机票','国内特价机票'],
		inner_nav: ['热门往返','亚洲','欧洲','美洲','非洲'],
		inner_nav_more: '国际特价机票',
        store_list: [
            {
                from: '深圳',
                to: '新加坡',
                date: '8月29日 - 9月05日',
                price: '200'
            },
            {
                from: '深圳',
                to: '新加坡',
                date: '9月01日 - 9月05日',
                price: '237'
            },
            {
                from: '深圳',
                to: '吉隆坡',
                date: '8月27日 - 9月01日',
                price: '250'
            },
            {
                from: '深圳',
                to: '吉隆坡',
                date: '8月27日 - 9月02日',
                price: '250'
            },
            {
                from: '深圳',
                to: '曼谷',
                date: '9月03日 - 9月06日',
                price: '591'
            },
            {
                from: '深圳',
                to: '大阪',
                date: '9月10日 - 9月17日',
                price: '668'
            },
            {
                from: '深圳',
                to: '悉尼',
                date: '8月26日 - 8月31日',
                price: '680'
            },
            {
                from: '深圳',
                to: '首尔',
                date: '9月02日 - 9月06日',
                price: '700'
            },
            {
                from: '深圳',
                to: '台北',
                date: '9月04日 - 9月07日',
                price: '777'
            },
            {
                from: '深圳',
                to: '胡志明市',
                date: '8月21日 - 8月23日',
                price: '810'
            },
            {
                from: '深圳',
                to: '洛杉矶',
                date: '8月24日 - 8月29日',
                price: '980'
            },
            {
                from: '深圳',
                to: '东京',
                date: '9月12日 - 9月18日',
                price: '1108'
            },

        ],
		store_ad: {
        	img_url: 'http://images4.c-ctrip.com/target/600o0a0000004myhpA98E.jpg',
        }

	},
// 全球购模块
    global_data: {
        top_nav: ['全球购'],
        inner_sidebar: {
            title: '热门目的地',
            list: ['香港','日本','法国','澳门','英国','泰国','新加坡','美国','西班牙','台北','澳大利亚','意大利','阿联酋']
        },
        inner_nav: ['热门商户','精品百货','奢品大牌','口碑推荐','新店首选'],
        inner_nav_more: '全球名店',
        store_list: [
            {
                img_url: 'https://images4.c-ctrip.com/target/zd090i00000098v3j1D2B_C_570_285.jpg',
                name: 'DFS旗下T广场（香港广东道店） DFS T Galleria（Hong Kong Canton Road）',
                seat: '中国·香港',
                tag_name: '返现'
            },
            {
                img_url: 'https://images4.c-ctrip.com/target/zd0g0c000000650nk8A26_C_570_285.jpg',
                name: '迪拜国际机场T3航站楼A出发区（综合购物区店） Concourse A（Dubai Duty Free Shopping Complex Panshot）',
                seat: '阿联酋·迪拜',
                tag_name: '促销'
            },
            {
                img_url: 'https://images4.c-ctrip.com/target/fd/finvendor/g5/M00/E3/D6/CggYsVcUPqyAetjkAAH7z1YbtQ4810_C_570_285.jpg',
                name: '高岛屋（大阪店） Takashimaya Osaka Store',
                seat: '日本·大阪',
                tag_name: '返现'
            },
            {
                img_url: 'https://images4.c-ctrip.com/target/zd0c0800000039r9xB9C1_C_570_285.jpg',
                name: '松屋（银座本店） MATSUYA（GINZA）',
                seat: '日本·东京',
                tag_name: '促销'
            },

        ]


    },
    ///////////////////////////////
    ///////////////////////////////


    //服务模式
    sp_data: {
        //remind 顶级领域和次级领域的搜索路径有没有区分？
        base_url: "requestURL/",
		top_nav: ['服务模式', '交通出行', '健康医疗', '生活缴费'],
		inner_sidebar: {
            title: ' ',
            list: ['健康养老', '家庭急救']
        },
        inner_nav_more: '服务模式',
        sp_list: [
        	{
                url: 'http://images3.c-ctrip.com/overseas/city/singapore256-256.jpg',
                name: '医疗',
                desc: '522'
            },
            {
                url: 'http://images3.c-ctrip.com/overseas/city/bangkok256-256.jpg',
                name: '养老',
                desc: '2931'
            },
            {
                url: 'http://images3.c-ctrip.com/overseas/city/tokyo256-256.jpg',
                name: '急救',
                desc: '2497'
            },
            {
                url: 'http://images3.c-ctrip.com/overseas/city/kualalumpur256-256.jpg',
                name: '交通出行',
                desc: '2300'
            },
            {
                url: 'http://images3.c-ctrip.com/overseas/city/osaka256-256.jpg',
                name: '租车',
                desc: '44'
            }
        ]
	},

    //服务方案
    solution_data: {
        //remind 顶级领域和次级领域的搜索路径有没有区分？
        base_url: "requestURL/",
		top_nav: ['服务方案', '交通出行', '健康医疗', '生活缴费'],
		inner_sidebar: {
            title: ' ',
            list: ['健康养老', '家庭急救']
        },
        inner_nav_more: '服务方案',
        solution_list: [
        	{
                url: 'http://images3.c-ctrip.com/overseas/city/singapore256-256.jpg',
                name: '医疗',
                desc: '522'
            },
            {
                url: 'http://images3.c-ctrip.com/overseas/city/bangkok256-256.jpg',
                name: '养老',
                desc: '2931'
            },
            {
                url: 'http://images3.c-ctrip.com/overseas/city/tokyo256-256.jpg',
                name: '急救',
                desc: '2497'
            },
            {
                url: 'http://images3.c-ctrip.com/overseas/city/kualalumpur256-256.jpg',
                name: '交通出行',
                desc: '2300'
            },
            {
                url: 'http://images3.c-ctrip.com/overseas/city/osaka256-256.jpg',
                name: '租车',
                desc: '44'
            }
        ]
	},

	//已有服务
    service_data: {
        //remind 顶级领域和次级领域的搜索路径有没有区分？
        base_url: "requestURL/",
		top_nav: ['热点服务','交通出行', '健康医疗', '租房购房'],
        inner_sidebar: {
            title: ' ',
            list: ['租车', '代驾', '旅游', '餐饮']
        },
		inner_nav_more: '服务',
        service_list: [
            {
                name: '外卖',
                type: '线下服务',
            },
            {
                name: '120急救',
                type: 'UI服务',
            },
            {
                name: '天气查询',
                type: 'API服务',
            },
            {
                name: '火警',
                type: 'UI服务',
            },
            {
                name: '跑腿购',
                type: '线下服务',
            },
            {
                name: '家庭打扫',
                type: '线下服务',
            },
            {
                name: '送药上门',
                type: '线下服务',
            },
            {
                name: '搬家服务',
                type: '线下服务',
            },
            {
                name: '在线解答',
                type: 'UI服务',
            }
        ],
		store_ad: {
        	img_url: 'http://images4.c-ctrip.com/target/600o0a0000004myhpA98E.jpg',
        }

	},

    //需求模式
    //已有服务
    rp_data: {
        //remind 顶级领域和次级领域的搜索路径有没有区分？
        base_url: "requestURL/",
		top_nav: ['需求模式'],
        inner_sidebar: {
            title: ' ',
            list: ['']
        },
		inner_nav_more: '需求模式',
        rp_list: [
            {
                name: '定外卖'
            },
            {
                name: '旅行'
            }
        ]
	},
};

export default data;
