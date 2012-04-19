/*global console, jQuery*/
/**  
 * The MIT License
 * 
 * Copyright (c) 2012 Geoff Horsey
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * Version: 0.1.4
 * */

(function ($) {
    "use strict";
    $.fn.validate = function (options) {
        var self = this, validator = {
            f: self,

            settings: $.extend(true, {
                validations: {},
                rules: {
                    required: {
                        name: "required",
                        validator: function (e) {
                            return $.trim($(e).val()) !== "";
                        }
                    },
                    email: {
                        name: "email",
                        validator: function (e) {
                            var re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            return re.test($(e).val());
                        }
                    },
                    confirm: {
                        name: "confirm",
                        validator: function (e, other) {
                            return $(e).val() === $(other).val();
                        }
                    },
                    regex: {
                        name: "regex",
                        validator: function (e, regex) {
                            return regex.test($(e).val());
                        }
                    }
                },

                messages: {
                    required: "the field is required",
                    email: "invalid email address",
                    confirm: "doesn't match the other field"
                },
                success: function (element) {
                    if (console && console.log) {
                        console.log("I was successful");
                    }
                },
                failure: function (element, message) {
                    if (console && console.error) {
                        console.error("Validation failed: " + message);
                    }
                }
            }, options),

            validate: function () {
                var result = true,
                    e,
                    itm,
                    rule;

                for (itm in this.settings.validations) {
                    if (this.settings.validations.hasOwnProperty(itm)) {
                        e = $("#" + itm);
                        rule = this.settings.validations[itm];

                        if (!this.runRules(e, rule)) {
                            result = false;
                        }
                    }
                }
                return result;
            },

            runRules: function (e, rules) {
                if (!rules) {
                    return true;
                }

                var result = true, idx;
                if (typeof (rules) === "object" && rules.length) { // array of rules
                    for (idx in rules) {
                        if (rules.hasOwnProperty(idx)) {
                            result = this.runRule(e, rules[idx], parseInt(idx, 10) === (rules.length - 1));
                            if (!result) { break; }
                        }
                    }
                } else {
                    result = this.runRule(e, rules, true);
                }

                return result;
            },

            runRule: function (e, rule, isLast) {

                var r = {}, comparer, v, result, s, failure, msgName;

                if (typeof (rule) === "string") {
                    if (rule.indexOf("#") < 0) {
                        rule = this.settings.rules[rule];
                        msgName = rule.name;
                    } else {
                        v = rule.split("#");
                        rule = this.settings.rules[v[0]];
                        msgName = rule.name;
                        if (v[0] !== "regex") {
                            comparer = "#" + v[1];
                        } else {
                            comparer = new RegExp(v[1]);
                            msgName = comparer.toString();
                        }
                    }
                }

                if (rule.name && rule.name.indexOf("#") < 0) {
                    $.extend(r, rule, this.settings.rules[rule.name]);
                    msgName = msgName || r.name;
                } else if (rule.name) {
                    v = rule.name.split("#");
                    $.extend(r, rule, this.settings.rules[v[0]]);
                    if (v[0] !== "regex") {
                        comparer = "#" + v[1];
                        msgName = msgName || v[0];
                    } else {
                        comparer = new RegExp(v[1]);
                        msgName = msgName || v[1];
                    }
                } else {
                    $.extend(r, rule);
                }

                if (typeof (r.validator) === "function") {
                    result = r.validator(e, comparer);
                } else if (typeof (r.validator) === "object" && r.validator.test) {
                    result = this.settings.rules.regex.validator(e, r.validator);
                } else {
                    throw "cannot determine validator";
                }

                if (result) {
                    s = (r.success || this.settings.success);
                    if (s && typeof (s) === "function" && isLast) {
                        s(e);
                    }
                } else {
                    failure = r.failure || this.settings.failure;
                    if (failure && typeof (failure) === "function") {
                        failure(e, r.message || this.settings.messages[msgName] || "Invalid");
                    }
                }

                return result;
            },

            bind: function () {

                $(this.f).bind("submit", {that: this}, function (e) { return e.data.that.validate(); });
                var $e, itm, binder = function (e) {
                    e.data.that.runRules(e.currentTarget, e.data.that.settings.validations[e.data.key]);
                };

                for (itm in this.settings.validations) {
                    if (this.settings.validations.hasOwnProperty(itm)) {
                        $e = $("#" + itm);
                        $e.bind("change", {that: this, key: itm}, binder);
                    }
                }
            }
        };

        return validator;
    };
}(jQuery));
