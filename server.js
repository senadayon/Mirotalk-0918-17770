const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 画面のHTMLをサーバーから返す設定
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MiroTalk P2P Mobile Ready</title>
    <style>
        body { background: #121212; color: white; font-family: sans-serif; text-align: center; padding: 20px; }
        video { width: 90%; max-width: 400px; background: #000; border-radius: 10px; margin: 10px; transform: scaleX(-1); }
        .btn-container { margin-top: 20px; }
        button { background: #3b82f6; color: white; border: none; padding: 12px 24px; font-size: 16px; border-radius: 8px; margin: 5px; cursor: pointer; }
        button:hover { background: #2563eb; }
        #shareScreenBtn { background: #10b981; } /* 画面共有ボタンは緑色 */
        #shareScreenBtn:hover { background: #059669; }
    </style>
</head>
<body>

    <h1>MiroTalk P2P (スマホ画面共有対応版)</h1>
    
    <div>
        <video id="localVideo" autoplay playsinline muted></video>
        <video id="screenVideo" autoplay playsinline></video>
    </div>

    <div class="btn-container">
        <button id="startCamBtn">カメラ起動</button>
        <!-- スマホでも絶対に消えない画面共有ボタン -->
        <button id="shareScreenBtn">画面共有を開始</button>
    </div>

    <script>
        const localVideo = document.getElementById('localVideo');
        const screenVideo = document.getElementById('screenVideo');
        const startCamBtn = document.getElementById('startCamBtn');
        const shareScreenBtn = document.getElementById('shareScreenBtn');

        // 1. カメラとマイクの起動処理
        startCamBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideo.srcObject = stream;
            } catch (err) {
                alert('カメラの起動に失敗しました: ' + err.message);
            }
        });

        // 2. 画面共有処理（スマホでも動作するようにガードを外した状態）
        shareScreenBtn.addEventListener('click', async () => {
            // ブラウザが対応しているかチェック
            if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                alert('エラー: お使いのスマホ・ブラウザは画面共有 API (getDisplayMedia) に非対応です。AndroidのChrome最新版などでお試しください。');
                return;
            }

            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenVideo.srcObject = screenStream;
                alert('画面共有に成功しました！');
            } catch (err) {
                console.error(err);
                if (err.name === 'NotAllowedError') {
                    alert('画面共有の権限が拒否されました。');
                } else {
                    alert('画面共有の開始に失敗しました: ' + err.message);
                }
            }
        });
    </script>
</body>
</html>
    `);
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});
