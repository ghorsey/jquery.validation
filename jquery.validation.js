/*global define, console, jQuery*/
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
 * Version: 0.2.5
 * */

(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    "use strict";

    function splitName(name) {
        var i, result;
        if (name.indexOf("#") < 0) {
            result = [name];
        } else {
            i = name.indexOf("#");
            result = [
                name.substring(0, i),
                name.substring(i + 1)
            ];
        }
        return result;
    }

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
                            return ($(e).val() === "") ? true: re.test($(e).val());
                        }
                    },
                    confirm: {
                        name: "confirm",
                        validator: function (e, other) {
                            return $(e).val() === $(other).val();
                        }
                    },
                    pattern: {
                        name: "pattern",
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

                var parsed, result;

                parsed = this.parseRule(rule);

                if (typeof (parsed.rule.validator) === "function") {
                    result = parsed.rule.validator(e, parsed.arg);
                } else if (typeof (parsed.rule.validator) === "object" && parsed.rule.validator.test) {
                    result = this.settings.rules.pattern.validator(e, parsed.rule.validator);
                } else {
                    throw "cannot determine validator";
                }

                if (result && isLast) {
                    this.pass(e, parsed);
                } else if (!result) {
                    this.fail(e, parsed);
                }

                return result;
            },

            extractRule: function (fieldName, ruleName) {
                var rule, i, validation;

                validation = this.settings.validations[fieldName];
                if (!validation) { return; }

                if (validation.length) {
                    for (i = 0; i < validation.length; i += 1) {
                        if (validation[i].name && validation[i].name === ruleName) {
                            rule = validation[i];
                            break;
                        }
                    }
                } else if (this.settings.validations[fieldName].name && this.settings.validations[fieldName].name === ruleName) {
                    rule = this.settings.validations[fieldName];
                }

                return rule;
            },

            passValidation: function (fieldName, ruleName) {
                var rule = this.extractRule(fieldName, ruleName);
                if (!rule) { return; }

                this.pass($("#" + fieldName), rule);
            },

            failValidation: function (fieldName, ruleName) {
                var rule = this.extractRule(fieldName, ruleName);
                if (!rule) { return; }

                this.fail($("#" + fieldName), rule);
            },

            pass: function (e, rule) {
                var s = (rule.rule.success || rule.success || this.settings.success);
                if (s && typeof (s) === "function") {
                    s(e);
                }
            },

            fail: function (e, rule) {
                var failure, parsed;

                if (rule.rule) {
                    parsed = rule;
                } else {
                    parsed = this.parseRule(rule);
                }

                failure = parsed.rule.failure || this.settings.failure;
                if (failure && typeof (failure) === "function") {
                    failure(e, parsed.rule.message || this.settings.messages[parsed.messageKey] || "Invalid");
                }
            },

            bindFields: function () {
                function bindElement(e) {
                    e.data.that.runRules(e.currentTarget, e.data.that.settings.validations[e.data.key]);
                }

                var itm;

                for (itm in this.settings.validations) {
                    if (this.settings.validations.hasOwnProperty(itm)) {
                        $("#" + itm).bind("change", { that: this, key: itm }, bindElement);
                    }
                }
            },

            bind: function () {
                $(this.f).bind("submit", { that: this }, function (e) { return e.data.that.validate(); });

                this.bindFields();
            },

            parseRule: function (rule) {
                var ruleName, msgName, comparer, r = {};
                if (typeof (rule) === "string") {
                    ruleName = splitName(rule);
                    if (ruleName.length === 1) {
                        rule = this.settings.rules[rule];
                        msgName = rule.name;
                    } else {
                        rule = this.settings.rules[ruleName[0]];
                        msgName = rule.name;
                        if (ruleName[0] !== "pattern") {
                            comparer = "#" + ruleName[1];
                        } else {
                            comparer = new RegExp(ruleName[1]);
                            msgName = comparer.toString();
                        }
                    }
                }

                if (rule.name && rule.name.indexOf("#") < 0) {
                    $.extend(r, rule, this.settings.rules[rule.name]);
                    if (rule.validator) {
                        r.validator = rule.validator;
                    }

                    msgName = msgName || r.name;
                } else if (rule.name) {
                    ruleName = splitName(rule.name);
                    $.extend(r, rule, this.settings.rules[ruleName[0]]);
                    if (ruleName[0] !== "pattern") {
                        comparer = "#" + ruleName[1];
                        msgName = msgName || ruleName[0];
                    } else {
                        comparer = new RegExp(ruleName[1]);
                        msgName = msgName || ruleName[1];
                    }
                } else {
                    $.extend(r, rule);
                }

                return {
                    rule: r,
                    messageKey: msgName,
                    arg: comparer
                };
            }
        };

        return validator;
    };
}));
