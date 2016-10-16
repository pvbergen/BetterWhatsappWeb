
function EmojiHandler()
{
    this.emojis = null;
    this.offset = 0;
    this.picker = false;
    var me = this;
    this.annotate = function() {
        this.emojis.each(
            function(i, span) {
                var index = i - me.offset;
                if (index >= 0) {
                    if (index < 36) {
                        var characterSpan = $('<span class="bww-character bww-alt bww-active"></span>');
                        characterSpan.text(reverseMapping[index]);
                    } else if (index < 72) {
                        var characterSpan = $('<span class="bww-character bww-ctrl"></span>');
                        characterSpan.text(reverseMapping[index-36]);
                    } else if (index < 108) {
                        var characterSpan = $('<span class="bww-character bww-shift"></span>');
                        characterSpan.text(reverseMapping[index-72]);
                    }
                    $(span).append(characterSpan);    
                }
            }
        );
    }
}

EmojiHandler.prototype.loadEmojis = function(offset)
{
    me = this;
    var interval = setInterval(function() {
        me.emojis = $(".emoji-panel span.emojik");
        if (me.emojis.length > 0) {
            clearInterval(interval);
            me.emojis.find(".bww-character").remove();
            if (offset == undefined) {
                me.offset = 0;
            } else {
                me.offset = Math.ceil(((offset - 8 )/48)) * Math.ceil(($(".emoji-panel").innerWidth() / 48));
            }
            var container = $(".emoji-panel-body");
            container.scroll(function() {
                emojiHandler.loadEmojis(container.scrollTop());
            });
            $(".bww-character.bww-alt").addClass("bww-active");
            me.annotate();
        }
    }, 100);
}

EmojiHandler.prototype.reset = function() {
    this.emojis = null;
    this.offset = 0;
    this.picker = false;
}

EmojiHandler.prototype.addEmoji = function(index) 
{
    if (this.picker) {
         if ($(".dropdown-picker").length > 0) {
             if ($(".dropdown-picker ul li").length > index) {
                 console.log($($(".dropdown-picker ul li")[index]).find(".emojik"));
                 $($(".dropdown-picker ul li")[index]).click();
                 $($($(".dropdown-picker ul li")[index]).find(".ellipsify")).click();
                 $($($(".dropdown-picker ul li")[index]).find(".emojik")).click();
                 this.picker = false;
             }
         } else {
            index = index + this.offset;
            if (this.emojis.length > index) {
                $(this.emojis[index]).click();    
            }
            this.picker = false;
         }
            
    } else {
        index = index + this.offset;
        if (this.emojis.length > index) {
            $(this.emojis[index]).click();    
        }
        /*if ($(".dropdown-picker").length > 0) {
            me.emojis.find(".bww-character").addClass("bww-hide");
            $(".dropdown-picker ul li").each(function(i, li) {
                var characterSpan = $('<span class="bww-character bww-active"></span>');
                characterSpan.text(i);
                $(li).append(characterSpan);
            })
            this.picker = true;
        }    */
    }
}

var emojiHandler = new EmojiHandler();

var interval = setInterval(function() {
    var button = $('.btn-emoji');
    if (button.length > 0) {
        registerHandlers();
    }
}, 500);


