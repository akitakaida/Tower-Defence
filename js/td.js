compDATASET();

//ステージ名
let stage;
//1ブロックの一片の長さ
let b;

//文字サイズ
let fontHeight;

//フィールドのデータ。どの画像を用いるかを規定
let fieldDATA = [];

//enemyの出現データ。
let enemyDATA = [];

//フレーム数を管理
let frame = 0;

//Tower, Enemy, 弾を格納
let towers = [];
let enemies = [];
let bullets = [];

//スタート位置とゴール位置、全ルートを格納
let starts = [];
let goals = [];
let routes = [];

//現在のライフ、レベル、ウェーブ、お金
let life = 10;
let level = 1;
let wave = 0;
let fund = 0;

//waveの設定用
let waveSet = [];

//次のWaveやレベルに行って良いか
let possibillity = true;

//Towerを設置する時に使う。
let towerList = [];
let mouseIndex = null;
let levelUP = false;

let GAMEMODE = 10;

//メインループ
function main(){
    if(frame > 1000000000 * frameUnit) frame = 0;
    frame++;
    switch(GAMEMODE){
        //ゲーム開始前にリセット
        case 0:
            b = Data[stage][0];
            fontHeight = b / 5;
            fund = Data[stage][1];
            fieldDATA = Data[stage][2];
            enemyDATA = Data[stage][3];
            frame = 0;
            towers = [];
            enemies = [];
            bullets = [];
            starts = [];
            goals = [];
            life = 10;
            level = 1;
            wave = 0;
            waveSet = [];
            possibillity = true;
            towerList = [];
            mouseIndex = null;
            writeField(fieldDATA);
            GAMEMODE = 1;
            break;
        //Wave 開始前（待機状態）
        case 1:
            break;
        //Wave 開始
        case 2:
            waveSet = createWave(enemyDATA);
            GAMEMODE = 3;
        //Wave 進行
        case 3:
            nextLW();
            lc2.clearRect(0, 0, layer1.width, layer1.height);
            runWave();
            moveEnemies();
            towersAttack();
            break;
        //Levelクリア
        //Levelアップ
        //Gameクリア
        case 4:
            GameClear();
            return;
        //Game Over
        case 5:
            GameOver();
            return;
        case 10:
            showStages(STAGEDATASET);
            return;
    }
    writeText();
    if (life <= 0) GAMEMODE = 5;
    requestAnimationFrame(main); 
}

main();

//ステージ選択画面に戻る
function back(){
    layers.forEach((e) =>{
        let ec = e.getContext("2d");
        ec.clearRect(0, 0, e.width, e.height);
        e.setAttribute("width", 0);
    });
    GAMEMODE = 10;
    main();
}

//GameClearの処理
function GameClear(){
    mouseIndex = null;
    twsc.fillStyle = "rgba(255, 255, 255, 0.4)";
    twsc.fillRect(0, 0, tws.width, tws.height);
    twsc.fillStyle = "rgb(255, 178, 0)";
    twsc.strokeStyle = "rgb(0, 0, 0)";
    twsc.font = fontHeight * 10 + "px 'Arial'";
    twsc.fillText("Clear!",3 * b, 3 * b);
    twsc.strokeText("Clear!",3 * b, 3 * b);
}
layers[layers.length - 1].addEventListener("click", (e)=>{

});
//GameOverの処理
function GameOver(){
    twsc.fillStyle = "rgba(0, 0, 0, 0.4)";
    twsc.fillRect(0, 0, tws.width, tws.height);
    twsc.fillStyle = "rgb(255, 178, 0)";
    twsc.strokeStyle = "rgb(255, 255, 255)";
    twsc.font = fontHeight * 10 + "px 'Arial'";
    twsc.fillText("GameOver...", 3 * b, 3 * b);
    twsc.strokeText("GameOver...", 3 * b, 3 * b);
}

//Next Wave>> をクリックされたとき
layers[layers.length - 1].addEventListener("click", (e) => {
    if (!possibillity) return;
    let p = pos(e);
    p[0] -= field.width;
    if (p[0] >= fontHeight && p[0] <= fontHeight + b * 3 && p[1] >= fontHeight * 9 || p[1] <= fontHeight * 11.5) GAMEMODE = 2;
});

