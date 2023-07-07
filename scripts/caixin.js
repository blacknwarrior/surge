/******************************************
@Zoo
财新解锁财新v2文章
日期:2023.06.22
[rewrite_local]
^https?:\/\/gateway\.caixin\.com\/api\/app\-api\/auth\/(validate|validateAudioAuth|groupImageValidate) url script-request-header https://raw.githubusercontent.com/Crazy-Z7/Script/main/caixin.js
hostname = gateway.caixin.com
*******************************************/

/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
*/
// #region 固定头部
let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            //为了兼容qx中fetch的写法,所以永不reject
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
// #endregion
/*
具体配置可见
https://github.com/sazs34/TaskConfig#%E5%A4%A9%E6%B0%94
 */

function _0x16a4(_0x5a5215,_0xe6beba){const _0x3a1408=_0x1913();return _0x16a4=function(_0x53cbfc,_0x2a19b6){_0x53cbfc=_0x53cbfc-(0x14f0+-0x843+-0x95*0x15);let _0x501a74=_0x3a1408[_0x53cbfc];return _0x501a74;},_0x16a4(_0x5a5215,_0xe6beba);}const _0x28ca1d=_0x16a4;function _0x1913(){const _0x46925f=['a8bad013f6','e9db1e1c32','f5f2393c4f','123630qUkkLi','56sHTbWK','169616FNawMB','url','1902904vyJXTN','21588qGiGcz','e275688','257826XPczMR','replace','device=b04','21XPGlII','542388dTTJvd','3267621WtQldy'];_0x1913=function(){return _0x46925f;};return _0x1913();}(function(_0x16a3c8,_0x298de5){const _0x1d4b0c=_0x16a4,_0x51f91f=_0x16a3c8();while(!![]){try{const _0x3bafda=parseInt(_0x1d4b0c(0x74))/(0x28c+-0x7c7+0x53c)+parseInt(_0x1d4b0c(0x83))/(0x84d+0xcf0+-0x153b)*(-parseInt(_0x1d4b0c(0x77))/(-0x7*-0x1b9+0x1074+-0x1*0x1c80))+parseInt(_0x1d4b0c(0x7d))/(0x1c4b+0x185a+-0x34a1)+parseInt(_0x1d4b0c(0x82))/(0x3*-0x1+-0x105*-0x1+-0xfd*0x1)+parseInt(_0x1d4b0c(0x79))/(0x1*0x1b2d+0x3*-0x7b5+-0x408)*(-parseInt(_0x1d4b0c(0x7c))/(0x1b5f+0x6d3+0x1*-0x222b))+-parseInt(_0x1d4b0c(0x76))/(0x26fe+0x228e+0x2*-0x24c2)+parseInt(_0x1d4b0c(0x7e))/(0x8e2+0x2672+0x1*-0x2f4b);if(_0x3bafda===_0x298de5)break;else _0x51f91f['push'](_0x51f91f['shift']());}catch(_0x2626b7){_0x51f91f['push'](_0x51f91f['shift']());}}}(_0x1913,-0x34495+-0x19076+0x6bc53));const Caixin=$request[_0x28ca1d(0x75)][_0x28ca1d(0x7a)](/device=(\w+|)/g,_0x28ca1d(0x7b)+_0x28ca1d(0x7f)+_0x28ca1d(0x81)+_0x28ca1d(0x80)+_0x28ca1d(0x78));$done({'url':Caixin});