var altKey = false;
var ctrlKey = false;
var shiftKey = false;
var emojiSet = false;
var emojiOpened = false;
var useNumpad = false;
function registerHandlers() {
    
        $(".btn-emoji").off("click").on("click", function() {
            if ($(".btn-emoji").hasClass("icon-hide")) {
                emojiOpened = false;
                emojiHandler.reset();
            } else {
                emojiOpened = true;
                emojiHandler.loadEmojis(0);
                var interval = setInterval(function() {
                    var menuItems = $(".emoji-panel .menu-item");
                    if (menuItems.length > 0) {
                        clearInterval(interval);
                        menuItems.each(function(i, item) {
                            item = $(item);
                            item.off("click").on("click", function() {
                                emojiHandler.loadEmojis(0);
                            });
                        });
                        
                    }
                }, 100);
                
            }
        });
        $(document).off("keydown").on("keydown", function(e) {
            if (e.which == 18) {
                altKey = true;
                console.log($(".emoji-panel-body > div"));
                if (!emojiOpened) {
                    $(".btn-emoji").click();
                    $(".input-container").click();
                    emojiSet = true;
                } else {
                    emojiSet = false;
                }
                $(".bww-character.bww-alt").addClass("bww-active");
                e.preventDefault();
            } else if (e.which == 17) {
                ctrlKey = true;
                if (altKey) {
                    $(".bww-character.bww-alt").removeClass("bww-active");
                    $(".bww-character.bww-ctrl").addClass("bww-active");
                }
                e.preventDefault();
            } else if (e.which == 16) {  
                shiftKey = true;
                if (altKey) {
                    $(".bww-character.bww-alt").removeClass("bww-active");
                    $(".bww-character.bww-shift").addClass("bww-active");
                }
                e.preventDefault();
            } else if (emojiOpened && altKey) {
                if ((e.which > 47 && e.which < 58) || (e.which > 64 && e.which < 91) || (useNumpad && e.which > 95 && e.which < 106)) { 
                    var index = mapping[e.which];
                    if (ctrlKey) {
                        index += 36;
                    }
                    if (shiftKey) {
                        index += 72;
                    }
                    emojiHandler.addEmoji(index);
                    emojiSet = true;
                    e.preventDefault();
                } else if (e.which == 39) {
                    var targetTab = $(".emoji-panel .menu-item.active").next();
                    if (targetTab.length > 0) {
                        targetTab.click();
                        emojiHandler.loadEmojis(0);
                    }
                    emojiSet = true;
                } else if (e.which == 37) {
                    var targetTab = $(".emoji-panel .menu-item.active").prev();
                    if (targetTab.length > 0) {
                        targetTab.click();
                        emojiHandler.loadEmojis(0);
                    }
                    emojiSet = true;
                } else if (e.which == 38) {
                    var container = $(".emoji-panel-body");                    
                    container.scrollTop(container.scrollTop()-192);
                    emojiHandler.loadEmojis(0);
                    emojiSet = true;
                } else if (e.which == 40) {
                    var container = $(".emoji-panel-body");
                    container.scrollTop(container.scrollTop()+192);
                    emojiHandler.loadEmojis(0);
                    emojiSet = true;
                } else {
                    emojiSet = false;
                }
            } else {
                emojiSet = false;
            }
        });

        $(document).off("keyup").on("keyup", function(e) {
            if (e.which == 18) {
                altKey = false;
                if (emojiOpened && !emojiSet) {
                    $(".btn-emoji").click();
                    $(".input-container").click();
                }
                $(".bww-character.bww-alt").removeClass("bww-active");
            } else if (e.which == 17) {
                ctrlKey = false;
                $(".bww-character.bww-alt").addClass("bww-active");
                $(".bww-character.bww-ctrl").removeClass("bww-active");
            } else if (e.which == 16) {
                shiftKey = false;
                $(".bww-character.bww-alt").addClass("bww-active");
                $(".bww-character.bww-shift").removeClass("bww-active");
            }
        });
    
}


var mapping = new Array();
mapping[49] = 0;
mapping[50] = 1;
mapping[51] = 2;
mapping[52] = 3;
mapping[53] = 4;
mapping[54] = 5;
mapping[55] = 6;
mapping[56] = 7;
mapping[57] = 8;
mapping[48] = 9;
mapping[81] = 10;
mapping[87] = 11;
mapping[69] = 12;
mapping[82] = 13;
mapping[84] = 14;
mapping[90] = 15;
mapping[85] = 16;
mapping[73] = 17;
mapping[79] = 18;
mapping[80] = 19;
mapping[65] = 20;
mapping[83] = 21;
mapping[68] = 22;
mapping[70] = 23;
mapping[71] = 24;
mapping[72] = 25;
mapping[74] = 26;
mapping[75] = 27;
mapping[76] = 28;
mapping[89] = 29;
mapping[88] = 30;
mapping[67] = 31;
mapping[86] = 32;
mapping[66] = 33;
mapping[78] = 34;
mapping[77] = 35;
mapping[97] = 0;
mapping[98] = 1;
mapping[99] = 2;
mapping[100] = 3;
mapping[101] = 4;
mapping[102] = 5;
mapping[103] = 6;
mapping[104] = 7;
mapping[105] = 8;
mapping[96] = 9;

var reverseMapping = new Array();
reverseMapping[0] = 1;
reverseMapping[1] = 2;
reverseMapping[2] = 3;
reverseMapping[3] = 4;
reverseMapping[4] = 5;
reverseMapping[5] = 6;
reverseMapping[6] = 7;
reverseMapping[7] = 8;
reverseMapping[8] = 9;
reverseMapping[9] = 0;
reverseMapping[10] = "q";
reverseMapping[11] = "w";
reverseMapping[12] = "e";
reverseMapping[13] = "r";
reverseMapping[14] = "t";
reverseMapping[15] = "z";
reverseMapping[16] = "u";
reverseMapping[17] = "i";
reverseMapping[18] = "o";
reverseMapping[19] = "p";
reverseMapping[20] = "a";
reverseMapping[21] = "s";
reverseMapping[22] = "d";
reverseMapping[23] = "f";
reverseMapping[24] = "g";
reverseMapping[25] = "h";
reverseMapping[26] = "j";
reverseMapping[27] = "k";
reverseMapping[28] = "l";
reverseMapping[29] = "y";
reverseMapping[30] = "x";
reverseMapping[31] = "c";
reverseMapping[32] = "v";
reverseMapping[33] = "b";
reverseMapping[34] = "n";
reverseMapping[35] = "m";