//level, waveの進行可否を判定
function nextLW() {
    let MaxLevel = enemyDATA[0];
    let MaxWave = enemyDATA[level][0];
    possibillity = false;
    if (wave === MaxWave && level === MaxLevel) {
        if (enemies.length === 0 && waveSet.length === 1) {
            GAMEMODE = 4;
        }
        return;
    }
    if (waveSet.length <= 1) {
        if(wave === MaxWave){
            if (enemies.length > 0) return;
        }
        possibillity = true;
        return;
    }
}

//level, waveを変更
function changeLW() {
    if (!possibillity) return;
    let MaxWave = enemyDATA[level][0];
    if (wave === MaxWave) {
        level++;
        wave = 1;
    } else {
        wave++;
    }
}

//ステージ選択画面を表示
function showStages(data) {
    b = 180;
    let cs = [field, layer1];
    let num = 4;
    for (let i = 0; i < cs.length; i++) {
        cs[i].style.position = "absolute";
        cs[i].style.top = "20px";
        cs[i].style.left = "40px";
        cs[i].style.zIndex = i;
        cs[i].setAttribute("width", (b + 1) * num + 1);
        cs[i].setAttribute("height", (b + 1) * num + 1);
    }
    for (let i = 0; i <= num; i++) {
        fc.fillStyle = "rgb(100, 100, 100)";
        fc.fillRect(i * (b + 1), 0, 1, field.height);
        fc.fillRect(0, i * (b + 1), field.width, 1);
    }
    fc.font = "40px 'Arial'"
    let c = 0;
    data.forEach((e) => {
        let img = new Image();
        img.src = "img/" + e[0] + ".png";
        img.onload = () => {
            fc.fillStyle = "rgb(255, 0, 0)";
            fc.strokeStyle = "rgb(255, 255, 255)"
            fc.drawImage(img, (c % num) * (b + 1) + 1, Math.floor(c / num) * (b + 1) + 1, b, b);
            let w = fc.measureText(e[0]).width;
            fc.fillText(e[0], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b / 5 + 1);
            fc.strokeText(e[0], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b / 5 + 1);
            w = fc.measureText(e[1]).width;
            fc.fillText(e[1], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b);
            fc.strokeText(e[1], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b);
            e.push(c % num, Math.floor(c / num));
            c++;
        }
    });
    layer1.addEventListener("mousemove", selectStage);
    layer1.addEventListener("click", goStage);
}
//マウスのある位置を表示
function selectStage(e) {
    lc1.clearRect(0, 0, layer1.width, layer1.height);
    let p = pos(e);
    let s = sec(p[0], p[1]);
    if (s[0] + s[1] * 4 >= STAGEDATASET.length) return;
    lc1.fillStyle = "rgba(255, 255, 255, 0.5)";
    lc1.fillRect(s[0] * (b + 1) + 1, s[1] * (b + 1) + 1, b, b);
}
//Stage選択
function goStage(e) {
    layer1.removeEventListener("mousemove", selectStage);
    let p = pos(e);
    let s = sec(p[0], p[1]);
    if(s[0] + s[1] * 4 >= STAGEDATASET.length) return;
    let count = 0;
    lc1.fillStyle = "rgba(255, 255, 0, 0)";
    for (let i = 0; i < STAGEDATASET.length; i++) {
        if (s[0] === STAGEDATASET[i][2] && s[1] === STAGEDATASET[i][3]) {
            stage = STAGEDATASET[i][0];
            break;
        }
    }
    function rect() {
        count++;
        lc1.clearRect(0, 0, layer1.width, layer1.height);
        lc1.fillStyle = "rgba(255, 255, 0," + count * 0.02 + ")";
        lc1.fillRect(s[0] * (b + 1) + 1, s[1] * (b + 1) + 1, b, b);
        if (count > 25) {
            lc1.fillStyle = "rgba(0, 0, 0," + (count - 25) * 0.04 + ")";
            lc1.fillRect(0, 0, field.width, field.height);
        }
        if (count < 50) {
            requestAnimationFrame(rect);
        } else {
            lc1.clearRect(0, 0, layer1.width, layer1.height);
            fc.clearRect(0, 0, field.width, field.height);
            GAMEMODE = 0
            main();
        }
    }
    rect();
    layer1.removeEventListener("click", goStage);
}

