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

//ゲームモードの管理。
let GAMEMODE = 9;

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
            sound("BGM", true);
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
        //トップページの表示
        case 9:
            showTopPage();
            return;
        //ステージ情報の表示
        case 10:
            showStages();
            sound("BGM", true);
            return;
    }
    writeText();
    if (life <= 0) GAMEMODE = 5;
    requestAnimationFrame(main); 
}

compDATASET();
main();