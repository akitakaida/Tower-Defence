//マップを描くレイヤ
const field = document.getElementById("field");
const fc = field.getContext("2d");

//タワーを描くレイヤ
const layer1 = document.getElementById("layer1");
const lc1 = layer1.getContext("2d");


//敵と弾を描くレイヤ
const layer2 = document.getElementById("layer2");
const lc2 = layer2.getContext("2d");

//攻撃範囲を描くレイヤ
const layer3 = document.getElementById("layer3");
const lc3 = layer3.getContext("2d");


//Level, Wave, Lifeの表示領域
const lwl = document.getElementById("showLWL");
const lwlc = lwl.getContext("2d");

//Towerのリスト表示
const tws = document.getElementById("showTowers");
const twsc = tws.getContext("2d");

const layers = [field, layer1, layer2, layer3, lwl, tws];

let ID = 0;

//6フレーム一単位
let frameUnit = 6;

let STAGEDATASET = {};

//fieldのデータセット
//fromTo:スタート、ゴールのみに設定。どこからスタートするか
let fieldDATASET = {
    "00": {},
    "10": {},
    "11": {},
    "12": {},
    "13": {},
    "14": {},
    "15": {},
    "16": {},
    "17": {},
    "18": {},
    "19": {},
    "20": {},
    "60": { fromTo:"bottom" },
    "61": { fromTo:"left" },
    "62": { fromTo: "top"},
    "80": { fromTo:"right" },
    "81": { fromTo:"bottom" },
    "82": { fromTo:"top" }
}

//音源のリスト
//tower_setsとenemy_movesが鳴らない
let Sounds = {
    "BGM": null,
    "clear": null,
    "tower_sets":null,
    "赤タワー_shot":null,
    "青タワー_shot":null,
    "緑タワー_shot":null,
    "白タワー_shot":null,
    "紫タワー_shot":null,
    "水タワー_shot":null,
    "黄タワー_shot":null,
    "enemy_appears": null,//使ってない
    "enemy_damaged": null,//使ってない
    "enemy_died":null,
    "enemy_moves":null
};

//母クラス
class charactor {
    constructor(x, y, name) {
        this.id = ID;
        ID++;
        this.x = x;
        this.y = y;
        this.name = name;
    }
    get getID() {
        return this.id;
    }
    set setX(x) {
        this.x = x;
    }
    set setY(y) {
        this.y = y;
    }
    get getX() {
        return this.x;
    }
    get getY() {
        return this.y;
    }
    get getName(){
        return this.name;
    }
    //画像の表示
    showImage(lc, size, img) {
        lc.drawImage(img, this.x, this.y, size, size);
    }
}

//towerのデータ
//range:攻撃範囲, damage:与えるダメージ, speed:連射速度
let towerDATASET = {
    "赤タワー": { range: 1, damage: 1, speed: 4, cost: 100, bullet_size: 1,  next: "赤タワー Lv.2"},
    "赤タワー Lv.2": { range: 2, damage: 1, speed: 7, cost: 400, bullet_size: 1,  next: "赤タワー Lv.3" },
    "赤タワー Lv.3": { range: 3, damage: 2, speed: 10, cost: 900, bullet_size: 1,  next: "赤タワー Lv.Max" },
    "青タワー": { range: 3, damage: 2, speed: 1, cost: 200, bullet_size: 2,  next: "青タワー Lv.2" },
    "青タワー Lv.2": { range: 6, damage: 4, speed: 1, cost: 500, bullet_size: 2,  next: "青タワー Lv.3" },
    "青タワー Lv.3": { range: 10, damage: 6, speed: 2, cost: 1000, bullet_size: 3, next: "青タワー Lv.Max" },
    "緑タワー": { range: 1, damage: 4, speed: 1, cost: 300, bullet_size: 3,  next: "緑タワー Lv.2" },
    "緑タワー Lv.2": { range: 1, damage: 7, speed: 2, cost: 600, bullet_size: 3,  next: "緑タワー Lv.3"},
    "緑タワー Lv.3": { range: 2, damage: 10, speed: 3, cost: 1100, bullet_size: 4, next: "緑タワー Lv.Max" },
    "赤タワー Lv.Max": { range: 2, damage: 1, speed: 25, cost: 2000, bullet_size: 1, next: "紫タワー"},
    "青タワー Lv.Max": { range: 20, damage: 7, speed: 1, cost: 2200, bullet_size: 3, next: "水タワー"},
    "緑タワー Lv.Max": { range: 2, damage: 25, speed: 2, cost: 2500, bullet_size: 5, next: "黄タワー"},
    "紫タワー": { range: 15, damage: 2, speed: 25, cost: 6000, bullet_size: 1, next: null},
    "水タワー": { range: 20, damage: 15, speed: 2, cost: 7000, bullet_size: 3, next: null},
    "黄タワー": { range: 2, damage: 25, speed: 15, cost: 9000, bullet_size: 5, next: null},
    "白タワー": { range: 6, damage: 6, speed: 6, cost: 5000, bullet_size: 1, next: null }
}

