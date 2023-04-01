//フレーム数を管理
let frame = 0;

//Tower, Enemy, 弾を格納
let towers = [];
let enemies = [];
let bullets = [];

//スタート位置とゴール位置を格納
let starts = [];
let goals = [];

//現在のライフ、レベル、ウェーブ、お金
let life = 10;
let level = 1;
let wave = 0;
let fund = 200;

//waveの設定用
let waveSet = [];

//次のWaveやレベルに行って良いか
let possibillity = true;

//Towerを設置する時に使う。
let towerList = [];
let mouseIndex = null;

let GAMEMODE = 0;

//メインループ
function main(){
    if(frame > 1000000000 * frameUnit) frame = 0;
    frame++;
    switch(GAMEMODE){
        //ゲーム開始前にリセット
        case 0:
            frame = 0;
            towers = [];
            enemies = [];
            bullets = [];
            starts = [];
            goals = [];
            life = 10;
            level = 1;
            wave = 0;
            fund = 200;
            waveSet = [];
            possibillity = true;
            towerList = [];
            mouseIndex = null;
            compDATASET();
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
    }
    writeText();
    if (life <= 0) GAMEMODE = 5;
    requestAnimationFrame(main); 
}

main();

//GameClearの処理
function GameClear(){
    alert("clear");
    alert("再開するにはページをリロードしてください");
}
//GameOverの処理
function GameOver(){
    alert("Game Over");
    alert("再開するにはページをリロードしてください");
}

//Next Wave>> をクリックされたとき
layers[layers.length - 1].addEventListener("click", (e) => {
    if (!possibillity) return;
    let p = pos(e);
    p[0] -= field.width;
    if (p[0] < fontHeight || p[0] > fontHeight + b * 3 || p[1] < fontHeight * 8 || p[1] > fontHeight * 10.5) return;
    GAMEMODE = 2;
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

