<template>
    <div class="level-dividend-page">
        <navBar :url="'levelDividend'" />

        <main class="level-dividend-content">
            <div class="hero-visual" aria-hidden="true">
                <img src="@img/levelDividend1.png" alt="" class="hero-image">
                <div class="hero-fade"></div>
            </div>
            <div class="header-surface" aria-hidden="true"></div>
            <div class="header-line" aria-hidden="true"></div>

            <section class="level-dividend-heading">
                <div class="heading-title df-aic-jucen">
                    <img src="@img/finance1.png" alt="" class="heading-decoration heading-decoration-left">
                    <h1>{{ $t('等级分红池') }}</h1>
                    <img src="@img/finance2.png" alt="" class="heading-decoration heading-decoration-right">
                </div>
                <p>{{ $t('参与等级晋升，按等级权益共享平台成长收益') }}</p>
            </section>

            <section class="self-dividend-card">
                <img src="@img/levelDividend2.png" alt="" class="self-dividend-background">
                <div class="self-dividend-value">
                    <span class="amount">{{ formatAmount(levelDividendInfo.self_dividend) }}</span>
                    <span class="token">SHINE</span>
                </div>
                <p>{{ $t('自己当前已分红') }}</p>
            </section>

            <section class="level-list">
                <article
                    v-for="item in levelDividendInfo.levels"
                    :key="item.level"
                    class="level-card"
                >
                    <img :src="item.background" alt="" class="level-card-background">
                    <img :src="item.icon" alt="" class="level-icon">

                    <div class="level-stats">
                        <div class="level-stat">
                            <div class="level-value">
                                <span class="amount">{{ formatAmount(item.total_pool) }}</span>
                                <span class="token">shine</span>
                            </div>
                            <p>{{ $t('累计分红池金额') }}</p>
                        </div>

                        <img src="@img/dividend5.png" alt="" class="level-divider">

                        <div class="level-stat">
                            <div class="level-value">
                                <span class="amount">{{ formatAmount(item.pending_pool) }}</span>
                                <span class="token">shine</span>
                            </div>
                            <p>{{ $t('待分红金额') }}</p>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    </div>
</template>

<script>
const LEVEL_CARD_CONFIG = [
    {
        level: 'L6',
        icon: require('@img/L6.png'),
        background: require('@img/levelDividend3.png'),
    },
    {
        level: 'L7',
        icon: require('@img/L7.png'),
        background: require('@img/levelDividend4.png'),
    },
    {
        level: 'L8',
        icon: require('@img/L8.png'),
        background: require('@img/levelDividend3.png'),
    },
    {
        level: 'L9',
        icon: require('@img/L9.png'),
        background: require('@img/levelDividend4.png'),
    },
]

function createLevelList() {
    return LEVEL_CARD_CONFIG.map(item => ({
        ...item,
        total_pool: '0',
        pending_pool: '0',
    }))
}

function pickValue(source, keys) {
    if (!source || typeof source !== 'object') return ''

    for (const key of keys) {
        if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
            return source[key]
        }
    }

    return ''
}

export default {
    name: 'levelDividend',
    data() {
        return {
            levelDividendInfo: {
                self_dividend: '0',
                levels: createLevelList(),
            },
        }
    },
    mounted() {
        this.loadLevelDividend()
    },
    methods: {
        loadLevelDividend() {
            this.$http.get('/api/report/level_dividend').then((res) => {
                if (res.code == 200) {
                    this.levelDividendInfo = this.normalizeLevelDividend(res.data || {})
                }
            }).catch((err) => {
                console.log('等级分红金额获取失败', err)
            })
        },
        normalizeLevelDividend(data) {
            const levelCollection = data.levels || data.level_list || data.level_dividends || data.items
            const selfDividend = pickValue(data, [
                'self_dividend',
                'selfDividend',
                'current_dividend',
                'currentDividend',
                'my_dividend',
                'myDividend',
                'user_dividend',
                'userDividend',
            ]) || '0'

            const levels = LEVEL_CARD_CONFIG.map((config) => {
                const levelNumber = config.level.replace('L', '')
                const levelData = this.findLevelData(data, levelCollection, config.level, levelNumber)

                return {
                    ...config,
                    total_pool: pickValue(levelData, [
                        'total_pool',
                        'totalPool',
                        'cumulative_pool',
                        'cumulativePool',
                    ]) || '0',
                    pending_pool: pickValue(levelData, [
                        'pending_pool',
                        'pendingPool',
                        'wait_pool',
                        'waitPool',
                    ]) || '0',
                }
            })

            return {
                self_dividend: selfDividend,
                levels,
            }
        },
        findLevelData(data, levelCollection, level, levelNumber) {
            if (Array.isArray(levelCollection)) {
                const found = levelCollection.find((item) => {
                    const value = pickValue(item, ['level', 'level_no', 'levelNo', 'rank', 'name'])
                    return String(value).toUpperCase().replace('L', '') === levelNumber
                })
                if (found) return found
            }

            if (levelCollection && typeof levelCollection === 'object' && !Array.isArray(levelCollection)) {
                const collectionValue = levelCollection[level] || levelCollection[level.toLowerCase()] || levelCollection[levelNumber]
                if (collectionValue) return collectionValue
            }

            return data[level]
                || data[level.toLowerCase()]
                || data[levelNumber]
                || data[`level_${levelNumber}`]
                || data[`level${levelNumber}`]
                || {}
        },
        formatAmount(value) {
            if (value === undefined || value === null || value === '') return '0'
            return String(value)
        },
    },
}
</script>