class tower extends charactor {
    constructor(x, y, name) {
        super(x, y, name);
        this.range = rtnRange(towerDATASET[name]["range"]);
        this.damage = towerDATASET[name]["damage"];
        this.speed = Math.floor(frameUnit * 25 / towerDATASET[name]["speed"]);
        this.img = towerDATASET[name]["img"];
        this.target = this.Target();
        this.show();
        sound("tower_sets");
    }

    get getDamage(){
        return this.damage;
    }

    show() {
        super.showImage(lc1, b, this.img);
    }
    
    //攻撃範囲の表示
    showRange() {
        lc3.beginPath();
        lc3.arc(this.x + b / 2, this.y + b / 2, this.range, 0, 2 * Math.PI);
        lc3.fillStyle = "rgba(255, 178, 0, 0.5)";
        lc3.fill();
    }
    
    //攻撃するEmemyを設定
    Target() {
        //range内にいるEmemyを特定
        for(let i = 0; i < enemies.length; i++){
            let ex = enemies[i].getX;
            let ey = enemies[i].getY;
            let dx1 = ex - (this.x + b / 2);
            let dx2 = (ex + enemies[i].getSize) - (this.x + b / 2);
            let dy1 = ey - (this.y + b / 2);
            let dy2 = (ey + enemies[i].getSize) - (this.y + b / 2);
            let distance = [dx1 ** 2 + dy1 ** 2, dx1 ** 2 + dy2 ** 2, dx2 ** 2 + dy1 ** 2, dx2 ** 2 + dy2 ** 2];
            for (let j = 0; j < distance.length; j++) {
                if (distance[j] <= this.range ** 2) {
                    return enemies[i].getID;
                }
            }
        }
        return this.id;
    }
    
    //攻撃
    attack() {
        if( frame % this.speed != 0 ) return;
        this.target = this.Target();
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].getID === this.target) {
                bullets.push(new bullet(this.name, this.id, enemies[i].getID, this.damage));
                sound(`${this.name.slice(0, 4)}_shot`);
                return;
            }
        }
    }
}

//弾
class bullet{
    constructor(towerName, towerID, enemyID, damage){
        this.x = 0;
        this.y = 0;
        this.size = b / 10 * towerDATASET[towerName]["bullet_size"];
        this.img = towerDATASET[towerName]["bullet_img"];
        this.towerID = towerID;
        this.enemyID = enemyID;
        this.damage = damage;
        this.count = 0;
    }
    show(){
        lc2.drawImage(this.img, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
    move(){
        let tIndex, eIndex, tx, ty, ex, ey, es;
        
        //カウントを増やす。frameUnitに到達したら削除される。
        this.count++;
        
        try {
            //対象Enemyを探す
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].getID === this.enemyID) {
                    eIndex = i;
                    ex = enemies[i].getX;
                    ey = enemies[i].getY;
                    es = enemies[i].getSize;
                    break;
                }
            }
            //対象Towerを探す
            for (let i = 0; i < towers.length; i++) {
                if (towers[i].getID === this.towerID) {
                    tIndex = i;
                    tx = towers[i].getX;
                    ty = towers[i].getY;
                    break;
                }
            }

        } catch (error) {
            console.log(error);
            this.count = frameUnit;
            return;
        }
        
