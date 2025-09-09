
let subConverter = 'sUBaPI.cMlIUSSSS.nET';
let subConfig = 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini';
let subProtocol = 'https';
let SUBUpdateTime = 6; // 单位小时
let proxyIP = 'proxyip.fxxk.dedyn.io:443';
let ips = ['3Q.bestip_one.cf.090227.xyz#感谢白嫖哥t.me/bestip_one'];
let FileName = 'BPSUB';
let EndPS = '';
const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;

export default {
    async fetch(request, env, ctx) {
        subConverter = env.SUBAPI || subConverter;
        if (subConverter.includes("http://")) {
            subConverter = subConverter.split("//")[1];
            subProtocol = 'http';
        } else {
            subConverter = subConverter.split("//")[1] || subConverter;
        }
        subConfig = env.SUBCONFIG || subConfig;
        proxyIP = env.PROXYIP || proxyIP;
        if (env.ADD) ips = await 整理成数组(env.ADD);
        FileName = env.SUBNAME || FileName;
        EndPS = env.PS || EndPS;

        const url = new URL(request.url);
        const UA = request.headers.get('User-Agent') || 'null';
        const userAgent = UA.toLowerCase();
        const 必须base64的UA = [('CF-Workers-SUB').toLowerCase(), 'subconverter'];
        if (url.pathname === '/sub') {
            const responseHeaders = {
                "content-type": "text/plain; charset=utf-8",
                "Profile-Update-Interval": `${SUBUpdateTime}`,
                "Profile-web-page-url": url.origin,
            };

            if (必须base64的UA.some(必须 => userAgent.includes(必须))) {
                let subConverterUrl = url.href;
                responseHeaders["Content-Disposition"] = `attachment; filename*=utf-8''${encodeURIComponent(FileName)}`;
                //console.log(subConverterUrl);
                if (userAgent.includes('sing-box') || userAgent.includes('singbox')) {
                    subConverterUrl = `${subProtocol}://${subConverter}/sub?target=clash&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
                } else if (userAgent.includes('clash') || userAgent.includes('meta') || userAgent.includes('mihomo')) {
                    subConverterUrl = `${subProtocol}://${subConverter}/sub?target=singbox&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
                } else {
                    subConverterUrl = `${subProtocol}://${subConverter}/sub?target=auto&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
                }

                try {
                    const subConverterResponse = await fetch(subConverterUrl);

                    if (!subConverterResponse.ok) {
                        throw new Error(`Error fetching subConverterUrl: ${subConverterResponse.status} ${subConverterResponse.statusText}`);
                    }

                    let subConverterContent = await subConverterResponse.text();

                    return new Response(subConverterContent, { status: 200, responseHeaders });
                } catch (error) {
                    return new Response(`Error: ${error.message}`, {
                        status: 500,
                        headers: { 'content-type': 'text/plain; charset=utf-8' },
                    });
                }
            }

            if (url.searchParams.has('ips') && url.searchParams.get('ips').trim() !== '') ips = await 整理成数组(url.searchParams.get('ips'));
            proxyIP = url.searchParams.get('ips') || proxyIP;
            const 标题 = `${url.hostname}:443#${FileName} 订阅到期时间 ${getDateString()}`;
            let add = [标题];
            let addapi = [];
            for (const ip of ips) {
                if (ip.startsWith('http') && ip.includes('://')) {
                    addapi.push(ip);
                } else {
                    add.push(ip);
                }
            }
            const uuid_json = await getSubData();

            const newAddapi = await 整理优选列表(addapi);
            // 将newAddapi数组添加到add数组,并对add数组去重
            add = [...new Set([...add, ...newAddapi])];

            const responseBody = add.map(address => {
                let port = "443";
                let addressid = address;

                const match = addressid.match(regex);
                if (!match) {
                    if (address.includes(':') && address.includes('#')) {
                        const parts = address.split(':');
                        address = parts[0];
                        const subParts = parts[1].split('#');
                        port = subParts[0];
                        addressid = subParts[1];
                    } else if (address.includes(':')) {
                        const parts = address.split(':');
                        address = parts[0];
                        port = parts[1];
                    } else if (address.includes('#')) {
                        const parts = address.split('#');
                        address = parts[0];
                        addressid = parts[1];
                    }

                    if (addressid.includes(':')) {
                        addressid = addressid.split(':')[0];
                    }
                } else {
                    address = match[1];
                    port = match[2] || port;
                    addressid = match[3] || address;
                }

                //console.log(address, port, addressid);
                let 节点备注 = EndPS;

                // 随机从 uuid_json 中抽取
                if (uuid_json.length > 0) {
                    const randomIndex = Math.floor(Math.random() * uuid_json.length);
                    const selected = uuid_json[randomIndex];
                    const uuid = selected.uuid;
                    const 伪装域名 = selected.host;
                    const 最终路径 = selected.path;
                    const 为烈士Link = 'vl' + 'es' + `s://${uuid}@${address}:${port}?security=tls&sni=${伪装域名}&type=ws&host=${伪装域名}&path=${encodeURIComponent(最终路径)}&allowInsecure=1&fragment=${encodeURIComponent('1,40-60,30-50,tlshello')}&encryption=none#${encodeURIComponent(addressid + 节点备注)}`;
                    return 为烈士Link;
                }
            }).join('\n');

            const 返回订阅内容 = userAgent.includes(('Mozilla/5.0').toLowerCase()) ? responseBody : btoa(responseBody);
            if (!userAgent.includes(('Mozilla/5.0').toLowerCase())) responseHeaders["Content-Disposition"] = `attachment; filename*=utf-8''${encodeURIComponent(FileName)}`;
            return new Response(返回订阅内容, {
                headers: { 'Content-Type': 'text/plain' },
            });
        } else if (url.pathname === '/uuid.json') {
            try {
                const result = await getSubData();
                return new Response(JSON.stringify(result, null, 2), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } else {
            return new Response('Hello World!');
        }
    }
};

async function getSubData() {
    function parseVless(vlessUrl) {
        try {
            const url = vlessUrl.substring(8);
            const [uuid, rest] = url.split('@');
            if (!uuid || !rest) return null;
            const queryStart = rest.indexOf('?');
            if (queryStart === -1) return null;
            const queryString = rest.substring(queryStart + 1).split('#')[0];
            const params = new URLSearchParams(queryString);
            const host = params.get('host');
            const path = `/snippets/ip=${encodeURIComponent(proxyIP)}?ed=2560`;
            if (!host) return null;
            return { uuid, host, path };
        } catch (error) {
            return null;
        }
    }
    const response = await fetch('https://cfxr.eu.org/getSub');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const lines = text.trim().split('\n');
    const result = [];

    for (const line of lines) {
        if (line.startsWith('vl' + 'es' + 's://')) {
            const parsed = parseVless(line);
            if (parsed) {
                result.push(parsed);
            }
        }
    }

    return result;
}

async function 整理成数组(内容) {
    // 将制表符、双引号、单引号和换行符都替换为逗号
    // 然后将连续的多个逗号替换为单个逗号
    var 替换后的内容 = 内容.replace(/[	"'\r\n]+/g, ',').replace(/,+/g, ',');

    // 删除开头和结尾的逗号（如果有的话）
    if (替换后的内容.charAt(0) == ',') 替换后的内容 = 替换后的内容.slice(1);
    if (替换后的内容.charAt(替换后的内容.length - 1) == ',') 替换后的内容 = 替换后的内容.slice(0, 替换后的内容.length - 1);

    // 使用逗号分割字符串，得到地址数组
    const 地址数组 = 替换后的内容.split(',');

    return 地址数组;
}

async function 整理优选列表(api) {
    if (!api || api.length === 0) return [];

    let newapi = "";

    // 创建一个AbortController对象，用于控制fetch请求的取消
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort(); // 取消所有请求
    }, 2000); // 2秒后触发

    try {
        // 使用Promise.allSettled等待所有API请求完成，无论成功或失败
        // 对api数组进行遍历，对每个API地址发起fetch请求
        const responses = await Promise.allSettled(api.map(apiUrl => fetch(apiUrl, {
            method: 'get',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;',
                'User-Agent': FileName + ' (https://github.com/cmliu/CF-Workers-BPSUB)'
            },
            signal: controller.signal // 将AbortController的信号量添加到fetch请求中，以便于需要时可以取消请求
        }).then(response => response.ok ? response.text() : Promise.reject())));

        // 遍历所有响应
        for (const [index, response] of responses.entries()) {
            // 检查响应状态是否为'fulfilled'，即请求成功完成
            if (response.status === 'fulfilled') {
                // 获取响应的内容
                const content = await response.value;

                const lines = content.split(/\r?\n/);
                let 节点备注 = '';
                let 测速端口 = '443';

                if (lines[0].split(',').length > 3) {
                    const idMatch = api[index].match(/id=([^&]*)/);
                    if (idMatch) 节点备注 = idMatch[1];

                    const portMatch = api[index].match(/port=([^&]*)/);
                    if (portMatch) 测速端口 = portMatch[1];

                    for (let i = 1; i < lines.length; i++) {
                        const columns = lines[i].split(',')[0];
                        if (columns) {
                            newapi += `${columns}:${测速端口}${节点备注 ? `#${节点备注}` : ''}\n`;
                            if (api[index].includes('proxyip=true')) proxyIPPool.push(`${columns}:${测速端口}`);
                        }
                    }
                } else {
                    // 验证当前apiUrl是否带有'proxyip=true'
                    if (api[index].includes('proxyip=true')) {
                        // 如果URL带有'proxyip=true'，则将内容添加到proxyIPPool
                        proxyIPPool = proxyIPPool.concat((await 整理(content)).map(item => {
                            const baseItem = item.split('#')[0] || item;
                            if (baseItem.includes(':')) {
                                const port = baseItem.split(':')[1];
                                if (!httpsPorts.includes(port)) {
                                    return baseItem;
                                }
                            } else {
                                return `${baseItem}:443`;
                            }
                            return null; // 不符合条件时返回 null
                        }).filter(Boolean)); // 过滤掉 null 值
                    }
                    // 将内容添加到newapi中
                    newapi += content + '\n';
                }
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        // 无论成功或失败，最后都清除设置的超时定时器
        clearTimeout(timeout);
    }

    const newAddressesapi = await 整理(newapi);

    // 返回处理后的结果
    return newAddressesapi;
}

function getDateString() {
    // 获取当前 UTC 时间
    const now = new Date();
    // 转换为 UTC+8
    const utc8Time = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    // 加 24 小时
    utc8Time.setTime(utc8Time.getTime() + (24 * 60 * 60 * 1000));
    // 格式化为 YYYY/MM/DD HH:MM:SS
    const year = utc8Time.getUTCFullYear();
    const month = String(utc8Time.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utc8Time.getUTCDate()).padStart(2, '0');
    const hours = String(utc8Time.getUTCHours()).padStart(2, '0');
    const minutes = String(utc8Time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(utc8Time.getUTCSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}