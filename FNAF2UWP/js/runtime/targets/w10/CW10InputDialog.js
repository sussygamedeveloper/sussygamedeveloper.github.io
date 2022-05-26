// CW10InputDialog object
// ----------------------------------------------------------
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

function CW10InputDialog(options) {
    //call chain
    CInputDialog.call(this, options);

    //call self
    this.dialog = null;
    this.inputElement = null;
    this.eventDialogBeforeHide = null;
    this.eventDialogAfterHide = null;
    this.eventDialogAfterShow = null;
    this.eventDialogKeyPress = null;
    this.eventInputPaneHiding = null;
}

CW10InputDialog.prototype = {
    //constructor/destructor
    free: function () {
        //call self
        this.cleanup();

        //call chain
        CDialog.prototype.free.call(this);
    },

    //events
    onOpen: function () {
        //get objects
        var that = this;
        var inputPane = Windows.UI.ViewManagement.InputPane.getForCurrentView();

        //get options
        var title = this.option('title', null);
        var message = this.option('message', '');
        var okText = this.option('ok', 'Ok');
        var cancelText = this.option('cancel', 'Cancel');

        //create container
        var containerElement = document.createElement('div');
        containerElement.setAttribute('data-win-control', 'WinJS.UI.ContentDialog');
        document.body.appendChild(containerElement);

        //create message
        var messageElement = document.createElement('div');
        messageElement.innerHTML = message;
        containerElement.appendChild(messageElement);

        //create input
        this.inputElement = document.createElement('input');
        this.inputElement.setAttribute('type', 'text');
        containerElement.appendChild(this.inputElement);

        //create dialog from element
        this.dialog = new WinJS.UI.ContentDialog(containerElement);
        this.dialog.title = title;
        this.dialog.primaryCommandDisabled = false;
        this.dialog.primaryCommandText = okText;
        this.dialog.secondaryCommandDisabled = false;
        this.dialog.secondaryCommandText = cancelText;

        //dialog events
        this.eventDialogBeforeHide = this.handleDialogBeforeHide.bind(this);
        this.eventDialogAfterHide = this.handleDialogAfterHide.bind(this);
        this.eventDialogAfterShow = this.handleDialogAfterShow.bind(this);
        this.eventDialogKeyPress = this.handleDialogKeyPress.bind(this);
        this.dialog.addEventListener('aftershow', this.eventDialogAfterShow);
        this.dialog.addEventListener('beforehide', this.eventDialogBeforeHide);
        this.dialog.addEventListener('afterhide', this.eventDialogAfterHide);
        this.dialog.addEventListener('keypress', this.eventDialogKeyPress);

        //input pane events
        this.eventInputPaneHiding = this.handleInputPaneHiding.bind(this);
        inputPane.addEventListener('hiding', this.eventInputPaneHiding);

        //show the dialog
        this.dialog.show();
    },

    onClose: function () {
        //manually closed so need to handle this
        this.dialog.hide(WinJS.UI.ContentDialog.DismissalResult.none);
    },

    //internal
    handleDialogAfterShow: function (event) {
        //focus the input
        if (this._open) {
            this.inputElement.focus();
        }
    },

    handleDialogBeforeHide: function (event) {
        if (this._open) {
            //check which command was pressed
            if (!this.handleCommand(event.detail.result)) {
                //failed so refocus the input
                this.inputElement.focus();

                //prevent default
                event.preventDefault();
            }
        }
    },

    handleDialogAfterHide: function (event) {
        //the dialog is now closed so we should check for success
        if (!this._completed) {
            //flagged closed
            this._open = false;

            var success = event.detail.result == 'primary';
            var value = success ? this.inputElement.value : '';

            //cleanup
            this.cleanup();

            //now inform the CDialog this it needs to finish
            this.finish(success, value);
        }
    },

    handleDialogKeyPress: function (event) {
        if (this._open) {
            var inputPane = Windows.UI.ViewManagement.InputPane.getForCurrentView();
            var event = event || window.event;
            var code = event.which || event.keyCode;

            switch (code) {
                case 13:
                    //enter
                    if (this.handleCommand('primary')) {
                        //success, so lets hide the dialog, this should trigger teh afterhide event
                        this._open = false;

                        //hide the input pane if there is one
                        inputPane.tryHide();

                        this.dialog.hide(WinJS.UI.ContentDialog.DismissalResult.primary);
                    }
                    break;
            }
        }
    },

    handleInputPaneHiding: function (event) {
        //if the keyboard hides we should hide the pane!
        if (this._open) {
            this._open = false;
            this.dialog.hide(WinJS.UI.ContentDialog.DismissalResult.none);
        }
    },

    cleanup: function () {
        if (this.dialog) {
            //remove event listeners
            this.dialog.removeEventListener('aftershow', this.eventDialogAfterShow);
            this.dialog.removeEventListener('beforehide', this.eventDialogBeforeHide);
            this.dialog.removeEventListener('afterhide', this.eventDialogAfterHide);
            this.dialog.removeEventListener('keypress', this.eventDialogKeyPress);

            var inputPane = Windows.UI.ViewManagement.InputPane.getForCurrentView();
            inputPane.removeEventListener('hiding', this.eventInputPaneHiding);

            //remove elements
            document.body.removeChild(this.dialog.element);

            //dispose of dialog
            this.dialog.dispose();

            //nullify
            this.dialog = null;
            this.containerElement = null;
            this.messageElement = null;
            this.inputElement = null;
            this.eventDialogAfterShow = null;
            this.eventDialogBeforeHide = null;
            this.eventDialogAfterHide = null;
            this.eventDialogKeyPress = null;
            this.eventInputPaneHiding = null;
        }
    },

    handleCommand: function (command) {
        switch (command) {
            case 'primary':
                //only return true if the user has valid entry
                return this.inputElement.value.length > 0;

            case 'secondary':
            case 'none'://escape
                //alwasy return true as we allow the dialog to be cancelled
                return true;
                break;
        }

        return false;
    },
};

//setup inheritance using extend
CServices.extend(CInputDialog, CW10InputDialog);