        //Towerの中心
        let tc = new Point(tx + b / 2, ty + b / 2);

        //enemyの中心
        let ec = new Point(ex + es / 2, ey + es / 2);

        //Towerの中心からenemyの中心までのベクトル
        let v = new Vecter(ec.x - tc.x, ec.y - tc.y);
        
        //frameUnit=6フレームに分けて描画したい。
        //場所の更新
        this.x = tc.x + this.count * v.x / frameUnit;
        this.y = tc.y + this.count * v.y / frameUnit;

        //攻撃
        if (this.count >= frameUnit && enemies[eIndex] != undefined) enemies[eIndex].attacked(this.damage);
        
    }
}

//enemyのデータ。
//size:大きさ, hp:体力, damage:自陣まで到達した時のダメージ, speed:移動速度（0～10）
let enemyDATASET = {
    "Red Enemy": { size: 1, hp: 10, damage: 1, speed: 5, reward: 50 },
    "Hi-Red Enemy": { size: 1, hp: 10, damage: 1, speed: 10, reward: 100 },
    "Blue Enemy": { size: 2, hp: 20, damage: 1, speed: 2, reward: 100 },
    "Hi-Blue Enemy": { size: 2, hp: 40, damage: 2, speed: 4, reward: 200 },
    "Green Enemy": { size: 3, hp: 50, damage: 3, speed: 2, reward: 300 },
    "Hi-Green Enemy": { size: 3, hp: 80, damage: 4, speed: 3, reward: 400 },
    "Purple Enemy": { size: 4, hp: 100, damage: 5, speed: 5, reward: 500 },
    "Black Enemy": { size: 5, hp: 500, damage: 10, speed: 1, reward: 700 },
    "King Black": { size: 5, hp: 1000, damage: 10, speed: 2, reward: 1000 }
}

class enemy extends charactor {
    constructor(x, y, name, route) {
        super(x, y, name);
        this.size = b / 5 * enemyDATASET[name]["size"];
        this.hp = enemyDATASET[name]["hp"];
        this.damage = enemyDATASET[name]["damage"];
        this.speed = enemyDATASET[name]["speed"] / frameUnit;
        this.route = route;
        this.direction = [0, 0];
        this.culcDir();
        this.img = enemyDATASET[name]["img"];
        this.show();
        sound("enemy_appears");
    }
    get getHP() {
        return this.hp;
    }
    get getDamage() {
        return this.damage;
    }
    get getSize() {
        return this.size;
    }
    show() {
        super.showImage(lc2, this.size, this.img);
        lc2.fillStyle = "rgba(255, 255, 255, 0.5)";
        lc2.fillRect(this.x, this.y, this.size, -1 * fontHeight);
        lc2.fillStyle = "black";
        lc2.fillText(this.hp, this.x, this.y);
    }
    //移動
    move() {
        this.x += this.direction[0] * this.speed;
        this.y += this.direction[1] * this.speed;
        //sound("enemy_moves"); //うるさいからナシ。
        this.judgeDir();
    }
    //被弾したらHPを減らす
    attacked(damage) {
        //sound(enemy_damaged); //うるさいからなし。
        this.hp -= damage;
        if(this.hp < 0) {
            sound("enemy_died");
            this.hp = 0;
        }
    }
    //移動する方向を決定
    culcDir() {
        let i;
        //現在の座標
        let now = sec(this.x, this.y);
        //次の位置を考える
        for (i = 0; i < this.route.length; i++) {
            if (now[0] === this.route[i][0] && now[1] === this.route[i][1]) break;
        }
        if (i + 1 >= this.route.length) return;
        let next = this.route[i + 1];
        this.direction = [next[0] - now[0], next[1] - now[1]];
    }

    //方向変換を実施するか判定
    judgeDir() {
        let now = sec(this.x, this.y);
        //現在の区画内での座標
        let npos = [this.x - (now[0] * (b + 1) + 1), this.y - (now[1] * (b + 1) + 1)];
        //区画の左上から右下に引いた対角線上(誤差this.speed)に乗った時に方向転換
        if (Math.abs(npos[0] - npos[1]) > this.speed) return;
        this.culcDir();
    }
}