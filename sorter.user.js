// ==UserScript==
// @name            Raidloot AA Sorter
// @namespace       ttang.tw
// @updateURL       https://github.com/xyzith/raidloot_aa_sorter/raw/master/sorter.user.js
// @grant           none
// @author          Taylor Tang
// @version         1.0
// @description     Able to sort aa at http://www.raidloot.com/AA.aspx*
// @match           http://www.raidloot.com/AA.aspx
// ==/UserScript==

(function(){
    function TableRows(aas) {
        var i;
        var aarows = [];
        var spellrows = [];
        var mapping = ['id', 'name', 'lv', 'cost'];
        var addEvent = function(i) {
            this.head[i].style.cursor = 'pointer';
            this.head[i].addEventListener('click', (function(ev){
                this.sortBy(mapping[i]);
                this.render();
            }).bind(this));
        };
        for(i = 0; i < aas.tBodies[0].children.length; i++) {
            if(aas.tBodies[0].children[i].className === 'aa'){
                aarows.push(aas.tBodies[0].children[i]);
            } else {
                spellrows.push(aas.tBodies[0].children[i]);
            }
        }
        this.body = aas.tBodies[0];
        this.head = aas.tHead.querySelectorAll('th');
        this.aa = aarows;
        this.spell = spellrows;
        for(i = 0; i < mapping.length; i++) {
            addEvent.call(this, i);
        }
    }

    TableRows.prototype.sortBy = function(rule) {
        function chomp(str) {
            return str.replace(/^ *| *$/g, '');
        }
        var by = {
            id: function(a, b) {
                function getId(el) {
                    return el.children[0].textContent;
                }
                return getId(a) - getId(b);
            },
            name: function(a, b) {
                function getName(el) {
                    return el.children[1].textContent;
                }
                if(getName(b) > getName(a)) {
                    return -1;
                } else {
                    return 1;
                }
            },
            lv: function(a, b) {
                function getLv(el) {
                    var num = el.children[2].textContent;
                    num = chomp(num.replace(/[^\d^ ]/g, '')).split(/ +/).sort();
                    return num[0];
                }
                return getLv(a)/1 - getLv(b)/1;
            },
            cost: function(a, b) {
                function getCost(el) {
                    return el.children[3].textContent.replace(/(\d+) *\/ ?\d+ */, '$1');
                }
                return getCost(a)/1 - getCost(b)/1;
            }
        };
        if(by[rule]) {
            this.aa.sort(by[rule]);
        }
    };

    TableRows.prototype.appendRow = function(els) {
        var i;
        for(i = 0; i < els.length; i++) {
            this.body.appendChild(els[i]);
        }
    };

    TableRows.prototype.render = function(){
        this.body.innerHTML = '';
        this.appendRow(this.aa);
        this.appendRow(this.spell);
    };

    function init() {
        var aas = document.getElementById('aas');
        if(!aas) {return false; }
        new TableRows(aas);
    }
    init();
})();