<style lang="less" scoped>
.level-dividend-page {
    min-height: 2012px;
    overflow-x: hidden;
    background: #000;
}

.level-dividend-content {
    position: relative;
    min-height: 2012px;
    margin-top: -90px;
    overflow: hidden;
    background: #000;
}

.hero-visual,
.header-surface,
.header-line,
.level-dividend-heading,
.self-dividend-card,
.level-list {
    position: absolute;
}

.hero-visual {
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 800px;
    overflow: hidden;

    .hero-image {
        position: absolute;
        top: -7.82%;
        left: 0;
        width: 100%;
        height: 800px;
        max-width: none;
    }

    .hero-fade {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, #000 100%);
    }
}

.header-surface {
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 128px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.header-line {
    top: 128px;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
}

.level-dividend-heading {
    top: 558px;
    left: 0;
    z-index: 3;
    width: 100%;
    text-align: center;

    .heading-title {
        gap: 10px;

        .heading-decoration {
            width: 47px;
            height: 48px;
            flex: 0 0 47px;
        }

        h1 {
            margin: 0;
            font-size: 48px;
            font-weight: 500;
            line-height: 48px;
            background: linear-gradient(180deg, #ffdeb3 0%, #efb152 100%);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
        }
    }

    p {
        margin: 20px 0 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 24px;
        line-height: normal;
    }
}

.self-dividend-card {
    top: 680px;
    left: 30px;
    z-index: 3;
    width: 690px;
    height: 298px;

    .self-dividend-background {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    .self-dividend-value {
        position: absolute;
        top: 130px;
        left: 42px;
        display: flex;
        width: 606px;
        align-items: baseline;
        justify-content: center;
        gap: 10px;
        color: #fff;
        font-family: Poppins, Arial, sans-serif;
        font-weight: 600;
        text-align: center;

        .amount {
            font-size: 48px;
            line-height: normal;
            background: linear-gradient(180deg, #ffdeb3 0%, #efb152 100%);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
        }

        .token {
            font-size: 24px;
            line-height: normal;
            background: linear-gradient(180deg, #ffdeb3 0%, #efb152 100%);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            text-transform: uppercase;
        }
    }

    p {
        position: absolute;
        top: 204px;
        left: 0;
        width: 100%;
        margin: 0;
        color: #f4be6f;
        font-family: Poppins, Arial, sans-serif;
        font-size: 24px;
        line-height: normal;
        text-align: center;
    }
}

.level-list {
    top: 1008px;
    left: 30px;
    z-index: 3;
    display: flex;
    width: 690px;
    flex-direction: column;
    gap: 20px;
}

.level-card {
    position: relative;
    width: 690px;
    height: 226px;
    flex: 0 0 226px;

    .level-card-background {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    .level-icon {
        position: absolute;
        top: 32px;
        left: 50%;
        width: 40px;
        height: 28px;
        transform: translateX(-50%);
    }

    .level-stats {
        position: absolute;
        top: 95px;
        left: 31px;
        display: grid;
        width: 631px;
        grid-template-columns: 305px 1px 305px;
        column-gap: 10px;
        align-items: start;
    }

    .level-stat {
        width: 305px;
        text-align: center;

        .level-value {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 10px;
            color: #fff;
            font-family: Poppins, Arial, sans-serif;
            font-weight: 600;

            .amount {
                font-size: 34px;
                line-height: normal;
            }

            .token {
                font-size: 22px;
                line-height: normal;
            }
        }

        p {
            margin: 12px 0 0;
            color: rgba(255, 255, 255, 0.5);
            font-family: Poppins, "PingFang SC", sans-serif;
            font-size: 24px;
            line-height: normal;
        }
    }

    .level-divider {
        width: 1px;
        height: 100px;
        margin-top: 18px;
    }
}
</style>
