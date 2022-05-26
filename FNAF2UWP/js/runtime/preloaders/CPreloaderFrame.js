// CPreloaderFrame objects
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

function CPreloaderFrame(app) {
    this.app = app;
    this.isLoaded = false;
    this.appSprite = new CSceneNode();

    var subApp = Runtime.createApp()
    subApp = subApp;
    subApp.onInit(true);
    subApp.onSetupFile(app.file, app.path);
    subApp.onSetupElements(app.root, app.canvas, app.container);
    subApp.onSetupParentApp(app, app.preloaderFrameNumber, 0, this.appSprite, app.gaCxWin, app.gaCyWin);

    subApp.digest();
    subApp.preloaderEnabled = false;
    subApp.subAppStopped = false;
    subApp.dwOptions &= ~CRunApp.AH2OPT_LOADDATAATSTART;
    subApp.startApplication();
    subApp.setMouseOffsets(0, 0);
    subApp.updateApplication();

    this.appSprite.x = app.gaCxWin / 2 - subApp.frame.leWidth / 2;
    this.appSprite.y = app.gaCyWin / 2 - subApp.frame.leHeight / 2;
    this.stopOnLoad = (app.dwOptions & CRunApp.AH2OPT_PRELOADERQUIT) != 0;
    app.subApps.push(subApp);
    this.delay = 0;
}

CPreloaderFrame.prototype = {

    load: function () {
        this.step();
        return !this.subApp.loading;
    },

    reset: function () {
        var subApp = this.subApp;
        subApp.run.f_StopSamples();
        subApp.run.killFrameObjects();
        subApp.run.y_KillLevel(false);
        subApp.run.resetFrameLayers(-1, false);
        subApp.run.rhEvtProg.unBranchPrograms();
        subApp.run.freeMouse();
        subApp.run.freeRunHeader();

        subApp.run.rhFrame.leX = subApp.run.rhFrame.leLastScrlX = subApp.run.rh3DisplayX = 0;
        subApp.run.rhFrame.leY = subApp.run.rhFrame.leLastScrlY = subApp.run.rh3DisplayY = 0;
        subApp.resetLayers();
        subApp.run.allocRunHeader();
        subApp.run.initAsmLoop();
        subApp.run.resetFrameLayers(-1, false);
        subApp.run.prepareFrame();
        subApp.run.createFrameObjects(false);
        subApp.run.createBackdropInstances();
        subApp.run.loadGlobalObjectsData();
        subApp.run.rhEvtProg.prepareProgram();
        subApp.run.rhEvtProg.assemblePrograms(subApp.run);
        subApp.run.f_InitLoop();
        subApp.run.captureMouse();
        subApp.run.rhQuit = 0;
        subApp.run.rhQuitParam = 0;
        subApp.subAppStopped = false;
        this.app.subApps.push(subApp);
        this.delay = 0;
    },

    update: function () {
        if (!this.subApp.subAppStopped) {
            if (this.stopOnLoad) {
                this.subApp.subAppStopped = (this.app.loadingDataCurrent == this.app.loadingDataTotal);
            }

            if (this.subApp.updateApplication() == false) {
                this.subApp.subAppStopped = true;
            }
        }

        if (this.subAppStopped && this.app.silentSound) {
            this.app.updateContinue(this);
        }
    },

    render: function () {
        if (!this.subApp.subAppStopped) {
            this.subApp.drawSubApplication(context, false);
        } else {
            if (this.app.silentSound) {
                this.app.drawContinue(this);
            }
        }
    },

    isComplete: function () {
        var complete = this.subApp.subAppStopped;
        if (this.app.silentSound) {
            complete = false;
        }
        if (complete) {
            if (this.delay > 0) {
                this.delay--;
                if (this.delay > 0) {
                    return false;
                }
            }
            var n;
            for (n = 0; n < this.app.subApps.length; n++) {
                if (this.app.subApps[n] == this.subApp) {
                    this.app.subApps.splice(n, 1);
                    break;
                }
            }
        }
        return complete;
    }
}
