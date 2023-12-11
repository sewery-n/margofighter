// ==UserScript==
// @name         DOBIJARA SI/NI
// @version      6.0
// @author       Padonim
// @match        https://*.margonem.pl/
// @exclude      https://www.margonem.pl/
// @match        https://*.margonem.com/
// @exclude      https://www.margonem.com/
// @exclude      https://forum.margonem.pl/
// @exclude      https://commons.margonem.pl/
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==


(async (sleep, isSi) => {

    const initHTML = () => {

        let mainColor = GM_getValue('dobijara-colour') || 'RED';

        const $container = $('<div id="dobijara-main"></div>').draggable();
        const $head = $('<div id="dobijara-head"><div id="dobijara-button">⚙️</div><label class="switch"><input type="checkbox" id="mode"><span class="slider"></span></label><input type="text" id="dobijara-levels" placeholder="98-300"></div>');
        const $body = $('<div id="dobijara-body"></div>');
        const $options = $(
            '<hr><div><p>SZYBKA WALKA</p><label class="switch"><input type="checkbox" id="automode"><span class="slider"></span></label><p style="margin-top: 5px">UCIECZKA</p><label class="switch"><input type="checkbox" id="escapemode"><span class="slider"></span></label></div>' +
            '<hr><div><p>KOLOR MOTYWU</p><input id="dobijara-theme" type="text"></div>' +
            '<div><p style="text-align: right; color: white; right: 0; bottom: 0; font-size: 7px;">by Padonim ver 6.0</div>'
        );

        const style = document.createElement('style');
        style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap');
        #dobijara-main{ font-family: 'Montserrat', sans-serif; width: 150px; position: absolute !important; z-index: 999; background: rgba(15, 15, 15, 0.85); border: 1px solid ${mainColor}; color: ${mainColor}; top: 15%; left: 15; }
        #dobijara-head{ width: 100%; height: 25px; margin-top: 3px; margin-left: 3px; }
        #dobijara-button{ float: left; }
        #dobijara-levels{ border: 0; border-bottom: 1px dotted ${mainColor}; background: rgba(15, 15, 15, 0.85); width: 60px; margin-left: 10px; color: ${mainColor}; }
        #dobijara-theme { border: 0; border-bottom: 1px dotted ${mainColor}; background: rgba(15, 15, 15, 0.85); width: 60px; color: ${mainColor};}
        #dobijara-body{ font-size: 11px; text-align: center; display: none; font-weight: bold; }
        #dobijara-body > div {
            margin-top: 10px;
            padding: 4px;
        }
        /* The switch - the box around the slider */.switch {position: relative;display: inline-block;width: 30px;height: 17px;}/* Hide default HTML checkbox */.switch input {opacity: 0;width: 0;height: 0;}/* The slider */.slider {position: absolute;cursor: pointer;top: 0;left: 0;right: 0;bottom: 0;background-color: #ccc;-webkit-transition: .4s;transition: .4s;}.slider:before {position: absolute;content: "";height: 10px;width: 13px;left: 3px;top: 3px;background-color: white;-webkit-transition: .4s;transition: .4s;}input:checked + .slider {background-color: red;}input:focus + .slider{box-shadow: 0 0 1px #2196F3;}input:checked + .slider:before {-webkit-transform: translateX(13px);-ms-transform: translateX(13px);transform: translateX(13px);}/* Rounded sliders */.slider.round {border-radius: 17px;}.slider.round:before {border-radius: 25%;}`;
        document.head.appendChild(style);

        $("body").append($container);
        $($container).append($head, $body);
        $($body).append($options);
        $("#dobijara-button").click(() => $('#dobijara-body').toggle('slow'));

    }
    window.onload = initHTML();

    GM_getValue('dobijara-pos-ni') || GM_setValue('dobijara-pos-ni', JSON.stringify({ x: 0, y: 0 }));
    GM_getValue('dobijara-pos-si') || GM_setValue('dobijara-pos-si', JSON.stringify({ x: 0, y: 0 }));

    let dobijarapos = isSi ? JSON.parse(GM_getValue('dobijara-pos-si')) : JSON.parse(GM_getValue('dobijara-pos-ni'));

    document.querySelector("#dobijara-main").style.left = dobijarapos.x;
    document.querySelector("#dobijara-main").style.top = dobijarapos.y;
    document.querySelector("#dobijara-main").style.position = "absolute";


    $(document.querySelector('#dobijara-main')).draggable({
        stop: () => {
            dobijarapos.x = document.querySelector('#dobijara-main').style.left;
            dobijarapos.y = document.querySelector('#dobijara-main').style.top;
            isSi ? GM_setValue('dobijara-pos-si', JSON.stringify(dobijarapos)) : GM_setValue('dobijara-pos-ni', JSON.stringify(dobijarapos));

            document.querySelector('#dobijara-main').style.left = dobijarapos.x;
            document.querySelector('#dobijara-main').style.top = dobijarapos.y;
            document.querySelector('#dobijara-main').style.position = 'absolute';
        }
    });

    document.getElementById('dobijara-levels').onchange = () => { GM_setValue('dobijara-levels', document.getElementById('dobijara-levels').value) };
    document.getElementById('mode').onclick = () => { GM_setValue('dobijara-mode', document.getElementById('mode').checked) };
    document.getElementById('automode').onclick = () => { GM_setValue('dobijara-automode', document.getElementById('automode').checked) };
    document.getElementById('dobijara-theme').onchange = () => {
        document.querySelector('#dobijara-main').style.border = `1px solid ${document.getElementById('dobijara-theme').value}`
        document.querySelector('#dobijara-main').style.color = document.getElementById('dobijara-theme').value;
        document.querySelector('#dobijara-levels').style['border-bottom'] = `1px dotted ${document.getElementById('dobijara-theme').value}`;
        document.querySelector('#dobijara-levels').style.color = document.getElementById('dobijara-theme').value;
        document.querySelector('#dobijara-theme').style['border-bottom'] = `1px dotted ${document.getElementById('dobijara-theme').value}`;
        document.querySelector('#dobijara-theme').style.color = document.getElementById('dobijara-theme').value;
        GM_setValue('dobijara-colour', document.getElementById('dobijara-theme').value);
    };

    const loadSettings = () => {
        sleep(2000);
        document.getElementById('dobijara-levels').value = GM_getValue('dobijara-levels') || '1-300';
        if (GM_getValue('dobijara-mode') == true) document.getElementById('mode').setAttribute('checked', 'checked');
        if (GM_getValue('dobijara-automode') == true) document.getElementById('automode').setAttribute('checked', 'checked');
        document.getElementById('dobijara-theme').value = GM_getValue('dobijara-colour') || 'RED';
    }
    window.onload = loadSettings();

    const isPlayerInRelation = (player) => isSi ? (player.relation == 1 || player.relation == 3 || player.relation == 6 || player.relation == 8) : (player.d.relation == 1 || player.d.relation == 3 || player.d.relation == 6 || player.d.relation == 8);

    const isPlayerProtected = (player) => isSi ? document.querySelector('#other' + player.id).querySelector('.emo-container > .emo.emo-battle') != null || document.querySelector('#other' + player.id).querySelector('.emo-container > .emo.emo-pvpprotected') != null : player.onSelfEmoList[0] != undefined;

    const playerDist = (x, y) => isSi ? Math.abs(hero.x - x) + Math.abs(hero.y - y) : Math.abs(Engine.hero.d.x - x) + Math.abs(Engine.hero.d.y - y);

    const sendAttackReq = (id) => {
        if (new Date() / 60 - lastAttackReq < 0.3) return;
        window._g('fight&a=attack&id=' + id);
        lastAttackReq = new Date() / 60;
    }
    let lastAttackReq = new Date() / 60;

    while (true) {
        if (isSi ? g.init < 5 : !Engine.allInit) {
            await sleep(2000);
            continue;
        }
        if (document.getElementById('mode').checked) {
            if (isSi ? map.pvp == 2 : Engine.map.d.pvp == 2) {
                let targets = [];
                const min = document.getElementById('dobijara-levels').value.split("-")[0];
                const max = document.getElementById('dobijara-levels').value.split("-")[1];
                const players = Object.values(isSi ? g.other : Engine.others.getDrawableList()).filter(obj => {
                    return isSi ? obj : obj.d;
                }).filter(obj => (obj.lvl >= min && obj.lvl <= max) && isPlayerInRelation(obj));
                for (let i in players) {
                    if (!isPlayerProtected(players[i])) {
                        targets.push({
                            id: isSi ? players[i].id : players[i].d.id,
                            x: isSi ? players[i].x : players[i].d.x,
                            y: isSi ? players[i].y : players[i].d.y,
                            nick: isSi ? players[i].nick : players[i].d.nick,
                            distance: isSi ? playerDist(players[i].x, players[i].y) : playerDist(players[i].d.x, players[i].d.y)
                        });
                    }
                }
                if (targets != '') {
                    targets = targets.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
                    if (targets[0].distance > 2) {
                        isSi ? hero.searchPath(parseInt(targets[0].x), parseInt(targets[0].y)) : Engine.hero.autoGoTo({
                            x: parseInt(targets[0].x),
                            y: parseInt(targets[0].y)
                        });
                    } else sendAttackReq(targets[0].id);
                }
                if (document.getElementById('automode').checked) {
                    if (isSi ? g.battle : !Engine.battle.endBattleForMe) {
                        isSi ? $('#autobattleButton').click() : $('.auto-fight-btn').click();
                    }
                }
                if (document.getElementById('escapemode').checked) {
                    if (isSi ? !g.battle : Engine.battle.endBattleForMe) {
                        if (isSi ? map.id == 344 : Engine.map.d.id == 344) {
                            document.getElementById('escapemode').checked = false;
                        } else _g(`moveitem&st=1&id=${Object.values(isSi ? g.item : Engine.items.fetchLocationItems('g')).find(item => item.name == 'Zwój teleportacji na Kwieciste Przejście').id}`);
                    }
                }
            }
        }
        await sleep(isSi ? 150 : 50);
    }

})((ms) => new Promise((resolve) => setTimeout(resolve, ms)), /interface=si/.test(document.cookie))