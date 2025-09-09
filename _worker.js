
let subConverter = 'sUBaPI.cMlIUSSSS.nET';
let subConfig = 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini';
let subProtocol = 'https';
let SUBUpdateTime = 6; // 单位小时
let proxyIP = 'proxyip.fxxk.dedyn.io:443';
let ips = ['3Q.bestip-one.cf.090227.xyz#感谢白嫖哥t.me/bestip_one'];
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
        const 需要订阅转换的UA = ['clash', 'meta', 'mihomo', 'sing-box', 'singbox'];
        // 检查是否来自订阅转换后端的请求
        const isSubConverterRequest = request.headers.get('subconverter-request') ||
            request.headers.get('subconverter-version') ||
            userAgent.includes('subconverter');

        if (url.pathname === '/sub') {
            const responseHeaders = {
                "content-type": "text/plain; charset=utf-8",
                "Profile-Update-Interval": `${SUBUpdateTime}`,
                "Profile-web-page-url": url.origin,
            };

            if (需要订阅转换的UA.some(ua => userAgent.includes(ua)) &&
                !userAgent.includes(('CF-Workers-SUB').toLowerCase()) &&
                !isSubConverterRequest) {
                subConverter = url.searchParams.get('subapi') || subConverter;
                if (subConverter.includes("http://")) {
                    subConverter = subConverter.split("//")[1];
                    subProtocol = 'http';
                } else {
                    subConverter = subConverter.split("//")[1] || subConverter;
                }
                subConfig = url.searchParams.get('subconfig') || subConfig;

                let subConverterUrl = url.href;
                responseHeaders["Content-Disposition"] = `attachment; filename*=utf-8''${encodeURIComponent(FileName)}`;
                //console.log(subConverterUrl);
                if (userAgent.includes('sing-box') || userAgent.includes('singbox')) {
                    subConverterUrl = `${subProtocol}://${subConverter}/sub?target=singbox&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
                } else if (userAgent.includes('clash') || userAgent.includes('meta') || userAgent.includes('mihomo')) {
                    subConverterUrl = `${subProtocol}://${subConverter}/sub?target=clash&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
                } else {
                    subConverterUrl = `${subProtocol}://${subConverter}/sub?target=auto&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
                }

                try {
                    const subConverterResponse = await fetch(subConverterUrl, { headers: { 'User-Agent': UA } });

                    if (!subConverterResponse.ok) {
                        const errorDetails = {
                            error: "SubConverter请求失败",
                            message: `订阅转换服务返回错误状态`,
                            details: {
                                status: subConverterResponse.status,
                                statusText: subConverterResponse.statusText,
                                url: subConverterUrl,
                                headers: Object.fromEntries(subConverterResponse.headers.entries()),
                                timestamp: new Date().toISOString()
                            }
                        };

                        // 尝试获取错误响应内容
                        try {
                            const errorText = await subConverterResponse.text();
                            if (errorText) {
                                errorDetails.details.responseBody = errorText.substring(0, 1000); // 限制长度
                            }
                        } catch (textError) {
                            errorDetails.details.responseBodyError = textError.message;
                        }

                        return new Response(JSON.stringify(errorDetails, null, 2), {
                            status: subConverterResponse.status,
                            headers: { 'content-type': 'application/json; charset=utf-8' },
                        });
                    }

                    let subConverterContent = await subConverterResponse.text();

                    return new Response(subConverterContent, { status: 200, headers: responseHeaders });
                } catch (error) {
                    const errorDetails = {
                        error: "SubConverter连接异常",
                        message: `无法连接到订阅转换服务或处理响应时发生错误`,
                        details: {
                            errorType: error.name || 'UnknownError',
                            errorMessage: error.message,
                            url: subConverterUrl,
                            userAgent: UA,
                            timestamp: new Date().toISOString(),
                            stack: error.stack ? error.stack.substring(0, 500) : undefined
                        }
                    };

                    return new Response(JSON.stringify(errorDetails, null, 2), {
                        status: 500,
                        headers: { 'content-type': 'application/json; charset=utf-8' },
                    });
                }
            }

            if (url.searchParams.has('ips') && url.searchParams.get('ips').trim() !== '') ips = await 整理成数组(url.searchParams.get('ips'));
            proxyIP = url.searchParams.get('proxyip') || proxyIP;
            const socks5 = (url.searchParams.has('socks5') && url.searchParams.get('socks5') != '') ? url.searchParams.get('socks5') : null;
            const 全局socks5 = (url.searchParams.has('global')) ? true : false;
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
                        // 找到第一个冒号和第一个井号的位置
                        const colonIndex = address.indexOf(':');
                        const hashIndex = address.indexOf('#');
                        
                        const originalAddress = address;
                        address = originalAddress.substring(0, colonIndex);
                        port = originalAddress.substring(colonIndex + 1, hashIndex);
                        addressid = originalAddress.substring(hashIndex + 1);
                    } else if (address.includes(':')) {
                        const parts = address.split(':');
                        address = parts[0];
                        port = parts[1];
                    } else if (address.includes('#')) {
                        const parts = address.split('#');
                        address = parts[0];
                        addressid = parts[1];
                    }

                    // 只有当 addressid 看起来像 "address:port" 格式时才进行分割
                    // 避免截断包含时间的标题（如 "05:05:07"）
                    if (addressid.includes(':') && /^\S+:\d+$/.test(addressid)) {
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
                    const 最终路径 = socks5 ? (全局socks5 ? `/snippets/gs5=${socks5}?ed=2560` : `/snippets/s5=${socks5}?ed=2560`) : `/snippets/ip=${proxyIP}?ed=2560`;
                    const 为烈士Link = 'vl' + 'es' + `s://${uuid}@${address}:${port}?security=tls&sni=${伪装域名}&type=ws&host=${伪装域名}&path=${encodeURIComponent(最终路径)}&allowInsecure=1&fragment=${encodeURIComponent('1,40-60,30-50,tlshello')}&encryption=none#${encodeURIComponent(addressid + 节点备注)}`;
                    return 为烈士Link;
                }
            }).join('\n');
            function encodeBase64(data) {
                const binary = new TextEncoder().encode(data);
                let base64 = '';
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

                for (let i = 0; i < binary.length; i += 3) {
                    const byte1 = binary[i];
                    const byte2 = binary[i + 1] || 0;
                    const byte3 = binary[i + 2] || 0;

                    base64 += chars[byte1 >> 2];
                    base64 += chars[((byte1 & 3) << 4) | (byte2 >> 4)];
                    base64 += chars[((byte2 & 15) << 2) | (byte3 >> 6)];
                    base64 += chars[byte3 & 63];
                }

                const padding = 3 - (binary.length % 3 || 3);
                return base64.slice(0, base64.length - padding) + '=='.slice(0, padding);
            }
            const 返回订阅内容 = userAgent.includes(('Mozilla').toLowerCase()) ? responseBody : encodeBase64(responseBody);

            if (!userAgent.includes(('Mozilla').toLowerCase())) responseHeaders["Content-Disposition"] = `attachment; filename*=utf-8''${encodeURIComponent(FileName)}`;
            return new Response(返回订阅内容, { headers: responseHeaders });
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
            return await subHtml(request);
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
            //const path = `/snippets/ip=${encodeURIComponent(proxyIP)}?ed=2560`;
            if (!host) return null;
            return { uuid, host };
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
    var 替换后的内容 = 内容.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');

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
                        }
                    }
                } else {
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

    const newAddressesapi = await 整理成数组(newapi);

    // 返回处理后的结果
    return newAddressesapi;
}

