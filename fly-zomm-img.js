var flyZommImg = function(b, a) {
    this.options = a;
    this._this = b;
    this._activity = false;
    this._opts = {
        imgSum: 0,
        rollSpeed: 200,
        screenHeight: 165,
        showBoxSpeed: 300,
        urlProperty: false,
        miscellaneous: true,
        closeBtn: false,
        hideClass: false,
        imgQuality: "original",
        slitherCallback: function() {}
    }, this._init = function() {
        var c = this;
        c._defaluts();
        c._bind()
    }, this._defaluts = function() {
        var c = $.extend(this._opts, this.options || {});
        this.opts = c;
        return c
    }, this._bind = function() {
        var c = this;
        c._bindDom();
        $("body").on("click", ".fly-zoom-box", function(d) {
            c._hideBox()
        });
        $("body").on("click", ".fly-zoom-box-close", function(d) {
            c._hideBox();
            d.stopPropagation()
        });
        $("body").on("click", ".fly-zoom-box-restore", function(d) {
            c._imgRestore("tap");
            d.stopPropagation()
        });
        $("body").on("click", ".fly-zoom-box-zoomout", function(d) {
            c._zommImg(-100, 1);
            d.stopPropagation()
        });
        $("body").on("click", ".fly-zoom-box-zoom", function(d) {
            c._zommImg(100, 1);
            d.stopPropagation()
        });
        $("body").on("click", ".fly-zoom-box-img", function(d) {
            // c._imgRestore("tap");
            // d.stopPropagation()
        });
        $("body").on("click", ".fly-zoom-box-tool", function(d) {
            d.stopPropagation()
        });
        $("body").on("click", ".fly-zoom-box-label", function(f) {
            var d = $(this);
            var h = d.html();
            if(h && c.groups && c.groups[c.group_name]) {
                c.group_name = h;
                c.opts.imgSum = c.groups[c.group_name].length;
                c.opts.img_index = 0;
                $(".fly-zoom-box-fix").html(1);
                $(".fly-zoom-box-length").html(c.opts.imgSum);
                if(c.opts.urlProperty) {
                    var g = c.groups[c.group_name][0].dom.data(c.opts.urlProperty)
                } else {
                    var g = c.groups[c.group_name][0].dom.attr("src")
                }
                $(".fly-zoom-box-img").attr("src", g);
                $(".fly-zoom-box-label").css({
                    "background": "",
                    "color": "#666"
                });
                d.css({
                    "background": "rgba(62,69,80,1)",
                    "color": "#fff"
                });
                c.oWidth = c.oHeight = null;
                c._imgRestore("oneSwitcher", c.groups[c.group_name][0].dom);
                c.onPinch = c.onRotate = null
            }
            f.stopPropagation()
        })
    }, this._bindDom = function() {
        var f = this;
        f.opts.imgSum = 0;
        f.opts.img_index = 1;
        f.groups = [];
        f.group_names = [];
        f.group_show = false;
        f._this.find("img").each(function(h) {
            var g = $(this);
            if((f.opts.hideClass && !g.hasClass(f.opts.hideClass)) || !f.opts.hideClass) {
                var i = g.data("group");
                if(i) {
                    if(!f.groups[i]) {
                        f.group_names.push(i);
                        f.groups[i] = []
                    }
                    f.groups[i].push({
                        "dom": g
                    });
                    f.group_show = true
                }
                if(!f.group_show) {
                    g.data("index", f.opts.imgSum);
                    f.opts.imgSum += 1
                }
            }
        });
        if(f.group_show) {
            var e = f.group_names;
            for(var d = 0; d < e.length; d++) {
                for(var c = 0; c < f.groups[e[d]].length; c++) {
                    f.groups[e[d]][c].dom.attr("data-index", c)
                }
            }
        }
        this._this.find("img").on("click", function() {
            var g = $(this);
            if((f.opts.hideClass && !g.hasClass(f.opts.hideClass)) || !f.opts.hideClass) {
                f._flyBoxHtml(g);
                f._imgRestore("oneSwitcher", g);
                $("body").on("touchmove", function(h) {
                    h.preventDefault()
                });
                f._touchBind(f);
                if(f._activity) {
                    f.opts.slitherCallback("firstClick", g)
                }
            }
        })
    }, this._reload = function() {
        $("body").unbind("touchmove");
        this._this.find("img").unbind("click");
        this._moveUnBind();
        this._bindDom()
    }, this._flyBoxHtml = function(j) {
        var c = parseInt(j.data("index"));
        if(this.group_show) {
            this.group_name = j.data("group");
            this.opts.imgSum = this.groups[this.group_name].length;
            this.opts.img_index = c
        }
        var f = this.opts.imgSum;
        if(this.opts.urlProperty) {
            var h = j.data(this.opts.urlProperty)
        } else {
            var h = j.attr("src")
        }
        var e = "";
        e += "<div class='fly-zoom-box' style='touch-action: none;display: none;-webkit-tap-highlight-color:rgba(255,255,255,0);cursor: pointer;position: fixed;z-index: 9999;width:100% ;height:100% ;background: rgba(20,20,20,1);top:0 ;bottom: 0;right:0 ;left:0 ;'>" + "<div class='fly-zoom-box-number' style='touch-action: none;z-index: 999999;position: absolute;top: 0;padding: 20px 0 ;line-height: 26px;color: #ddd;font-size: 14px;width: 100%;text-align: center;'><span style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 0px 6px'><span class='fly-zoom-box-fix'>" + (c + 1) + "</span>/<span class='fly-zoom-box-length'>" + f + "</span></span></div>" + "<div class='fly-zoom-box-main' style='touch-action: none;z-index: auto;position: relative;width: 100%;height: 100%;overflow: auto'><img class='fly-zoom-box-img' data-index='" + c + "' style='touch-action: none;display: block;width: 100%;position: absolute;' src='" + h + "'></div>";
        if(this.opts.closeBtn) {
            e += "<div class='fly-zoom-box-close' style='touch-action: none;text-align: center;z-index: 99999999;position: absolute;top: 11px;color: #ddd;font-size: 26px;right: 14px;'>×</div>"
        }
        if(this.opts.miscellaneous && this.group_names.length == 0) {
            e += "<div class='fly-zoom-box-tool' style='touch-action: none;z-index: 999999;position: absolute;bottom: 10px;padding: 10px 0 ;width: 200px;line-height: 26px;color: #ddd;font-size: 14px;margin: 0 auto;right: 0;left: 0;text-align: center;background: rgba(20,20,20,0.3);border-radius: 50px'><span class='fly-zoom-box-zoomout' style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 0px 6px'>－</span><span class='fly-zoom-box-restore' style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 2px 6px;margin: 0  0 0 10px '>还原</span><span class='fly-zoom-box-close' style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 2px 6px;margin: 0 10px'>关闭</span><span class='fly-zoom-box-zoom' style='background: rgba(255,255,255,0.2);border-radius: 15px;color: #fff;padding: 0px 6px'>＋</span></div>"
        }
        if(this.group_names.length > 0 && this.opts.miscellaneous) {
            e += "<div class='fly-zoom-box-tool' style='touch-action: none;text-align: center;z-index: 999999;position: absolute;bottom: 10px;padding: 10px 0 ;line-height: 26px;color: #ddd;font-size: 12px;margin: 0 auto;right: 0;left: 0;background: rgba(20,20,20,0.3);'>";
            var g = this.group_names;
            for(var d = 0; d < g.length; d++) {
                e += "<span class='fly-zoom-box-label' style='width: max-content;border-radius: 5px;display: inline-block;";
                if(g[d] == this.group_name) {
                    e += "background: rgba(62,69,80,1);color: #fff;"
                } else {
                    e += "color: #666;"
                }
                e += "padding: 2px 9px;margin: 5px 10px 0 10px'>" + g[d] + "</span>"
            }
        }
        e += "</div>";
        $("body").append(e);
        this._showBox()
    }, this._hideBox = function() {
        $(".fly-zoom-box").hide(this._opts.showBoxSpeed, "linear", function() {
            $(this).remove()
        });
        $("body").unbind("touchmove");
        if(this._activity) {
            this.opts.slitherCallback("close", $(".fly-zoom-box-img"))
        }
        this._moveUnBind();
        this._activity = false
    }, this._showBox = function() {
        this._activity = true;
        $(".fly-zoom-box").show(this._opts.showBoxSpeed)
    }, this._rightMove = function() {
        var e = this;
        if(e.group_show) {
            var c = e.opts.img_index + 1;
            var d = e.opts.imgSum;
            if(c >= d) {
                c = 0
            }
            e.opts.img_index = c;
            var g = e.groups[e.group_name][c].dom
        } else {
            var c = parseInt($(".fly-zoom-box-img").attr("data-index"));
            c = c + 1;
            var d = this.opts.imgSum;
            if(c >= d) {
                c = 0
            }
            var g = "";
            this._this.find("img").each(function() {
                var h = $(this);
                if(h.data("index") == c) {
                    g = h;
                    return false
                }
            })
        }
        $(".fly-zoom-box-fix").html(c + 1);
        $(".fly-zoom-box .fly-zoom-box-img").animate({
            left: "-200%"
        }, e._opts.rollSpeed, "linear", function() {
            $(this).remove()
        });
        if(e.opts.urlProperty) {
            var f = g.data(e.opts.urlProperty)
        } else {
            var f = g.attr("src")
        }
        $(".fly-zoom-box-main").append("<img class='fly-zoom-box-img' data-index='" + c + "'  style='left:100%;display: block;position: absolute;' src='" + f + "'>");
        e._imgRestore("chage", g);
        $(".fly-zoom-box-img").animate({
            left: "0%"
        }, e._opts.rollSpeed, "linear", function() {
            e._touchBind(e);
            e._imgRestore("switcher", g)
        });
        this._moveUnBind(c);
        if(this._activity) {
            this.opts.slitherCallback("left", g)
        }
    }, this._leftMove = function() {
        var e = this;
        if(e.group_show) {
            var c = e.opts.img_index - 1;
            var d = e.opts.imgSum;
            if(c < 0) {
                c = (d - 1)
            }
            e.opts.img_index = c;
            var g = e.groups[e.group_name][c].dom
        } else {
            var c = parseInt($(".fly-zoom-box-img").attr("data-index"));
            c = c - 1;
            var d = this.opts.imgSum;
            if(c < 0) {
                c = (d - 1)
            }
            var g = "";
            this._this.find("img").each(function() {
                var h = $(this);
                if(h.data("index") == c) {
                    g = h;
                    return false
                }
            })
        }
        $(".fly-zoom-box-fix").html(c + 1);
        $(".fly-zoom-box-main .fly-zoom-box-img").animate({
            left: "200%"
        }, e._opts.rollSpeed, "linear", function() {
            $(this).remove()
        });
        if(e.opts.urlProperty) {
            var f = g.data(e.opts.urlProperty)
        } else {
            var f = g.attr("src")
        }
        $(".fly-zoom-box-main").append("<img class='fly-zoom-box-img' data-index='" + c + "'  style='right:100%;display: block;position: absolute;' src='" + f + "'>");
        e._imgRestore("chage", g);
        $(".fly-zoom-box-img").animate({
            right: "0%"
        }, e._opts.rollSpeed, "linear", function() {
            e._touchBind(e);
            e._imgRestore("switcher", g)
        });
        this._moveUnBind();
        if(e._activity) {
            this.opts.slitherCallback("right", g)
        }
    }, this._moveUnBind = function() {
        $("body").unbind("touchstart");
        $("body").unbind("touchend")
    }, this._touchBind = function(c) {
        var e, d;
        $("body").on("touchstart", function(i) {
            var f = i.originalEvent.touches ? i.originalEvent.touches[0] : i;
            c.startX = f.pageX;
            c.startY = f.pageY;
            window.clearTimeout(c.longTapTimeout);
            if(i.originalEvent.touches.length > 1) {
                var g = i.originalEvent.touches[1];
                var j = Math.abs(g.pageX - c.startX);
                var h = Math.abs(g.pageY - c.startY);
                c.touchDistance = c._getDistance(j, h);
                c.touchVector = {
                    x: g.pageX - c.startX,
                    y: g.pageY - c.startY
                }
            } else {
                c.startTime = c._getTime();
                c.longTapTimeout = setTimeout(function() {
                    c._emitEvent("longtap")
                }, 800);
                if(c.previousTouchPoint) {
                    if(Math.abs(c.startX - c.previousTouchPoint.startX) < 10 && Math.abs(c.startY - c.previousTouchPoint.startY) < 10 && Math.abs(c.startTime - c.previousTouchTime) < 500) {
                        c._emitEvent("doubletap")
                    }
                }
                c.previousTouchTime = c.startTime;
                c.previousTouchPoint = {
                    startX: c.startX,
                    startY: c.startY
                }
            }
        });
        $("body").on("touchmove", function(o) {
            var p = c._getTime();
            if(o.originalEvent.touches.length > 1) {
                if(c.touchVector) {
                    var g = {
                        x: o.originalEvent.touches[1].pageX - o.originalEvent.touches[0].pageX,
                        y: o.originalEvent.touches[1].pageY - o.originalEvent.touches[0].pageY
                    };
                    var k = c._getRotateAngle(g, c.touchVector);
                    if(k > 30) {
                        c._emitEvent("rotate");
                        c.touchVector.x = g.x;
                        c.touchVector.y = g.y
                    } else {
                        var j = Math.abs(o.originalEvent.touches[0].pageX - o.originalEvent.touches[1].pageX);
                        var f = Math.abs(o.originalEvent.touches[1].pageY - o.originalEvent.touches[1].pageY);
                        var n = c._getDistance(j, f);
                        if(c.touchDistance) {
                            var h = n / c.touchDistance;
                            var i = h - c.previousPinchScale;
                            c._emitEvent("pinch", {
                                scale: i
                            });
                            c.previousPinchScale = h
                        }
                    }
                }
            } else {
                window.clearTimeout(c.longTapTimeout);
                var q = o.originalEvent.touches ? o.originalEvent.touches[0] : o;
                var m = c.moveX === null ? 0 : q.pageX - c.moveX;
                var l = c.moveY === null ? 0 : q.pageY - c.moveY;
                c._emitEvent("move", {
                    "deltaX": m,
                    "deltaY": l
                });
                c.moveX = q.pageX;
                c.moveY = q.pageY
            }
            o.preventDefault()
        });
        $("body").on("touchend", function(g) {
            window.clearTimeout(c.longTapTimeout);
            var f = c._getTime();
            e = c.moveX - c.startX;
            d = c.moveY - c.startY;
            if(c.moveX !== null && Math.abs(e) > 10 || c.moveY !== null && Math.abs(d) > 10) {
                if(Math.abs(e) > Math.abs(d) && e > 70) {
                    c._emitEvent("left")
                } else {
                    if(Math.abs(e) > Math.abs(d) && e < -70) {
                        c._emitEvent("right")
                    } else {
                        if(Math.abs(d) > Math.abs(e) && d > 70) {
                            c._emitEvent("bottom")
                        } else {
                            if(Math.abs(d) > Math.abs(e) && d < -70) {
                                c._emitEvent("top")
                            } else {
                                if(f - c.startTime < 500) {
                                    c._emitEvent("swipe")
                                }
                            }
                        }
                    }
                }
            } else {
                if(f - c.startTime < 2000) {
                    if(f - c.startTime < 500) {
                        c._emitEvent("tap")
                    }
                }
            }
            c._emitEvent("touchend")
        })
    }, this._zommImg = function(y, c) {
        if(c <= 0) {
            if(isNaN(y) || Math.abs(y) > 0.2 || Math.abs(y) < 0.02) {
                return false
            }
        }
        var l = $(".fly-zoom-box-img");
        var k = l.width();
        var v = l.height();
        var f = window.screen.width;
        var z = window.screen.height - this._opts.screenHeight;
        if(c <= 0) {
            y = y * 2;
            var i = k + k * y;
            var r = v + v * y;
            var g = (f - i) / 2;
            var s = (z - r) / 2
        } else {
            var i = k + y;
            var r = v * (i / k);
            // if(i < f) {
            //     return false
            // }
            if(y > 0) {
                this.onPinch = true
            }
            var g = (f - i) / 2;
            var s = (z - r) / 2
        }
        var e = "";
        var d = "";
        if(this._opts.imgQuality == "original") {
            e = l[0].naturalWidth;
            d = l[0].naturalHeight
        } else {
            e = l[0].width;
            d = l[0].height
        }
        var q = document.body.offsetWidth;
        var m = 50;
        var j = (z - d) / 2;
        if(j <= m) {
            j = 70
        }
        var u = e;
        var p = d;
        var x = q / u;
        var t = u / p;
        if(t < 1) {
            var n = z / d * 0.8;
            u = u * n;
            p = p * n;
            if(u < (f * 0.75)) {
                u = u * (1 - u / (f * 0.75) + 1);
                p = p * (1 - p / (z * 0.75) + 1)
            }
            x = 1
        }
        // if(i < u * x) {
        //     console.log(5555)
        //     return false
        // }
        l.width(i);
        l.height(r);
        l.css({
            "top": s + "px",
            "left": g + "px"
        });
        return l
    }, this._getTime = function() {
        return new Date().getTime()
    }, this._getDistance = function(d, c) {
        return Math.sqrt(d * d + c * c)
    }, this._getRotateDirection = function(d, c) {
        return d.x * c.y - c.x * d.y
    }, this._getRotateAngle = function(i, g) {
        var j = this._getRotateDirection(i, g);
        j = j > 0 ? -1 : 1;
        var e = this._getDistance(i.x, i.y);
        var d = this._getDistance(g.x, g.y);
        var f = e * d;
        if(f === 0) {
            return 0
        }
        var c = i.x * g.x + i.y * g.y;
        var h = c / f;
        if(h > 1) {
            h = 1
        }
        if(h < -1) {
            h = -1
        }
        return Math.acos(h) * j * 180 / Math.PI
    }, this._setNumber = function(k, i, h, m, l) {
        var j;
        var p;
        if(k) {
            if(this._opts.imgQuality == "original") {
                j = k[0].naturalWidth;
                p = k[0].naturalHeight
            } else {
                j = k[0].width;
                p = k[0].height
            }
        }
        var c = (h - p) / 2;
        if(c <= m) {
            c = 70
        }
        var n = j;
        var d = p;
        var g = l / n;
        var f = n / d;
        if(f < 1) {
            var e = h / p * 0.8;
            n = n * e;
            d = d * e;
            if(n < (i * 0.75)) {
                n = n * (1 - n / (i * 0.75) + 1);
                d = d * (1 - d / (h * 0.75) + 1)
            }
            g = 1
        }
        return {
            "per": g,
            "dwidth": n,
            "dheight": d,
            "ch": c
        }
    }, this._imgRestore = function(m, j) {
        var l = this;
        l.cdomthis = j;
        var f = $(".fly-zoom-box-img");
        var g = window.screen.width;
        var e = window.screen.height - l._opts.screenHeight;
        var o = (g - l.oWidth) / 2;
        var i = (e - l.oHeight) / 2;
        var k = document.body.offsetWidth;
        var d = document.body.offsetHeight;
        var n = 50;
        if(m == "tap") {
            f.css({
                "top": l.oTop + "px",
                "width": l.oWidth + "px",
                "height": l.oHeight + "px",
                "margin": "0 auto",
                "right": "0%",
                "left": "0%"
            });
            l.onPinch = l.onRotate = null
        } else {
            if(m == "chage") {
                var c = l._setNumber(j, g, e, n, k);
                f.css({
                    "top": c.ch + "px",
                    "width": c.dwidth * c.per + "px",
                    "height": c.dheight * c.per + "px",
                    "margin": "0 auto"
                });
                l.oTop = c.ch;
                l.oWidth = c.dwidth * c.per;
                l.oHeight = c.dheight * c.per
            } else {
                if(m == "touchend") {
                    if(f.width() < l.oWidth) {
                        var c = l._setNumber(j, g, e, n, k);
                        f.animate({
                            "top": c.ch + "px",
                            "width": c.oWidth + "px",
                            "height": c.oHeight + "px",
                            "margin": "0 auto",
                            "right": "0%",
                            "left": "0%"
                        }, 80, "linear", function() {
                            l.onPinch = l.onRotate = null
                        })
                    }
                } else {
                    if(m == "switcher" || m == "oneSwitcher") {
                        if(m == "oneSwitcher") {
                            var c = l._setNumber(j, g, e, n, k);
                            f.css({
                                "top": c.ch + "px",
                                "width": c.dwidth * c.per + "px",
                                "height": c.dheight * c.per + "px",
                                "margin": "0 auto",
                                "right": "0%",
                                "left": "0%"
                            });
                            l.oTop = c.ch;
                            l.oWidth = c.dwidth * c.per;
                            l.oHeight = c.dheight * c.per
                        } else {
                            f.css({
                                "right": "0%",
                                "left": "0%"
                            })
                        }
                    }
                }
            }
        }
    }, this._emitEvent = function(d, j) {
        var i = this;
        switch(d) {
            case "tap":
                break;
            case "doubletap":
                i.onDoubletap = true;
                break;
            case "longtap":
                i.onLongtap = true;
                break;
            case "swipe":
                i.onSwipe = true;
                break;
            case "move":
                if(i.onPinch) {
                    i.onMove = true;
                    var e = $(".fly-zoom-box-img");
                    var h = parseInt(e.css("top"));
                    var g = parseInt(e.css("left"));
                    var c = h + j.deltaY;
                    var f = g + j.deltaX;
                    e.css({
                        "top": c + "px",
                        "left": f + "px"
                    })
                }
                break;
            case "pinch":
                i.onPinch = true;
                i.isPinch = true;
                i._zommImg(j.scale, 0);
                break;
            case "rotate":
                i.isRotate = true;
                i.onRotate = true;
                break;
            case "left":
                if(!i.onPinch && !i.onRotate) {
                    i.onLeft = true;
                    i._leftMove()
                }
                break;
            case "right":
                if(!i.onPinch && !i.onRotate) {
                    i.onRight = true;
                    i._rightMove()
                }
                break;
            case "top":
                if(!i.onPinch && !i.onRotate) {
                    i.onTop = true
                }
                break;
            case "bottom":
                if(!i.onPinch && !i.onRotate) {
                    i.onBottom = true
                }
                break;
            case "touchend":
                i._imgRestore("touchend", i.cdomthis);
                i.isPinch = i.isRotate = i.startX = i.startY = i.moveX = i.moveY = i.touchDistance = null;
                i.previousPinchScale = 1;
                break
        }
    }
};
$.fn.FlyZommImg = function(a) {
    var b = new flyZommImg(this, a);
    b._init();
    return b
};