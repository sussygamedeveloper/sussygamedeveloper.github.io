/* Button object (James) */
/* Copyright (c) 1996-2016 Clickteam
 *
 * This source code is part of the HTML5 or Windows10 exporter for Clickteam Multimedia Fusion 2.
 *
 * Permission is hereby granted to any person obtaining a legal copy
 * of Clickteam Multimedia Fusion 2 to use or modify this source code for
 * debugging, optimizing, or customizing applications created with
 * Clickteam Multimedia Fusion 2.
 * Any other use of this source code is prohibited.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
CRunKcButton.BTNTYPE_PUSHTEXT = 0;
CRunKcButton.BTNTYPE_CHECKBOX = 1;
CRunKcButton.BTNTYPE_RADIOBTN = 2;
CRunKcButton.BTNTYPE_PUSHBITMAP = 3;
CRunKcButton.BTNTYPE_PUSHTEXTBITMAP = 4;
CRunKcButton.ALIGN_ONELINELEFT = 0;
CRunKcButton.ALIGN_CENTER = 1;
CRunKcButton.ALIGN_CENTERINVERSE = 2;
CRunKcButton.ALIGN_ONELINERIGHT = 3;
CRunKcButton.BTN_HIDEONSTART = 0x0001;
CRunKcButton.BTN_DISABLEONSTART = 0x0002;
CRunKcButton.BTN_TEXTONLEFT = 0x0004;
CRunKcButton.BTN_TRANSP_BKD = 0x0008;
CRunKcButton.BTN_SYSCOLOR = 0x0010;

CRunKcButton.BITMAP_NULL = -1;
CRunKcButton.BITMAP_NORMAL = 0;
CRunKcButton.BITMAP_PRESSED = 1;
CRunKcButton.BITMAP_DISABLED = 2;

function CRunKcButton() {
    //call chain
    CRunControl.call(this);

    //call self
    this.type = null;
    this.flags = 0;
    this.align = CRunKcButton.ALIGN_ONELINELEFT;
    this.tooltip = '';
    this.label = '';

    this.backgroundColor = null;
    this.foregroundColor = null;

    this.clickedEvent = -1;
    this.checked = false;
    this.enabled = true;
    this.visible = true;
    this.over = false;
    this.held = false;
    this.bitmapDown = false;
    this.textOnLeft = false;

    this.images = null;
    this.options = null;

    this.labelContainerElement = null;
    this.labelElement = null;
    this.inputContainerElement = null;
    this.inputElement = null;
    this.imageElement = null;
    this.spacerElement = null;

    this.imageIndex = CRunKcButton.BITMAP_NULL;
    this.imageIndexRaw = CRunKcButton.BITMAP_NULL;
};

CRunKcButton.prototype = {
    //fusion
    getNumberOfConditions: function () {
        return 6;
    },

    createRunObject: function (file, cob, version) {
        //read some properties
        this.ho.hoImgWidth = file.readAShort();
        this.ho.hoImgHeight = file.readAShort();
        this.type = file.readAShort();
        var optionsCount = file.readAShort();

        this.flags = file.readAInt();
        this.textOnLeft = (this.flags & CRunKcButton.BTN_TEXTONLEFT) != 0;

        //read font
        var fontInfo = file.readLogFont();

        //read colors
        var foregroundColor = file.readAColor();
        var backgroundColor = file.readAColor();

        //do we have images to load
        this.images = new Array(3);
        for (var i = 0; i < 3; ++i) {
            this.images[i] = file.readAShort();
        }

        if (this.type == CRunKcButton.BTNTYPE_PUSHBITMAP || this.type == CRunKcButton.BTNTYPE_PUSHTEXTBITMAP) {
            this.ho.loadImageList(this.images);
        }

        if (this.type == CRunKcButton.BTNTYPE_PUSHBITMAP) {
            this.ho.hoImgWidth = 1;
            this.ho.hoImgHeight = 1;

            for (var i = 0; i < CRunKcButton.BITMAP_DISABLED; ++i) {
                var image = this.ho.hoAdRunHeader.rhApp.imageBank.getImageFromHandle(this.images[i]);

                if (image) {
                    this.ho.hoImgWidth = Math.max(this.ho.hoImgWidth, image.width);
                    this.ho.hoImgHeight = Math.max(this.ho.hoImgHeight, image.height);
                }
            }
        }

        //skip stuff
        file.readAShort(); // fourth word in img array
        file.readAInt(); // ebtnSecu

        //get text alignment
        this.align = file.readAShort();

        //create element based on button type
        var element;

        switch (this.type) {
            case CRunKcButton.BTNTYPE_RADIOBTN:
                //calcualte some values
                var idPrefix = 'FusionRunControlKcButtonRadio' + this.ho.hoHFII + '_';
                var classPrefix = 'fusionRunControlKcButtonRadio';
                var group = 'FusionRunControlKcButtonRadioGroup' + this.ho.hoHFII;
                var inputId;
                var option;
                var label;

                //create group container
                element = document.createElement('div');
                element.className = 'fusionRunControlKcButton ' + classPrefix + ' ' + classPrefix + (this.textOnLeft ? 'AlignRight' : 'AlignLeft');

                //prepare arrays
                this.options = new Array(optionsCount);

                //create each radio option
                for (var i = 0; i < this.options.length; ++i) {
                    //create option
                    option = new CRunKcButtonRadioOption();
                    this.options[i] = option;

                    //get button text
                    label = file.readAString();

                    //get input id
                    inputId = idPrefix + i;

                    //create container
                    option.containerElement = document.createElement('span');
                    option.containerElement.className = classPrefix + 'Container';
                    element.appendChild(option.containerElement);

                    //create label
                    option.labelContainerElement = document.createElement('label');
                    option.labelContainerElement.className = classPrefix + 'LabelContainer';
                    option.labelContainerElement.setAttribute('for', inputId);
                    option.containerElement.appendChild(option.labelContainerElement);

                    option.labelElement = document.createElement('span');
                    option.labelElement.className = classPrefix + 'Label';

                    //create input
                    option.inputContainerElement = document.createElement('span');
                    option.inputContainerElement.className = classPrefix + 'InputContainer';

                    option.inputElement = document.createElement('input');
                    option.inputElement.className = classPrefix + 'Input';
                    option.inputElement.setAttribute('name', group);
                    option.inputElement.type = 'radio';
                    option.inputElement.id = inputId;
                    option.inputContainerElement.appendChild(option.inputElement);

                    //let runtime theme the element
                    Runtime.onThemeElement(option.inputElement, CRuntime.THEME_ELEMENT_RADIO);

                    //add in correct order
                    option.labelContainerElement.appendChild(option.inputContainerElement);
                    option.labelContainerElement.appendChild(option.labelElement);

                    //set initial states
                    option.changeLabel(label);
                    if ((this.flags & CRunKcButton.BTN_SYSCOLOR) == 0)
                        option.changeColor(foregroundColor);
                }
                break;

            case CRunKcButton.BTNTYPE_CHECKBOX:
                var label = file.readAString();
                var tooltip = file.readAString();
                var classPrefix = 'fusionRunControlKcButtonCheckbox';
                var inputId = 'FusionRunControlKcButtonCheckbox' + this.ho.hoHFII;

                //create checkbox container
                element = document.createElement('div');
                element.className = 'fusionRunControlKcButton ' + classPrefix + ' ' + classPrefix + (this.textOnLeft ? 'AlignRight' : 'AlignLeft');
                element.title = this.tooltip;

                //create label
                this.labelContainerElement = document.createElement('label');
                this.labelContainerElement.className = classPrefix + 'LabelContainer';
                this.labelContainerElement.setAttribute('for', inputId);
                element.appendChild(this.labelContainerElement);

                this.labelElement = document.createElement('span');
                this.labelElement.className = classPrefix + 'Label';

                //create input
                this.inputContainerElement = document.createElement('span');
                this.inputContainerElement.className = classPrefix + 'InputContainer';

                this.inputElement = document.createElement('input');
                this.inputElement.className = classPrefix + 'Input';
                this.inputElement.type = 'checkbox';
                this.inputElement.id = inputId;
                this.inputContainerElement.appendChild(this.inputElement);

                //let runtime theme the element
                Runtime.onThemeElement(this.inputElement, CRuntime.THEME_ELEMENT_CHECKBOX);

                //add in correct order
                this.labelContainerElement.appendChild(this.inputContainerElement);
                this.labelContainerElement.appendChild(this.labelElement);

                //set initial states
                this._changeLabel(label);
                this._changeTooltip(tooltip);
                if ((this.flags & CRunKcButton.BTN_SYSCOLOR) == 0)
                    this._changeTextColor(foregroundColor);

                break;

            case CRunKcButton.BTNTYPE_PUSHBITMAP:
                var label = file.readAString();
                var tooltip = file.readAString();

                //create element container
                element = document.createElement('div');
                element.className = 'fusionRunControlKcButton fusionRunControlKcButtonPushBitmap';
                element.title = this.tooltip;

                //create image element (we will set the bitmap later)
                this.imageElement = document.createElement('div');
                CServices.setVendorStyle(this.imageElement, 'transformOrigin', '0 0');
                element.appendChild(this.imageElement);

                //create internal element links
                this.inputElement = element;
                this.labelElement = element;

                //set initial states
                this._changeLabel(label);
                this._changeTooltip(tooltip);
                this._changeBitmap(CRunKcButton.BITMAP_NORMAL);

                break;

            case CRunKcButton.BTNTYPE_PUSHTEXTBITMAP:
                var label = file.readAString();
                var tooltip = file.readAString();
                var classPrefix = 'fusionRunControlKcButtonPushTextBitmap';

                //create element container
                element = document.createElement('button');
                element.className = 'fusionRunControlKcButton ' + classPrefix;
                element.title = this.tooltip;

                //create label element (major hack, not done by skn3)
                this.labelElement = document.createElement('span');
                this.labelElement.className = classPrefix + 'Label';
                element.appendChild(this.labelElement);

                this.spacerElement = document.createElement('br');
                this.spacerElement.className = classPrefix + 'Spacer';
                element.appendChild(this.spacerElement);

                //create image element (we will set the bitmap later) (major hack, not done by skn3)
                this.imageElement = document.createElement('div');
                this.imageElement.className = classPrefix + 'Image';
                element.appendChild(this.imageElement);

                //create internal element links
                this.inputElement = element;

                //set initial states
                this._changeTooltip(tooltip);
                this._changeBitmap(CRunKcButton.BITMAP_NORMAL);
                this._changeLabel(label);//do this after setting bitmap so we get proper alignment

                break;

            case CRunKcButton.BTNTYPE_PUSHTEXT:
                var label = file.readAString();
                var tooltip = file.readAString();

                //normal button
                element = document.createElement('button');
                element.className = 'fusionRunControlKcButton fusionRunControlKcButtonPushText';
                element.title = this.tooltip;

                //let runtime theme the element
                Runtime.onThemeElement(element, CRuntime.THEME_ELEMENT_BUTTON);

                this.inputElement = element;
                this.labelElement = element;

                //set initial states
                this._changeLabel(label);
                this._changeTooltip(tooltip);
                if ((this.flags & CRunKcButton.BTN_SYSCOLOR) == 0)
                    this._changeTextColor(foregroundColor);

                break;
        }

        //set the element
        this.setElement(element, (this.flags & CRunKcButton.BTN_HIDEONSTART) == 0);

        //call internal updates for first time
        this._changeEnabled((this.flags & CRunKcButton.BTN_DISABLEONSTART) == 0);
        if ((this.flags & CRunKcButton.BTN_SYSCOLOR) == 0)
            this._changeBackgroundColor(backgroundColor);
        this.setFont(fontInfo);

        //add event handlers
        var that = this;
        var app = this.rh.rhApp;

        switch (this.type) {
            case CRunKcButton.BTNTYPE_PUSHTEXT:
                //add fake mouse interactions so the rest of the runtime can respond to this click
                element.addEventListener('mousedown', function (event) {
                    app.forceMouseButton(true);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });

                element.addEventListener('mouseup', function (event) {
                    app.forceMouseButton(false);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });

                //add button click handler
                this.inputElement.addEventListener('click', function (event) {
                    that.clickedEvent = that.ho.getEventCount();
                    that.ho.generateEvent(1, 0);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });
                break;

            case CRunKcButton.BTNTYPE_PUSHBITMAP:
            case CRunKcButton.BTNTYPE_PUSHTEXTBITMAP:
                //add fake mouse interactions so the rest of the runtime can respond to this click
                element.addEventListener('mousedown', function (event) {
                    app.forceMouseButton(true);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });

                element.addEventListener('mouseup', function (event) {
                    app.forceMouseButton(false);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });

                //add mouse handling events to input
                this.inputElement.addEventListener('mousedown', function (event) {
                    that.held = true;
                    that._changeBitmap(CRunKcButton.BITMAP_PRESSED);
                });

                this.inputElement.addEventListener('mouseup', function (event) {
                    that.held = false;
                    that._changeBitmap(CRunKcButton.BITMAP_NORMAL);
                });

                this.inputElement.addEventListener('mouseenter', function (event) {
                    that.over = true;
                    if (that.held) {
                        that._changeBitmap(CRunKcButton.BITMAP_PRESSED);
                    }
                });

                this.inputElement.addEventListener('mouseleave', function (event) {
                    that.over = false;
                    if (that.held) {
                        that._changeBitmap(CRunKcButton.BITMAP_NORMAL);
                    }
                });

                //add button click handler
                this.inputElement.addEventListener('click', function (event) {
                    that.clickedEvent = that.ho.getEventCount();
                    that.ho.generateEvent(1, 0);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });
                break;

            case CRunKcButton.BTNTYPE_CHECKBOX:
                //add fake mouse interactions so the rest of the runtime can respond to this click
                element.addEventListener('mousedown', function (event) {
                    app.forceMouseButton(true);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });

                element.addEventListener('mouseup', function (event) {
                    app.forceMouseButton(false);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });

                //add button click handler
                this.inputElement.addEventListener('click', function (event) {
                    that.checked = event.target.checked;

                    //generate event
                    that.clickedEvent = that.ho.getEventCount();
                    that.ho.generateEvent(1, 0);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });
                break;

            case CRunKcButton.BTNTYPE_RADIOBTN:
                //add fake mouse interactions so the rest of the runtime can respond to this click
                element.addEventListener('mousedown', function (event) {
                    app.forceMouseButton(true);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });

                element.addEventListener('mouseup', function (event) {
                    app.forceMouseButton(false);

                    //prevent the event going any further (can still execute handlers for this element though)
                    event.stopPropagation();
                });

                //add button click handler for all options
                for (var index = 0; index < this.options.length; index++) {
                    this.options[index].inputElement.addEventListener('click', function (event) {
                        that.clickedEvent = that.ho.getEventCount();
                        that.ho.generateEvent(1, 0);

                        //prevent the event going any further (can still execute handlers for this element though)
                        event.stopPropagation();
                    });
                }
                break;
        }
    },

    condition: function (num, cnd) {
        switch (num) {
            case 0: /* Box checked? */
                return this.type == CRunKcButton.BTNTYPE_CHECKBOX && this.checked;

            case 1: /* On click */
                return (this.ho.hoFlags & CObject.HOF_TRUEEVENT) != 0 || this.ho.getEventCount() == this.clickedEvent;

            case 2: /* Box not checked? */
                return this.type == CRunKcButton.BTNTYPE_CHECKBOX && !this.checked;

            case 3: /* Visible? */
                return this.visible;

            case 4: /* Enabled? */
                return this.enabled;

            case 5: /* Radio enabled? */
                //skip
                if (this.type != CRunKcButton.BTNTYPE_RADIOBTN || this.options.length == 0) {
                    return false;
                }

                //check index
                var index = cnd.getParamExpression(this.rh, 0);
                if (index < 0 && index >= this.options.length) {
                    return false;
                }

                //return time
                return !this.options[index].inputElement.disabled
        }
    },

    action: function (num, act) {
        switch (num) {
            case 0: /* Change text */
                this._changeLabel(act.getParamExpString(this.rh, 0))
                break;

            case 1: /* Show */
                this._changeVisibility(true);
                break;

            case 2: /* Hide */
                this._changeVisibility(false);
                break;

            case 3: /* Enable */
                this._changeEnabled(true);
                break;

            case 4: /* Disable */
                this._changeEnabled(false);
                break;

            case 5: /* Set position */
                var position = act.getParamPosition(this.rh, 0);
                if (position.found) {
                    this.setPosition(position.x, position.y);
                }
                break;

            case 6: /* Set width */
                this.setWidth(act.getParamExpression(this.rh, 0));
                break;

            case 7: /* Set height */
                this.setHeight(act.getParamExpression(this.rh, 0));
                break;

            case 8: /* Change radio text */
                //skip
                if (this.type != CRunKcButton.BTNTYPE_RADIOBTN) {
                    return;
                }

                //check index in bounds
                var index = act.getParamExpression(this.rh, 0);
                if (index < 0 && index >= this.options.length) {
                    return;
                }

                //do the update
                this.options[index].changeLabel(act.getParamExpString(this.rh, 1));
                break;

            case 9: /* Enable radio button */
                //skip
                if (this.type != CRunKcButton.BTNTYPE_RADIOBTN) {
                    return;
                }

                //check index in bounds
                var index = act.getParamExpression(this.rh, 0);
                if (index < 0 && index >= this.options.length) {
                    return;
                }

                this.options[index].changeEnabled(true);
                break;

            case 10: /* Disable radio button */
                //skip
                if (this.type != CRunKcButton.BTNTYPE_RADIOBTN) {
                    return;
                }

                //check index in bounds
                var index = act.getParamExpression(this.rh, 0);
                if (index < 0 && index >= this.options.length) {
                    return;
                }

                this.options[index].changeEnabled(false);
                break;

            case 11: /* Select radio button */
                //skip
                if (this.type != CRunKcButton.BTNTYPE_RADIOBTN) {
                    return;
                }

                //check index in bounds
                var index = act.getParamExpression(this.rh, 0);
                if (index < 0 && index >= this.options.length) {
                    return;
                }

                for (var updateIndex = 0; index < this.options.length; index++) {
                    this.options[updateIndex].changeSelected(updateIndex == index);
                }

                break;

            case 12: /* Set X position */
                this.setX(act.getParamExpression(this.rh, 0));
                break;

            case 13: /* Set Y position */
                this.setY(act.getParamExpression(this.rh, 0));
                break;

            case 14: /* Check */
                this._changeChecked(true);
                break;

            case 15: /* Uncheck */
                this._changeChecked(false);
                break;

            case 16: /* Set menu command ID */
                break;

            case 17: /* Set tooltip */
                this._changeTooltip(act.getParamExpString(this.rh, 0));
                break;
        }
    },

    expression: function (num) {
        switch (num) {
            case 0: /* Get width */
                return this.ho.hoImgWidth;

            case 1: /* Get height */
                return this.ho.hoImgHeight;

            case 2: /* Get X */
                return this.ho.hoX;

            case 3: /* Get Y */
                return this.ho.hoY;

            case 4: /* Get selected radio index */
                //skip
                if (this.type != CRunKcButton.BTNTYPE_RADIOBTN || this.options.length == 0) {
                    return -1;
                }

                //scan all radios
                for (var index = 0; index < this.options.length; index++) {
                    if (this.options[index].inputElement.checked) {
                        return index;
                    }
                }

                //none
                return -1;

            case 5: /* Get text */
                if (this.type != CRunKcButton.BTNTYPE_RADIOBTN) {
                    return this.label;
                }

                //check index
                var index = this.ho.getExpParam();
                if (index < 0 || index >= this.options.length) {
                    return '';
                }

                return this.options[index].label;

            case 6: /* Get tooltip */
                return this.tooltip;
        }
    },

    //internal
    _updateSize: function (element) {
        //this will update sizes for certain elements
        var button = this.button;
        var app = this.rh.rhApp;
        var ho = this.ho;

        var realWidth = Math.round(ho.hoImgWidth) * app.scaleX;
        var realHeight = Math.round(ho.hoImgHeight) * app.scaleY;

        switch (this.type) {
            case CRunKcButton.BTNTYPE_PUSHBITMAP:
                //apply scaling (IE 9.0 and higher)
                CServices.setVendorStyle(this.imageElement, 'transform', 'scale(' + app.scaleX + ',' + app.scaleY + ')');
                break;

            case CRunKcButton.BTNTYPE_CHECKBOX:
                this.element.style.lineHeight = realHeight + 'px';
                this.labelContainerElement.style.width = realWidth + 'px';
                this.labelContainerElement.style.height = realHeight + 'px';
                break;

            case CRunKcButton.BTNTYPE_RADIOBTN:
                var itemHeight = Math.round((ho.hoImgHeight * app.scaleY) / this.options.length);

                for (var index = 0; index < this.options.length; index++) {
                    this.options[index].changeSize(realWidth, itemHeight);
                }
                break;

        }
    },

    _updateBitmapAlign: function () {
        //remove elements
        this.inputElement.removeChild(this.labelElement);
        this.inputElement.removeChild(this.spacerElement);
        this.inputElement.removeChild(this.imageElement);

        //add them back
        if (this.label.length > 0) {
            //text and image
            switch (this.align) {
                case CRunKcButton.ALIGN_ONELINELEFT:
                    //image left of text
                    this.inputElement.appendChild(this.imageElement);
                    this.inputElement.appendChild(this.labelElement);

                    //fix classes
                    CServices.addCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageLeft');
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageRight');
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageAbove');
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageBelow');

                    //this.imageElement.style.marginRight = '0.6em';
                    //element.insertBefore(img_el, element.firstChild);
                    break;

                case CRunKcButton.ALIGN_ONELINERIGHT:
                    //image right of text
                    this.inputElement.appendChild(this.labelElement);
                    this.inputElement.appendChild(this.imageElement);

                    //fix classes
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageLeft');
                    CServices.addCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageRight');
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageAbove');
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageBelow');

                    //this.imageElement.style.marginLeft = '0.6em';
                    //element.appendChild(this.imageElement);
                    break;

                case CRunKcButton.ALIGN_CENTERINVERSE:
                    //text above image
                    this.inputElement.appendChild(this.labelElement);
                    this.inputElement.appendChild(this.spacerElement);
                    this.inputElement.appendChild(this.imageElement);

                    //fix classes
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageLeft');
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageRight');
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageAbove');
                    CServices.addCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageBelow');

                    //element.insertBefore(document.createElement('br'), element.firstChild);
                    //element.insertBefore(img_el, element.firstChild);
                    break;

                case CRunKcButton.ALIGN_CENTER:
                    //image above text
                    this.inputElement.appendChild(this.imageElement);
                    this.inputElement.appendChild(this.spacerElement);
                    this.inputElement.appendChild(this.labelElement);

                    //fix classes
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageLeft');
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageRight');
                    CServices.addCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageAbove');
                    CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageBelow');

                    //element.appendChild(document.createElement('br'));
                    //element.appendChild(img_el);
                    break;
            }

        } else {
            //just image
            this.inputElement.appendChild(this.imageElement);

            //fix classes
            CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageLeft');
            CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageRight');
            CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageAbove');
            CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonPushTextBitmapImageBelow');
        }
    },

    _changeLabel: function (label) {
        if (label != this.label) {
            this.label = label;

            if (this.labelElement != null) {
                this.labelElement.innerText = label;

                //do we need to update the bitmap alignment?
                if (this.type == CRunKcButton.BTNTYPE_PUSHTEXTBITMAP) {
                    this._updateBitmapAlign();
                }
            }
        }
    },

    _changeFont: function() {

    },

    _changeTextColor: function (color) {
        if (color != this.foregroundColor) {
            this.foregroundColor = color;
            var CSSColor = CServices.getColorString(color);

            if (this.type == CRunKcButton.BTNTYPE_RADIOBTN) {
                //change all radio items
                for (var index = 0; index < this.options.length; index++) {
                    this.options[index].changeColor(CSSColor);
                }
            } else {
                //change just label
                if (this.labelElement != null) {
                    this.labelElement.style.color = CSSColor;
                }
            }
        }
    },

    _changeBackgroundColor: function (color) {
        //skip
        //if (this.type == CRunKcButton.BTNTYPE_PUSHTEXT || this.type == CRunKcButton.BTNTYPE_PUSHTEXTBITMAP || this.type == CRunKcButton.BTNTYPE_PUSHBITMAP) {
        //    return;
        //}

        //background
        this.backgroundColor = color;

        if (this.flags & CRunKcButton.BTN_TRANSP_BKD) {
            this.element.style.backgroundColor = 'transparent';
        } else {
            this.element.style.backgroundColor = CServices.getColorString(this.backgroundColor);
        }
    },

    _changeVisibility: function (visible) {
        if (visible != this.visible) {
            this.ho.bShown = visible;

            this.element.style.visibility = (visible ? 'visible' : 'hidden');
        }
    },

    _changeEnabled: function (enabled) {
        if (enabled != this.enabled) {
            this.enabled = enabled;

            //do type speciffic things
            switch (this.type) {
                case CRunKcButton.BTNTYPE_PUSHTEXT:
                    this.inputElement.disabled = !enabled;
                    break;

                case CRunKcButton.BTNTYPE_PUSHBITMAP:
                    this._changeBitmap(this.imageIndexRaw);
                    break;

                case CRunKcButton.BTNTYPE_PUSHTEXTBITMAP:
                    this.inputElement.disabled = !enabled;
                    this._changeBitmap(this.imageIndexRaw);
                    break;

                case CRunKcButton.BTNTYPE_CHECKBOX:
                    this.inputElement.disabled = !enabled;
                    break;

                case CRunKcButton.BTNTYPE_RADIOBTN:
                    for (var index = 0; index < this.options.length; index++) {
                        this.options[index].changeEnabled(enabled);
                    }
                    break;
            }

            //fix classes
            if (enabled) {
                CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonDisabled');
                CServices.addCSSClass(this.inputElement, 'fusionRunControlKcButtonEnabled');
            } else {
                CServices.removeCSSClass(this.inputElement, 'fusionRunControlKcButtonEnabled');
                CServices.addCSSClass(this.inputElement, 'fusionRunControlKcButtonDisabled');
            }
        }
    },

    _changeChecked: function(checked) {
        if (this.type == CRunKcButton.BTNTYPE_CHECKBOX) {
            if (checked != this.checked) {
                this.checked = true;
                this.inputElement.checked = true;
            }
        }
    },

    _changeTooltip: function(tooltip) {
        if (tooltip != this.tooltip) {
            this.tooltip = tooltip;

            switch (this.type) {
                case CRunKcButton.BTNTYPE_PUSHTEXT:
                case CRunKcButton.BTNTYPE_PUSHBITMAP:
                case CRunKcButton.BTNTYPE_PUSHTEXTBITMAP:
                    this.element.title = tooltip;
                    break;

                case CRunKcButton.BTNTYPE_CHECKBOX:
                    break;

                case CRunKcButton.BTNTYPE_RADIOBTN:
                    break;
            }
        }
    },

    _changeBitmap: function (imageIndex) {
        this.imageIndexRaw = imageIndex;

        //change for disabled
        if (!this.enabled) {
            imageIndex = CRunKcButton.BITMAP_DISABLED;
        }

        //has it changed?
        if (imageIndex != this.imageIndex) {
            var app = this.rh.rhApp;
            this.imageIndex = imageIndex;

            //get the image
            var image = app.imageBank.getImageFromHandle(this.images[this.imageIndex]);
            if (image == null) {
                this.imageIndex = CRunKcButton.BITMAP_NORMAL;
                image = app.imageBank.getImageFromHandle(this.images[this.imageIndex]);
            }

            //apply changes
            if (image != null) {
                switch (this.type) {
                    case CRunKcButton.BTNTYPE_PUSHBITMAP:
                        //update the element
                        this.imageElement = image.createElement(this.imageElement);
                        break;

                    case CRunKcButton.BTNTYPE_PUSHTEXTBITMAP:
                        //update the element
                        this.imageElement = image.createElement(this.imageElement);
                        break;
                }
            }
        }
    },

    //api
    getRunObjectTextColor: function () {
        return this.foregroundColor;
    },

    setRunObjectTextColor: function (rgb) {
        this._changeTextColor(rgb);
    },

    setSize: function (width, height) {
        //call chain
        CRunControl.prototype.setSize.call(this, width, height);

        //call self
        this._updateSize();
    },
};

//setup inheritance using extend
CServices.extend(CRunControl, CRunKcButton);

function CRunKcButtonRadioOption() {
    this.label = '';
    this.containerElement = null;
    this.inputContainerElement = null;
    this.inputElement = null;
    this.labelContainerElement = null;
    this.labelElement = null;
}

CRunKcButtonRadioOption.prototype = {
    changeLabel: function (label) {
        if (label != this.label) {
            this.labelElement.innerText = label;
        }
    },

    changeColor: function (color) {
        var CSSColor = CServices.getColorString(color);
        this.labelElement.style.color = CSSColor;
    },

    changeEnabled: function(enabled) {
        this.inputElement.disabled = !enabled;
    },

    changeSelected: function(selected) {
        this.inputElement.selected = selected;
    },

    changeSize: function (width, height) {
        width += 'px';
        height += 'px';
        this.containerElement.style.width = width;
        this.containerElement.style.height = height;
        this.labelContainerElement.style.width = width;
        this.labelContainerElement.style.height = height;
        this.labelContainerElement.style.lineHeight = height;
    },
}