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
      validator: validator function // required
      message: "error message" // optional
      success: success function // optional
      failure: failure function // optional
    }

validations
---
    {
      formElementId: [rule || "ruleName", ..] || rule || "ruleName", ...
    }


Example usage
===
[http://project-rails-edge.herokuapp.com/register] (http://project-rails-edge.herokuapp.com/register)

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
