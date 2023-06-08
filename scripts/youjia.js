/**
 * 脚本转换器，自动转换QX，Loon，Surge格式脚本
 * @author: Peng-YM
 * 配置教程：https://github.com/Peng-YM/ScriptConverter
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/ScriptConverter/master/js-converter.js
 */

// 是否开启输出
const verbose = true;
const url = $request.url;
let body = $response.body;

if (body.indexOf('$httpClient') !== -1 && body.indexOf('$task') !== -1){
    // If already adapt for multi-platform, skip converting.
    $done({body});
} else {
    if (verbose) {
        console.log(`开始转换脚本： ${url}...`);
      }
      const pattern = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/;
      const converter = "\/******************** \u8F6C\u6362\u5668 ********************\/\r\nlet isQuantumultX=$task!=undefined;let isSurge=$httpClient!=undefined;let isLoon=isSurge&&typeof $loon!=undefined;var $task=isQuantumultX?$task:{};var $httpClient=isSurge?$httpClient:{};var $prefs=isQuantumultX?$prefs:{};var $persistentStore=isSurge?$persistentStore:{};var $notify=isQuantumultX?$notify:{};var $notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:\"\",};$httpClient={get:(url,cb)=>{var urlObj;if(typeof url==\"string\"){urlObj={url:url,}}else{urlObj=url}\r\n$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,\"\")})},post:(url,cb)=>{var urlObj;if(typeof url==\"string\"){urlObj={url:url,}}else{urlObj=url}\r\nurl.method=\"POST\";$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,\"\")})},}}\r\nif(isSurge){$task={fetch:(url)=>{return new Promise((resolve,reject)=>{if(url.method==\"POST\"){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}})},}}\r\nif(isQuantumultX){$persistentStore={read:(key)=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)},}}\r\nif(isSurge){$prefs={valueForKey:(key)=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)},}}\r\nif(isQuantumultX){$notify=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\\n\u70B9\u51FB\u94FE\u63A5\u8DF3\u8F6C: ${url}`;notify(title,subTitle,detail)}})($notify);$notification={post:(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\\n\u70B9\u51FB\u94FE\u63A5\u8DF3\u8F6C: ${url}`;$notify(title,subTitle,detail)},}}\r\nif(isSurge&&!isLoon){$notification.post=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\\n\u70B9\u51FB\u94FE\u63A5\u8DF3\u8F6C: ${url}`;notify.call($notification,title,subTitle,detail)}})($notification.post);$notify=(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\\n\u70B9\u51FB\u94FE\u63A5\u8DF3\u8F6C: ${url}`;$notification.post(title,subTitle,detail)}}\r\nif(isLoon){$notify=(title,subTitle,detail,url=undefined)=>{$notification.post(title,subTitle,detail,url)}}\r\n\/******************** \u8F6C\u6362\u5668 ********************\/";

      let header = body.match(pattern)[0] + '\n\n' + converter;
      const converted = body.replace(pattern, header);
      
      $done({body: converted});
      if (verbose) {
          console.log("转换成功");
      }
}

var region = "shanxi-3/xian";

const loondq = $persistentStore.read("地区");

if (loondq !== undefined) {
  region = loondq;
}

const query_addr = `http://m.qiyoujiage.com/${region}.shtml`;

$httpClient.get(
  {
    url: query_addr,
    headers: {
      referer: "http://m.qiyoujiage.com/",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
  },
  (error, response, data) => {
    if (error) {
      console.log(`解析油价信息失败, URL=${query_addr}`);
      done({});
    } else {
      const reg_price =
        /<dl>[\s\S]+?<dt>(.*油)<\/dt>[\s\S]+?<dd>(.*)\(元\)<\/dd>/gm;

      var prices = [];
      var m = null;

      while ((m = reg_price.exec(data)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === reg_price.lastIndex) {
          reg_price.lastIndex++;
        }

        prices.push({
          name: m[1],
          value: `${m[2]} 元/L`,
        });
      }

      // 解析油价调整趋势
      var adjust_date = "";
      var adjust_trend = "";
      var adjust_value = "";

      const reg_adjust_tips =
        /<div class="tishi"> <span>(.*)<\/span><br\/>([\s\S]+?)<br\/>/;
      const adjust_tips_match = data.match(reg_adjust_tips);

      if (adjust_tips_match && adjust_tips_match.length === 3) {
        adjust_date = adjust_tips_match[1].split("价")[1].slice(0, -2);

        adjust_value = adjust_tips_match[2];
        adjust_trend =
          adjust_value.indexOf("下调") > -1 || adjust_value.indexOf("下跌") > -1
            ? "↓"
            : "↑";

        const adjust_value_re = /([\d\.]+)元\/升-([\d\.]+)元\/升/;
        const adjust_value_re2 = /[\d\.]+元\/吨/;
        const adjust_value_match = adjust_value.match(adjust_value_re);

        if (adjust_value_match && adjust_value_match.length === 3) {
          adjust_value = `${adjust_value_match[1]}-${adjust_value_match[2]}元/L`;
        } else {
          const adjust_value_match2 = adjust_value.match(adjust_value_re2);

          if (adjust_value_match2) {
            adjust_value = adjust_value_match2[0];
          }
        }
      }

      const friendly_tips = `${adjust_date} ${adjust_trend} ${adjust_value}`;

      if (prices.length !== 4) {
        console.log( `解析油价信息失败, 数量=${prices.length},  URL=${query_addr}`);
        done();
      } else {
        $done($notification.post("实时油价信息", `${friendly_tips}`, `${prices[0].name}  ${prices[0].value}\n${prices[1].name}  ${prices[1].value}\n${prices[2].name}  ${prices[2].value}\n${prices[3].name}  ${prices[3].value}`, "https://google.com"));
      }
    }
  }
);