function getDateString() {
    // 获取当前 UTC 时间
    const now = new Date();
    // 转换为 UTC+8
    const utc8Time = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    // 加 24 小时
    utc8Time.setTime(utc8Time.getTime() + (24 * 60 * 60 * 1000 * 30));// 30天有效期
    // 格式化为 YYYY/MM/DD HH:MM:SS
    const year = utc8Time.getUTCFullYear();
    const month = String(utc8Time.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utc8Time.getUTCDate()).padStart(2, '0');
    const hours = String(utc8Time.getUTCHours()).padStart(2, '0');
    const minutes = String(utc8Time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(utc8Time.getUTCSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

async function subHtml(request) {
    const url = new URL(request.url);

    const HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BPSUB 订阅生成器</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@keeex/qrcodejs-kx@1.0.2/qrcode.min.js"></script>
    <style>
        :root {
            --primary-color: #00ffff;
            --text-primary: #ffffff;
            --text-secondary: #e2e8f0;
            --bg-secondary: rgba(45, 55, 72, 0.8);
            --border-radius-sm: 12px;
            --warning-color: #ffc107;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e  70%, #0f3460 100%);
            min-height: 100vh;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 255, 157, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(138, 43, 226, 0.1) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(26, 32, 44, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            box-shadow: 
                0 25px 50px rgba(0,0,0,0.3),
                0 0 0 1px rgba(0, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            overflow: hidden;
            border: 1px solid rgba(0, 255, 255, 0.2);
            position: relative;
        }
        
        .header {
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%);
            color: #00ffff;
            text-align: center;
            padding: 40px 30px;
            position: relative;
            overflow: hidden;
            border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        }
        
        .social-links-container {
            position: absolute;
            top: 25px;
            right: 30px;
            display: flex;
            gap: 12px;
            z-index: 10;
        }
        
        .social-link {
            color: #00ffff;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border: 2px solid rgba(0, 255, 255, 0.3);
            border-radius: 10px;
            transition: all 0.3s ease;
            background: rgba(26, 32, 44, 0.8);
            backdrop-filter: blur(10px);
        }
        
        .social-link:hover {
            color: #ffffff;
            border-color: #00ffff;
            background: rgba(0, 255, 255, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
        }
        
        .social-link svg {
            width: 20px;
            height: 20px;
            transition: transform 0.3s ease;
        }
        
        .social-link:hover svg {
            transform: scale(1.1);
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-conic-gradient(
                from 0deg,
                transparent 0deg 90deg,
                rgba(0, 255, 255, 0.1) 90deg 180deg
            );
            animation: rotate 20s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .header h1 {
            font-size: 3em;
            margin-bottom: 15px;
            font-weight: 800;
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
            color: #ffffff;
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.95;
            position: relative;
            z-index: 1;
            color: #f7fafc;
        }
        
        .form-container {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 35px;
            background: rgba(45, 55, 72, 0.8);
            border-radius: 15px;
            padding: 25px;
            border: 1px solid rgba(0, 255, 255, 0.2);
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
        }
        
        .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(138, 43, 226, 0.05) 100%);
            border-radius: 15px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        
        .section:hover::before {
            opacity: 1;
        }
        
        .section:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
            border-color: rgba(0, 255, 255, 0.4);
        }
        
        .section-title {
            font-size: 1.4em;
            color: #00ffff;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid rgba(0, 255, 255, 0.3);
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            user-select: none;
            position: relative;
            z-index: 1;
        }
        
        .collapsible .section-title::after {
            content: '▼';
            font-size: 0.8em;
            transition: transform 0.3s ease;
            margin-left: auto;
        }
        
        .collapsible.collapsed .section-title::after {
            transform: rotate(-90deg);
        }
        
        .section-content {
            transition: all 0.3s ease;
            overflow: visible;
        }
        
        .collapsible.collapsed .section-content {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            padding-top: 0;
            margin-top: 0;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #e2e8f0;
            font-size: 1em;
            min-height: 24px;
            display: flex;
            align-items: center;
        }
        
        textarea, input[type="text"] {
            width: 100%;
            padding: 15px 18px;
            border: 2px solid rgba(0, 255, 255, 0.2);
            border-radius: 12px;
            font-size: 15px;
            transition: all 0.3s ease;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            background: rgba(26, 32, 44, 0.9);
            color: #e2e8f0;
            position: relative;
            z-index: 10;
        }
        
        textarea:focus, input[type="text"]:focus {
            outline: none;
            border-color: #00ffff;
            box-shadow: 0 0 0 4px rgba(0, 255, 255, 0.2), 0 0 20px rgba(0, 255, 255, 0.1);
            transform: translateY(-1px);
        }
        
        textarea::placeholder, input[type="text"]::placeholder {
            color: #718096;
        }
        
        textarea {
            height: 220px;
            resize: vertical;
            line-height: 1.5;
        }
        
        .example {
            background: linear-gradient(135deg, rgba(45, 55, 72, 0.8) 0%, rgba(26, 32, 44, 0.8) 100%);
            border: 1px solid rgba(0, 255, 255, 0.2);
            border-radius: 10px;
            padding: 18px;
            margin-top: 12px;
            font-size: 13px;
            color: #a0aec0;
            white-space: pre-line;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            border-left: 4px solid #00ffff;
        }
        
        .generate-btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(138, 43, 226, 0.2) 100%);
            color: #ffffff;
            border: 2px solid rgba(0, 255, 255, 0.5);
            border-radius: 12px;
            font-size: 1.2em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        }
        
        .generate-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        
        .generate-btn:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.3) 0%, rgba(138, 43, 226, 0.3) 100%);
            border-color: rgba(0, 255, 255, 0.8);
            box-shadow: 0 8px 25px rgba(0, 255, 255, 0.5);
        }
        
        .generate-btn:hover::before {
            left: 100%;
        }
        
        .generate-btn:active {
            transform: translateY(0);
        }
        
        .result-section {
            margin-top: 35px;
            display: none;
            animation: fadeInUp 0.5s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .result-url {
            background: linear-gradient(135deg, rgba(45, 55, 72, 0.8) 0%, rgba(26, 32, 44, 0.8) 100%);
            border: 2px solid rgba(0, 255, 255, 0.2);
            border-radius: 12px;
            padding: 18px;
            word-break: break-all;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            color: #e2e8f0;
        }
        
        .result-url::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .result-url:hover {
            border-color: #00ffff;
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
        }
        
        .result-url:hover::before {
            opacity: 1;
        }
        
        .copy-success {
            background: linear-gradient(135deg, rgba(0, 255, 157, 0.2) 0%, rgba(0, 255, 255, 0.2) 100%) !important;
            border-color: #00ff9d !important;
            color: #00ff9d;
            animation: successPulse 0.6s ease;
        }
        
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .qr-container {
            margin-top: 25px;
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, rgba(45, 55, 72, 0.8) 0%, rgba(26, 32, 44, 0.8) 100%);
            border: 2px solid rgba(0, 255, 255, 0.2);
            border-radius: 12px;
            display: none;
        }
        
        .qr-title {
            color: #00ffff;
            font-size: 1.1em;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .qr-code {
            display: inline-block;
            padding: 15px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 255, 255, 0.2);
        }
        
        .qr-description {
            color: #a0aec0;
            font-size: 0.9em;
            margin-top: 15px;
        }
        
        .footer {
            text-align: center;
            padding: 25px;
            color: #718096;
            border-top: 1px solid rgba(0, 255, 255, 0.2);
            background: rgba(26, 32, 44, 0.5);
            font-weight: 500;
        }
        
        .footer p {
            margin: 8px 0;
        }
        
        .footer .thanks-link {
            color: #00ffff;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        
        .footer .thanks-link:hover {
            color: #ffffff;
            border-bottom-color: #00ffff;
            transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
            body {
                padding: 15px;
            }
            
            .form-container {
                padding: 25px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2.2em;
            }
            
            .social-links-container {
                right: 20px;
                gap: 8px;
            }
            
            .social-link {
                width: 36px;
                height: 36px;
            }
            
            .social-link svg {
                width: 18px;
                height: 18px;
            }
            
            .section {
                padding: 20px;
                margin-bottom: 25px;
            }
            
            .section-title {
                font-size: 1.2em;
            }
        }
        
        @media (max-width: 480px) {
            .header h1 {
                font-size: 1.8em;
            }
            
            .social-links-container {
                right: 15px;
                top: 20px;
                gap: 6px;
            }
            
            .social-link {
                width: 32px;
                height: 32px;
            }
            
            .social-link svg {
                width: 16px;
                height: 16px;
            }
            
            .form-container {
                padding: 20px 15px;
            }
            
            .section {
                padding: 15px;
            }
        }
        
        /* ProxyIP 说明相关样式 */
        .code-block {
            padding: 16px 20px;
            border-radius: var(--border-radius-sm);
            margin: 16px 0;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .proxy-flow-container {
            background: var(--bg-secondary);
            padding: 20px;
            border-radius: var(--border-radius-sm);
            margin: 20px 0;
        }
        
        .proxy-flow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            flex-wrap: wrap;
            gap: 16px;
        }
        
        .proxy-step {
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            flex: 1;
            min-width: 120px;
        }
        
        .proxy-step-1 { background: #e3f2fd; }
        .proxy-step-2 { background: #f3e5f5; }
        .proxy-step-3 { background: #e8f5e8; }
        
        .proxy-step-title {
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .proxy-step-1 .proxy-step-title { color: #1976d2; }
        .proxy-step-2 .proxy-step-title { color: #7b1fa2; }
        .proxy-step-3 .proxy-step-title { color: #388e3c; }
        
        .proxy-step-desc {
            font-size: 0.9rem;
        }
        
        /* 修复每个步骤描述文字的颜色 */
        .proxy-step-1 .proxy-step-desc { color: #1565c0; }
        .proxy-step-2 .proxy-step-desc { color: #6a1b9a; }
        .proxy-step-3 .proxy-step-desc { color: #2e7d32; }
        
        .proxy-arrow {
            color: var(--primary-color);
            font-size: 1.5rem;
        }
        
        .proxy-explanation {
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin: 0;
        }
        
        /* 修复链接点击问题 */
        .section-content a {
            position: relative;
            z-index: 100;
            pointer-events: auto;
            transition: all 0.3s ease;
        }
        
        .section-content a:hover {
            color: #ffffff !important;
            text-decoration: underline !important;
        }
        
        /* 代理模式选择器样式 */
        .proxy-mode-selector {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .radio-option {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 12px 18px;
            border: 2px solid rgba(0, 255, 255, 0.2);
            border-radius: 10px;
            transition: all 0.3s ease;
            background: rgba(26, 32, 44, 0.5);
            position: relative;
            flex: 1;
            min-width: 180px;
        }
        
        .radio-option:hover {
            border-color: rgba(0, 255, 255, 0.4);
            background: rgba(0, 255, 255, 0.1);
        }
        
        .radio-option input[type="radio"] {
            margin-right: 10px;
            width: 18px;
            height: 18px;
            accent-color: var(--primary-color);
        }
        
        .radio-option input[type="radio"]:checked + .radio-label {
            color: var(--primary-color);
            font-weight: 600;
        }
        
        .radio-option.checked {
            border-color: var(--primary-color);
            background: rgba(0, 255, 255, 0.15);
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }
        
        .radio-label {
            color: var(--text-secondary);
            font-weight: 500;
            transition: all 0.3s ease;
            flex: 1;
        }
        
        @media (max-width: 600px) {
            .proxy-mode-selector {
                flex-direction: column;
            }
            
            .radio-option {
                min-width: auto;
            }
        }
        
        /* 复选框样式 */
        .checkbox-option {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 8px 12px;
            border: 2px solid rgba(0, 255, 255, 0.2);
            border-radius: 8px;
            transition: all 0.3s ease;
            background: rgba(26, 32, 44, 0.3);
        }
        
        .checkbox-option:hover {
            border-color: rgba(0, 255, 255, 0.4);
            background: rgba(0, 255, 255, 0.1);
        }
        
        .checkbox-option input[type="checkbox"] {
            margin-right: 10px;
            width: 16px;
            height: 16px;
            accent-color: var(--primary-color);
        }
        
        .checkbox-option input[type="checkbox"]:checked + .checkbox-label {
            color: var(--primary-color);
            font-weight: 600;
        }
        
        .checkbox-option.checked {
            border-color: var(--primary-color);
            background: rgba(0, 255, 255, 0.15);
        }
        
        .checkbox-label {
            color: var(--text-secondary);
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        /* Socks5 标题行样式 */
        .socks5-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            flex-wrap: nowrap;
            gap: 10px;
            position: relative;
            z-index: 5;
            height: 24px;
            min-height: 24px;
            max-height: 24px;
            overflow: hidden;
        }
        
        .socks5-header label[for="socks5"] {
            margin-bottom: 0;
            flex-shrink: 0;
            user-select: text;
            position: relative;
            z-index: 10;
            font-size: 1em;
            display: flex;
            align-items: center;
            height: 24px;
            min-height: 24px;
            align-self: center;
            line-height: 1;
        }
        
        /* 行内复选框样式 */
        .checkbox-option-inline {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 0;
            border: none;
            border-radius: 0;
            transition: all 0.3s ease;
            background: transparent;
            font-size: 0.9em;
            position: relative;
            z-index: 10;
            height: 24px;
            min-height: 24px;
            max-height: 24px;
            align-self: center;
            line-height: 1;
        }
        
        .checkbox-option-inline:hover {
            border-color: transparent;
            background: transparent;
        }
        
        .checkbox-option-inline input[type="checkbox"] {
            margin-right: 8px;
            width: 14px;
            height: 14px;
            accent-color: var(--primary-color);
            cursor: pointer;
            pointer-events: auto;
            position: relative;
            z-index: 10;
            flex-shrink: 0;
        }
        
        .checkbox-option-inline input[type="checkbox"]:checked + .checkbox-label-inline {
            color: var(--primary-color);
            font-weight: 600;
        }
        
        .checkbox-option-inline.checked {
            border-color: transparent;
            background: transparent;
        }
        
        .checkbox-label-inline {
            color: var(--text-secondary);
            font-weight: 500;
            transition: all 0.3s ease;
            white-space: nowrap;
            cursor: pointer;
            user-select: none;
            position: relative;
            z-index: 10;
            line-height: 1;
            display: flex;
            align-items: center;
            height: 24px;
        }
        
        /* 响应式处理 */
        @media (max-width: 500px) {
            .socks5-header {
                flex-direction: row;
                align-items: center;
                flex-wrap: wrap;
                height: auto;
                min-height: 24px;
                max-height: none;
            }
            
            .socks5-header label[for="socks5"] {
                align-self: center;
                margin-bottom: 5px;
            }
            
            .checkbox-option-inline {
                align-self: center;
                margin-top: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="social-links-container">
                <a href="https://github.com/cmliu/CF-Workers-BPSUB" target="_blank" class="social-link" title="BPSUB GitHub 源码仓库">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path fill="currentColor" fill-rule="evenodd" d="M7.976 0A7.977 7.977 0 0 0 0 7.976c0 3.522 2.3 6.507 5.431 7.584c.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076c-.343-.93-.881-1.175-.881-1.175c-.734-.489.048-.489.048-.489c.783.049 1.224.832 1.224.832c.734 1.223 1.859.88 2.3.685c.048-.538.293-.88.489-1.076c-1.762-.196-3.621-.881-3.621-3.964c0-.88.293-1.566.832-2.153c-.05-.147-.343-.978.098-2.055c0 0 .685-.196 2.201.832c.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832c.44 1.077.146 1.908.097 2.104a3.16 3.16 0 0 1 .832 2.153c0 3.083-1.86 3.719-3.62 3.915c.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.98 7.98 0 0 0 16 7.976C15.951 3.572 12.38 0 7.976 0" clip-rule="evenodd"></path>
                    </svg>
                </a>
                <a href="https://t.me/CMLiussss" target="_blank" class="social-link" title="CMLiussss 技术交流群">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <defs>
                            <linearGradient id="telegramGradient1" x1="50%" x2="50%" y1="0%" y2="100%">
                                <stop offset="0%" stop-color="#2AABEE"></stop>
                                <stop offset="100%" stop-color="#229ED9"></stop>
                            </linearGradient>
                        </defs>
                        <path fill="url(#telegramGradient1)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.04 128.04 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51s-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"></path>
                        <path fill="#FFF" d="M57.94 126.648q55.98-24.384 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"></path>
                    </svg>
                </a>
                <a href="https://t.me/bestip_one" target="_blank" class="social-link" title="白嫖哥交流群">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <defs>
                            <linearGradient id="telegramGradient2" x1="50%" x2="50%" y1="0%" y2="100%">
                                <stop offset="0%" stop-color="#2AABEE"></stop>
                                <stop offset="100%" stop-color="#229ED9"></stop>
                            </linearGradient>
                        </defs>
                        <path fill="url(#telegramGradient2)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.04 128.04 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51s-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"></path>
                        <path fill="#FFF" d="M57.94 126.648q55.98-24.384 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"></path>
                    </svg>
                </a>
            </div>
            <h1>🚀 BPSUB</h1>
            <p>Cloudflare Snipaste 订阅生成器</p>
        </div>
        
        <div class="form-container">
            <!-- 优选IP部分 -->
            <div class="section">
                <div class="section-title">🎯 优选IP设置</div>
                <div style="background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 0.9em; color: #e2e8f0;">
                    💡 <strong>智能缓存提示：</strong> 您的输入将自动保存到浏览器本地缓存中，下次访问时会自动恢复，让您的配置更加便捷持久。
                </div>
                <div class="form-group">
                    <label for="ips">优选IP列表（每行一个地址）：</label>
                    <textarea id="ips" placeholder="ADD示例：&#10;www.visa.cn#优选域名&#10;127.0.0.1:1234#CFnat&#10;[2606:4700::]:2053#IPv6&#10;&#10;注意：&#10;每行一个地址，格式为 地址:端口#备注&#10;IPv6地址需要用中括号括起来，如：[2606:4700::]:2053&#10;端口不写，默认为 443 端口，如：visa.cn#优选域名&#10;&#10;ADDAPI示例：&#10;https://raw.githubusercontent.com/cmliu/WorkerVless2sub/refs/heads/main/addressesapi.txt&#10;&#10;注意：ADDAPI直接添加直链即可"></textarea>
                    <div class="example">📝 格式说明：
• 域名&IPv4: www.visa.cn#优选域名 或 127.0.0.1:1234#CFnat
• IPv6: [2606:4700::]:2053#IPv6地址
• ADDAPI: https://example.com/api.txt
• 每行一个地址，端口默认为443
                    </div>
                </div>
            </div>
            
            <!-- PROXYIP部分 -->
            <div class="section collapsible collapsed">
                <div class="section-title" onclick="toggleSection(this)">🔧 落地IP设置</div>
                <div class="section-content">
                    <!-- 选项切换 -->
                    <div class="form-group">
                        <label style="margin-bottom: 15px;">选择连接方式：</label>
                        <div class="proxy-mode-selector">
                            <label class="radio-option">
                                <input type="radio" name="proxyMode" value="proxyip" checked onchange="toggleProxyMode()">
                                <span class="radio-label">🌐 ProxyIP 模式</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="proxyMode" value="socks5" onchange="toggleProxyMode()">
                                <span class="radio-label">🔒 Socks5 代理</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- ProxyIP 输入框 -->
                    <div class="form-group" id="proxyip-group">
                        <label for="proxyip">ProxyIP地址：</label>
                        <input type="text" id="proxyip" placeholder="proxyip.fxxk.dedyn.io:443" value="">
                    </div>
                    
                    <!-- Socks5 输入框 -->
                    <div class="form-group" id="socks5-group" style="display: none;">
                        <!-- 标题行：Socks5代理 + 全局代理选项 -->
                        <div class="socks5-header">
                            <label for="socks5">Socks5代理：</label>
                            <label class="checkbox-option-inline" for="globalSocks5">
                                <input type="checkbox" id="globalSocks5">
                                <span class="checkbox-label-inline">🌍 启用全局代理</span>
                            </label>
                        </div>
                        <input type="text" id="socks5" placeholder="user:password@127.0.0.1:1080 或 127.0.0.1:1080" value="">
                    </div>
                    
                    <!-- ProxyIP 详细说明 -->
                    <div style="margin-top: 24px;">
                        <h3 style="color: var(--text-primary); margin: 24px 0 16px;">📖 ProxyIP 概念</h3>
                        <p style="margin-bottom: 16px; line-height: 1.8; color: var(--text-secondary);">
                            在 Cloudflare 开发环境中，ProxyIP 特指那些能够成功代理连接到 Cloudflare 服务的第三方 IP 地址。
                        </p>
                        
                        <h3 style="color: var(--text-primary); margin: 24px 0 16px;">🔧 技术原理</h3>
                        <p style="margin-bottom: 16px; line-height: 1.8; color: var(--text-secondary);">
                            根据 Cloudflare 开发文档的 <a href="https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/" target="_blank" style="color: var(--primary-color); text-decoration: none;">TCP Sockets 官方文档</a> 说明，存在以下技术限制：
                        </p>
                        
                        <div class="code-block" style="background: #fff3cd; color: #856404; border-left: 4px solid var(--warning-color);">
                            ⚠️ Outbound TCP sockets to <a href="https://www.cloudflare.com/ips/" target="_blank" >Cloudflare IP ranges ↗</a>  are temporarily blocked, but will be re-enabled shortly.
                        </div>
                        
                        <p style="margin: 16px 0; line-height: 1.8; color: var(--text-secondary);">
                            这意味着 Cloudflare 开发环境无法直接连接到 Cloudflare 自有的 IP 地址段。为了解决这个限制，需要借助第三方云服务商的服务器作为"跳板"：
                        </p>
                        
                        <div class="proxy-flow-container">
                            <div class="proxy-flow">
                                <div class="proxy-step proxy-step-1">
                                    <div class="proxy-step-title">Cloudflare Workers</div>
                                    <div class="proxy-step-desc">发起请求</div>
                                </div>
                                <div class="proxy-arrow">→</div>
                                <div class="proxy-step proxy-step-2">
                                    <div class="proxy-step-title">ProxyIP 服务器</div>
                                    <div class="proxy-step-desc">第三方代理</div>
                                </div>
                                <div class="proxy-arrow">→</div>
                                <div class="proxy-step proxy-step-3">
                                    <div class="proxy-step-title">Cloudflare 服务</div>
                                    <div class="proxy-step-desc">目标服务</div>
                                </div>
                            </div>
                            <p class="proxy-explanation">
                                通过第三方服务器反向代理 Cloudflare 的 443 端口，实现对 Cloudflare 服务的访问
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 订阅转换设置 -->
            <div class="section collapsible collapsed">
                <div class="section-title" onclick="toggleSection(this)">⚙️ 订阅转换设置</div>
                <div class="section-content">
                    <div class="form-group">
                        <label for="subapi">订阅转换后端：</label>
                        <input type="text" id="subapi" placeholder="https://subapi.cmliussss.net" value="">
                        <div class="example">🔄 用于将生成的VLESS链接转换为Clash/SingBox等格式的后端服务
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="subconfig">订阅转换配置文件：</label>
                        <input type="text" id="subconfig" placeholder="https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini" value="">
                        <div class="example">📋 订阅转换时使用的配置文件URL，定义规则和策略
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 生成按钮 -->
            <button class="generate-btn" onclick="generateSubscription()">
                <span>🎉 生成订阅链接</span>
            </button>
            
            <!-- 结果显示 -->
            <div class="result-section" id="result-section">
                <div class="section-title">📋 订阅链接（点击复制）</div>
                <div class="result-url" id="result-url" onclick="copyToClipboard()"></div>
                
                <!-- 二维码显示 -->
                <div class="qr-container" id="qr-container">
                    <div class="qr-title">📱 手机扫码订阅</div>
                    <div class="qr-code" id="qrcode"></div>
                    <div class="qr-description">使用手机扫描二维码快速添加订阅</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2025 BPSUB - Powered by Cloudflare Snipaste | 感谢白嫖哥提供维护的 - <a href="https://t.me/v2rayByCf" target="_blank" class="thanks-link" title="访问Snipaste节点分享频道">🔗 Snipaste节点</a></p>
        </div>
    </div>
    
    <script>
        // 本地存储配置
        const STORAGE_KEY = 'bpsub_form_data';
        
        // 保存表单数据到localStorage
        function saveFormData() {
            const formData = {
                ips: document.getElementById('ips').value,
                proxyip: document.getElementById('proxyip').value,
                socks5: document.getElementById('socks5').value,
                subapi: document.getElementById('subapi').value,
                subconfig: document.getElementById('subconfig').value,
                proxyMode: document.querySelector('input[name="proxyMode"]:checked')?.value || 'proxyip',
                globalSocks5: document.getElementById('globalSocks5').checked,
                timestamp: Date.now()
            };
            
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
                console.log('表单数据已保存到本地缓存');
            } catch (error) {
                console.error('保存表单数据失败:', error);
            }
        }
        
        // 从localStorage加载表单数据
        function loadFormData() {
            try {
                const savedData = localStorage.getItem(STORAGE_KEY);
                if (!savedData) {
                    console.log('未找到缓存的表单数据');
                    return;
                }
                
                const formData = JSON.parse(savedData);
                console.log('加载缓存的表单数据:', formData);
                
                // 填充表单字段
                if (formData.ips) document.getElementById('ips').value = formData.ips;
                if (formData.proxyip) document.getElementById('proxyip').value = formData.proxyip;
                if (formData.socks5) document.getElementById('socks5').value = formData.socks5;
                if (formData.subapi) document.getElementById('subapi').value = formData.subapi;
                if (formData.subconfig) document.getElementById('subconfig').value = formData.subconfig;
                
                // 设置代理模式
                if (formData.proxyMode) {
                    const proxyModeRadio = document.querySelector('input[name="proxyMode"][value="' + formData.proxyMode + '"]');
                    if (proxyModeRadio) {
                        proxyModeRadio.checked = true;
                        toggleProxyMode();
                    }
                }
                
                // 设置全局Socks5选项
                if (formData.globalSocks5 !== undefined) {
                    document.getElementById('globalSocks5').checked = formData.globalSocks5;
                    // 手动触发change事件更新样式
                    document.getElementById('globalSocks5').dispatchEvent(new Event('change'));
                }
                
                console.log('表单数据加载完成');
            } catch (error) {
                console.error('加载表单数据失败:', error);
            }
        }
        

        
        // 设置表单字段的自动保存事件监听器
        function setupAutoSave() {
            const fields = ['ips', 'proxyip', 'socks5', 'subapi', 'subconfig'];
            
            // 为文本输入字段添加事件监听
            fields.forEach(fieldId => {
                const element = document.getElementById(fieldId);
                if (element) {
                    // 使用防抖函数避免频繁保存
                    let saveTimeout;
                    const debouncedSave = () => {
                        clearTimeout(saveTimeout);
                        saveTimeout = setTimeout(saveFormData, 1000); // 1秒后保存
                    };
                    
                    element.addEventListener('input', debouncedSave);
                    element.addEventListener('change', saveFormData);
                }
            });
            
            // 为单选框添加事件监听
            document.querySelectorAll('input[name="proxyMode"]').forEach(radio => {
                radio.addEventListener('change', saveFormData);
            });
            
            // 为复选框添加事件监听
            const globalSocks5Checkbox = document.getElementById('globalSocks5');
            if (globalSocks5Checkbox) {
                globalSocks5Checkbox.addEventListener('change', saveFormData);
            }
        }
        
        function generateSubscription() {
            const ips = document.getElementById('ips').value.trim();
            const proxyip = document.getElementById('proxyip').value.trim();
            const socks5 = document.getElementById('socks5').value.trim();
            const subapi = document.getElementById('subapi').value.trim();
            const subconfig = document.getElementById('subconfig').value.trim();
            
            // 获取选择的代理模式
            const proxyMode = document.querySelector('input[name="proxyMode"]:checked').value;
            
            // 保存当前表单数据
            saveFormData();
            
            // 获取当前域名
            const currentDomain = window.location.host;
            let url = \`https://\${currentDomain}/sub\`;
            
            const params = new URLSearchParams();
            
            // 处理优选IP
            if (ips) {
                // 将每行转换为用|分隔的格式
                const ipsArray = ips.split('\\n').filter(line => line.trim()).map(line => line.trim());
                if (ipsArray.length > 0) {
                    params.append('ips', ipsArray.join('|'));
                }
            }
            
            // 根据选择的模式处理代理设置
            if (proxyMode === 'socks5') {
                // 处理Socks5模式
                if (!socks5) {
                    alert('⚠️ 选择Socks5模式时，Socks5代理地址不能为空！\\n\\n请输入Socks5地址或切换到ProxyIP模式。');
                    return;
                }
                
                // 智能处理并验证Socks5格式
                const processedSocks5 = processSocks5(socks5);
                if (!processedSocks5) {
                    alert('⚠️ Socks5格式不正确！\\n\\n请检查输入格式，例如：\\n• user:password@127.0.0.1:1080\\n• 127.0.0.1:1080');
                    return;
                }
                
                params.append('socks5', processedSocks5);
                
                // 检查是否启用全局Socks5
                const globalSocks5 = document.getElementById('globalSocks5').checked;
                if (globalSocks5) {
                    params.append('global', 'true');
                }
            } else {
                // 处理ProxyIP模式
                if (proxyip) {
                    // 智能处理 proxyip 格式
                    let processedProxyip = processProxyIP(proxyip);
                    params.append('proxyip', processedProxyip);
                }
            }
            
            // 处理订阅转换后端
            if (subapi) {
                params.append('subapi', subapi);
            }
            
            // 处理订阅转换配置
            if (subconfig) {
                params.append('subconfig', subconfig);
            }
            
            // 组合最终URL
            const queryString = params.toString();
            if (queryString) {
                url += '?' + queryString;
            }
            
            // 显示结果
            const resultSection = document.getElementById('result-section');
            const resultUrl = document.getElementById('result-url');
            const qrContainer = document.getElementById('qr-container');
            
            resultUrl.textContent = url;
            resultSection.style.display = 'block';
            
            // 生成二维码
            generateQRCode(url);
            
            // 显示二维码容器
            qrContainer.style.display = 'block';
            
            // 滚动到结果区域
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        function copyToClipboard() {
            const resultUrl = document.getElementById('result-url');
            const url = resultUrl.textContent;
            
            // 使用 Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(url).then(() => {
                    showCopySuccess();
                }).catch(err => {
                    // 降级到传统方法
                    fallbackCopyTextToClipboard(url);
                });
            } else {
                // 降级到传统方法
                fallbackCopyTextToClipboard(url);
            }
        }
        
        function fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            
            // 避免在iOS上的滚动问题
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showCopySuccess();
            } catch (err) {
                alert('复制失败，请手动复制链接');
            }
            
            document.body.removeChild(textArea);
        }
        
        function showCopySuccess() {
            const resultUrl = document.getElementById('result-url');
            const originalClass = resultUrl.className;
            const originalText = resultUrl.textContent;
            
            resultUrl.classList.add('copy-success');
            resultUrl.textContent = '✅ 复制成功！链接已复制到剪贴板';
            
            setTimeout(() => {
                resultUrl.className = originalClass;
                resultUrl.textContent = originalText;
            }, 2000);
        }
        
        // 生成二维码
        function generateQRCode(url) {
            const qrCodeElement = document.getElementById('qrcode');
            
            // 清空之前的二维码
            qrCodeElement.innerHTML = '';
            
            // 生成新的二维码
            try {
                const qr = new QRCode(qrCodeElement, {
                    text: url,
                    width: 200,
                    height: 200,
                    colorDark: "#1a202c",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
            } catch (error) {
                console.error('生成二维码失败:', error);
                qrCodeElement.innerHTML = '<div style="color: #ff6b6b; padding: 20px;">二维码生成失败</div>';
            }
        }
        
        // 折叠功能
        function toggleSection(element) {
            const section = element.parentElement;
            section.classList.toggle('collapsed');
        }
        
        // 代理模式切换函数
        function toggleProxyMode() {
            const proxyMode = document.querySelector('input[name="proxyMode"]:checked').value;
            const proxyipGroup = document.getElementById('proxyip-group');
            const socks5Group = document.getElementById('socks5-group');
            
            // 更新单选框样式
            document.querySelectorAll('input[name="proxyMode"]').forEach(radio => {
                const radioOption = radio.closest('.radio-option');
                if (radio.checked) {
                    radioOption.classList.add('checked');
                } else {
                    radioOption.classList.remove('checked');
                }
            });
            
            // 切换显示内容
            if (proxyMode === 'socks5') {
                proxyipGroup.style.display = 'none';
                socks5Group.style.display = 'block';
            } else {
                proxyipGroup.style.display = 'block';
                socks5Group.style.display = 'none';
            }
        }
        
        // 智能处理 proxyip 格式的函数
        function processProxyIP(input) {
            // 如果输入为空，返回原值
            if (!input) return input;
            
            // 如果已经包含冒号，直接返回
            if (input.includes(':')) {
                return input;
            }
            
            // 检查是否包含 .tp 模式
            const tpMatch = input.match(/\\.tp(\\d+)\\./);
            if (tpMatch) {
                const port = tpMatch[1];
                return \`\${input}:\${port}\`;
            }
            
            // 如果都不匹配，返回原值
            return input;
        }
        
        // 智能处理 Socks5 格式的函数
        function processSocks5(input) {
            if (!input) return null;
            
            let cleaned = input.trim();
            
            // 移除各种协议前缀 - 修复转义问题
            cleaned = cleaned.replace(/^(socks5?:\\/\\/|socks:\\/\\/)/i, '');
            
            // 移除末尾的路径、fragment等 - 修复转义问题  
            cleaned = cleaned.replace(/[\\/#].*$/, '');
            
            // 验证基本格式
            // 支持格式: user:password@host:port 或 host:port
            // 修正正则表达式逻辑
            let match;
            let user, password, host, port;
            
            // 检查是否包含用户名和密码（包含@符号）
            if (cleaned.includes('@')) {
                // 格式: user:password@host:port
                const authRegex = /^([^:@]+):([^:@]+)@([^:@\\s]+):(\\d+)$/;
                match = cleaned.match(authRegex);
                if (match) {
                    [, user, password, host, port] = match;
                }
            } else {
                // 格式: host:port
                const simpleRegex = /^([^:@\\s]+):(\\d+)$/;
                match = cleaned.match(simpleRegex);
                if (match) {
                    [, host, port] = match;
                }
            }
            
            if (!match) {
                return null;
            }
            
            // 验证端口范围
            const portNum = parseInt(port);
            if (portNum < 1 || portNum > 65535) {
                return null;
            }
            
            // 构建最终格式
            if (user && password) {
                return \`\${user}:\${password}@\${host}:\${port}\`;
            } else {
                return \`\${host}:\${port}\`;
            }
        }
        
        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', function() {
            console.log('页面加载完成，开始初始化...');
            
            // 首先加载缓存的表单数据
            loadFormData();
            
            // 设置自动保存功能
            setupAutoSave();
            
            // 初始化单选框状态
            document.querySelectorAll('input[name="proxyMode"]').forEach(radio => {
                const radioOption = radio.closest('.radio-option');
                if (radio.checked) {
                    radioOption.classList.add('checked');
                }
                
                // 添加事件监听
                radio.addEventListener('change', function() {
                    toggleProxyMode();
                });
            });
            
            // 初始化复选框事件监听
            const globalSocks5Checkbox = document.getElementById('globalSocks5');
            if (globalSocks5Checkbox) {
                // 初始化状态
                const checkboxOption = globalSocks5Checkbox.closest('.checkbox-option') || globalSocks5Checkbox.closest('.checkbox-option-inline');
                if (checkboxOption && globalSocks5Checkbox.checked) {
                    checkboxOption.classList.add('checked');
                }
                
                globalSocks5Checkbox.addEventListener('change', function() {
                    console.log('复选框状态改变:', this.checked); // 调试日志
                    // 支持两种复选框样式
                    const checkboxOption = this.closest('.checkbox-option') || this.closest('.checkbox-option-inline');
                    if (checkboxOption) {
                        if (this.checked) {
                            checkboxOption.classList.add('checked');
                        } else {
                            checkboxOption.classList.remove('checked');
                        }
                    }
                });
                
                // 为label容器添加点击事件支持（备用方案）
                const checkboxLabel = globalSocks5Checkbox.closest('.checkbox-option-inline');
                if (checkboxLabel) {
                    checkboxLabel.addEventListener('click', function(e) {
                        console.log('点击了复选框容器', e.target); // 调试日志
                        // 如果点击的不是复选框本身，则手动切换复选框状态
                        if (e.target !== globalSocks5Checkbox) {
                            e.preventDefault();
                            e.stopPropagation();
                            globalSocks5Checkbox.checked = !globalSocks5Checkbox.checked;
                            globalSocks5Checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    });
                }
            }
        });
    </script>
</body>
</html>`;
    return new Response(HTML, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
    });
}