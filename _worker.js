
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
                    subConverterUrl = `${subProtocol}://${subConverter}/sub?target=clash&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
                } else if (userAgent.includes('clash') || userAgent.includes('meta') || userAgent.includes('mihomo')) {
                    subConverterUrl = `${subProtocol}://${subConverter}/sub?target=singbox&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
                } else {
                    subConverterUrl = `${subProtocol}://${subConverter}/sub?target=auto&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
                }

                try {
                    const subConverterResponse = await fetch(subConverterUrl, { headers: { 'User-Agent': UA } });

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

                    //if (addressid.includes(':')) addressid = addressid.split(':')[0];
                    
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
                    const 最终路径 = socks5 ? (全局socks5 ? `/snippets/gs5=${encodeURIComponent(socks5)}?ed=2560` : `/snippets/s5=${encodeURIComponent(socks5)}?ed=2560`) : `/snippets/ip=${encodeURIComponent(proxyIP)}?ed=2560`;
                    const 为烈士Link = 'vl' + 'es' + `s://${uuid}@${address}:${port}?security=tls&sni=${伪装域名}&type=ws&host=${伪装域名}&path=${encodeURIComponent(最终路径)}&allowInsecure=1&fragment=${encodeURIComponent('1,40-60,30-50,tlshello')}&encryption=none#${encodeURIComponent(addressid + 节点备注)}`;
                    return 为烈士Link;
                }
            }).join('\n');

            const 返回订阅内容 = userAgent.includes(('Mozilla').toLowerCase()) ? responseBody : btoa(responseBody);
            if (!userAgent.includes(('Mozilla').toLowerCase())) responseHeaders["Content-Disposition"] = `attachment; filename*=utf-8''${encodeURIComponent(FileName)}`;
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
        
        .social-link {
            position: absolute;
            top: 25px;
            right: 30px;
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
            z-index: 10;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="https://github.com/cmliu/CF-Workers-BPSUB" target="_blank" class="social-link" title="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path fill="currentColor" fill-rule="evenodd" d="M7.976 0A7.977 7.977 0 0 0 0 7.976c0 3.522 2.3 6.507 5.431 7.584c.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076c-.343-.93-.881-1.175-.881-1.175c-.734-.489.048-.489.048-.489c.783.049 1.224.832 1.224.832c.734 1.223 1.859.88 2.3.685c.048-.538.293-.88.489-1.076c-1.762-.196-3.621-.881-3.621-3.964c0-.88.293-1.566.832-2.153c-.05-.147-.343-.978.098-2.055c0 0 .685-.196 2.201.832c.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832c.44 1.077.146 1.908.097 2.104a3.16 3.16 0 0 1 .832 2.153c0 3.083-1.86 3.719-3.62 3.915c.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.98 7.98 0 0 0 16 7.976C15.951 3.572 12.38 0 7.976 0" clip-rule="evenodd"></path>
                </svg>
            </a>
            <h1>🚀 BPSUB</h1>
            <p>Cloudflare Snipaste 订阅生成器</p>
        </div>
        
        <div class="form-container">
            <!-- 优选IP部分 -->
            <div class="section">
                <div class="section-title">🎯 优选IP设置</div>
                <div class="form-group">
                    <label for="ips">优选IP列表（每行一个地址）：</label>
                    <textarea id="ips" placeholder="ADD示例：&#10;visa.cn#优选域名&#10;127.0.0.1:1234#CFnat&#10;[2606:4700::]:2053#IPv6&#10;&#10;注意：&#10;每行一个地址，格式为 地址:端口#备注&#10;IPv6地址需要用中括号括起来，如：[2606:4700::]:2053&#10;端口不写，默认为 443 端口，如：visa.cn#优选域名&#10;&#10;ADDAPI示例：&#10;https://raw.githubusercontent.com/cmliu/WorkerVless2sub/refs/heads/main/addressesapi.txt&#10;&#10;注意：ADDAPI直接添加直链即可"></textarea>
                    <div class="example">
📝 格式说明：
• ADD: visa.cn#优选域名 或 127.0.0.1:1234#CFnat
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
                    <div class="form-group">
                        <label for="proxyip">ProxyIP地址：</label>
                        <input type="text" id="proxyip" placeholder="proxyip.fxxk.dedyn.io:443" value="">
                        
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
                                这意味着 Cloudflare 开发无法直接连接到 Cloudflare 自有的 IP 地址段。为了解决这个限制，需要借助第三方云服务商的服务器作为"跳板"：
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
            </div>
            
            <!-- 订阅转换设置 -->
            <div class="section collapsible collapsed">
                <div class="section-title" onclick="toggleSection(this)">⚙️ 订阅转换设置</div>
                <div class="section-content">
                    <div class="form-group">
                        <label for="subapi">订阅转换后端：</label>
                        <input type="text" id="subapi" placeholder="https://subapi.cmliussss.net" value="">
                        <div class="example">
🔄 用于将生成的VLESS链接转换为Clash/SingBox等格式的后端服务
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="subconfig">订阅转换配置文件：</label>
                        <input type="text" id="subconfig" placeholder="https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini" value="">
                        <div class="example">
📋 订阅转换时使用的配置文件URL，定义规则和策略
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
            <p>© 2025 BPSUB - Powered by Cloudflare Snipaste</p>
            <p>感谢白嫖哥提供维护的Snipaste节点 - <a href="https://t.me/bestip_one" target="_blank" class="thanks-link" title="访问白嫖哥的Telegram频道">🔗 白嫖哥频道</a></p>
        </div>
    </div>
    
    <script>
        function generateSubscription() {
            const ips = document.getElementById('ips').value.trim();
            const proxyip = document.getElementById('proxyip').value.trim();
            const subapi = document.getElementById('subapi').value.trim();
            const subconfig = document.getElementById('subconfig').value.trim();
            
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
            
            // 处理PROXYIP
            if (proxyip) {
                // 智能处理 proxyip 格式
                let processedProxyip = processProxyIP(proxyip);
                params.append('proxyip', processedProxyip);
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
        
        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', function() {
            // 可以在这里添加一些初始化逻辑
            console.log('BPSUB 订阅生成器已加载 - 科技范版本');
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