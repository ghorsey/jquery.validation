jquery.validation
===
Most form validation plugins try to modify the page in some way to display error
messages, which usually ends up being a pain in the ass.  I decided to create a 
simple form validation component which doesn't muck with the page html in any way.

Here it is, enjoy.

Usage
===
    var validator = $("#form").validator({ options })
    validator.bind();

Options
===
    {
      validations: validations,
      rules: { name: rule, ...},
      messages: {
        ruleName: "error message"
      },
      success: success function, // default function when missing on rule
      failure: failure function, // default function when missing on rule
    }

success function
---
    function (e, isLast) // e = form element; isLast = is the last rule for this element

failure function
---
    function (e, msg) // e = form element; msg = error message

validator function
---
    function (e, arg) // e = form element; arg = optional function argument

rule
---
    {
      name: "name", //optional 
      validator: validator function || RexExp // required
      message: "error message" // optional
      success: success function // optional
      failure: failure function // optional
    }

validations
---
    {
      formElementId: [rule || "ruleName", ..] || rule || "ruleName", ...
    }

regular expression validators
---
You can specify a regular rule by setting the validator of the rule to a regular expression.

You can also specify a regular expression as a bare string rule using the following format:

    "regex#pattern"

An example is:

    "regex#^[a-zA-Z0-9\\-\\._]{3,}$"

If you want to specify a custom message for the regex rule when using the bare stirng syntax, set a
message name as a string representation of the regex literal: 

    messages: { "/^[a-zA-Z0-9\\-\\._]{3,}$/" : "oops i did it again!" },

default validators
---
 * email: can use the string `"email"` as the rule to run an email validation on a field: `{ emailInput: "email" }`
 * confirm: can use the string `"confirm#againstId"` to make sure the field has the same value as the `#againstId`: `{ "password-conf": "confirm#password" }`

Example usage
===
    var validator = $("#frm-register").validate({
      success: function (e, isLast) {
        if (!isLast) { return; }
        revealInvisible.hide(self.findFieldError(e));
        self.setActivity(e, "good");
      },
      failure: function (e, m) {
        revealInvisible.show(self.findFieldError(e)).html(m);
        self.setActivity(e, "bad");
      },
      // shows how to set a message w/ using a RegExp as the name of the rule:
      //messages: { "/^[a-zA-Z0-9\\-\\._]{3,}$/" : "oops i did it again!" },
      validations: {
        name: [
          {
            message: "must a mix of at least 3 letters, numbers, dots (.), dashes [-], or underscores [_]",
            validator: /^[a-zA-Z0-9\-\._]{3,}$/
          },
          // shows how to use a regexp rule as just a name:
          //"regex#^[a-zA-Z0-9\\-\\._]{3,}$",
          {
            message: "name is in use",
            validator: this.checkName // matches the validator function signature
          }
        ],
        email: [
          "email",
          {
            message: "email is in use",
            validator: this.checkEmail // matches the validator function signature
          }
        ],
        // here we use the default required rule, but override the message value, when 
        // overrideing an default validator, you do not need to specify the validator function
        pword: {
          name: "required",
          message: "password is required"
        },
        "conf-pword": [
          // the next line shows how you can use the default require validator w/ it's default message:
          //"required", 
          {
            name: "required",
            message: "confirm is required"
          },
          {
            name: "confirm#pword",
            message: "passwords do not match"
          }
        ]
      }
    });

taken from: [http://project-rails-edge.herokuapp.com/register] (http://project-rails-edge.herokuapp.com/register)

The MIT License
=== 
 Copyright (c) 2011 Geoff Horsey
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
