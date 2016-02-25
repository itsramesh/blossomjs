if (typeof Array.prototype.indexOf !== "function") {
    Array.prototype.indexOf = function (item) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === item) {
                return i;
            }
        }
        return -1;
    };
}

window.blossom = function () {
    function Blossom(elements) {
        for (var i = 0, j = elements.length; i < j; i++) {
            this[i] = elements[i];
        }
        this.length = elements.length;
    }

    Blossom.prototype.each = function (callback) {
        this.map(callback);
        return this;
    };

    Blossom.prototype.map = function (callback) {
        var results = [], i = 0;
        for (; i < this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }
        return results;
    };

    Blossom.prototype.mapOne = function (callback) {
        return this.map(callback).length > 1 ? this.map(callback) : this.map(callback)[0];
    };

    Blossom.prototype.text = function (text) {
        if (typeof text !== "undefined") {
            return this.each(function (element) {
                element.innerText = text;
            });
        } else {
            return this.mapOne(function (element) {
                return element.innerText;
            });
        }
    };

    Blossom.prototype.html = function (html) {
        if (typeof html !== "undefined") {
            return this.each(function (element) {
                element.innerHTML = html;
            });
        } else {
            return this.mapOne(function (element) {
                return element.innerHTML;
            });
        }
    };

    Blossom.prototype.addClass = function (classes) {
        var className = "";
        if (typeof classes !== "string") {
            for (var i = 0; i < classes.length; i++) {
                className += " " + classes[i];
            }
        } else {
            className = " " + classes;
        }
        return this.each(function (element) {
            element.className += className;
        });
    };

    Blossom.prototype.removeClass = function (clasz) {
        return this.each(function (element) {
            var cls = element.className.split(" "), i;

            while ((i = cls.indexOf(clasz)) > -1) {
                cls = cls.slice(0, i).concat(cls.slice(++i));
            }
            element.className = cls.join(" ")
        });
    };

    Blossom.prototype.hasClass = function (clasz) {
        var returnVal;
        this.each(function (element) {
            returnVal = !(element.className.search(clasz) === -1);
        });
        return returnVal;
    };

    Blossom.prototype.attr = function (attr, val) {
        if (typeof  val !== "undefined") {
            return this.each(function (element) {
                element.setAttribute(attr, val);
            });
        } else {
            return this.mapOne(function (element) {
                return element.getAttribute(attr);
            });
        }
    };

    Blossom.prototype.scrollTo = function (duration) {
        var bodyElement = document.body, to;

        this.each(function (element) {
            to = element.offsetTop;
        });

        function scrollFunction (to, duration) {
            if (duration < 0) return;
            var difference = to - bodyElement.scrollTop;
            var perTick = difference / duration * 10;
            var scrollTop = bodyElement.scrollTop;
            if (difference >= 0) {
                setTimeout(function () {
                    bodyElement.scrollTop = scrollTop + perTick;
                    if (bodyElement.scrollTop === to) return;
                    scrollFunction(to, duration - 10);
                }, 10);
            } else {
                setTimeout(function () {
                    bodyElement.scrollTop = scrollTop + perTick;
                    if (bodyElement.scrollTop <= to) return;
                    scrollFunction(to, duration - 10);
                }, 10)
            }
        }
        scrollFunction(to, duration);
    };

    Blossom.prototype.append = function (elements) {
        return this.each(function (parentElement, i) {
            elements.each(function (childElement) {
                if (i > 0) {
                    childElement = childElement.cloneNode(true);
                }
                parentElement.appendChild(childElement);
            });
        });
    };

    Blossom.prototype.prepend = function (elements) {
        return this.each(function (parentElement, i) {
            for (var j = elements.length - 1; j > -1; j--) {
                parentElement.insertBefore(( i > 0 ) ? elements[j].cloneNode(true) : elements[j], parentElement.firstChild);
            }
        });
    };

    Blossom.prototype.remove = function () {
        return this.each(function (element) {
            return element.parentNode.removeChild(element);
        });
    };

    Blossom.prototype.on = (function () {
        if (document.addEventListener) {
            return function (event, fn) {
                return this.each(function (element) {
                    element.addEventListener(event, fn, false);
                });
            };
        } else if (document.attachEvent) {
            return function (event, fn) {
                return this.each(function (element) {
                    element.attachEvent('on' + event, fn);
                });
            };
        } else {
            return function (event, fn) {
                return this.each(function (element) {
                    element['on' + event] = fn;
                });
            };
        }
    })();

    Blossom.prototype.off = (function () {
        if (document.removeEventListener) {
            return function (event, fn) {
                return this.each(function (element) {
                    element.removeEventListener(event, fn, false);
                });
            };
        } else if (document.detachEvent) {
            return function (event, fn) {
                return this.each(function (element) {
                    element.detachEvent('on' + event, fn);
                });
            };
        } else {
            return function (event, fn) {
                return this.each(function (element) {
                    element['on' + event] = null;
                });
            };
        }
    })();

    var blossom = {
        get: function (selector) {
            var elements;
            if (typeof selector === "string") {
                elements = document.querySelectorAll(selector);
            } else if (selector.length) {
                elements = selector;
            } else {
                elements = [selector];
            }
            return new Blossom(elements);
        },
        create: function (tagName, attrs) {
            var element = new Blossom([document.createElement(tagName)]);
            if (attrs) {
                if (attrs.className) {
                    element.addClass(attrs.className);
                    delete attrs.className;
                }
                if (attrs.text) {
                    element.text(attrs.text);
                    delete attrs.text;
                }
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        element.attr(key, attrs[key]);
                    }
                }
            }
            return element;
        }
    };

    return blossom;
}();