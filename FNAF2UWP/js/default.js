// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    //"use strict";

    //setup some defaults in UWP
    navigator.gamepadInputEmulation = "gamepad";//disable xbox gamepad emulation by default (it will be turned on later)

    //bootup

    //multiple_source_code_begin
    //create array of scripts (we do this so that we can decide how to include them into the document)
    var scripts = [];

    //debug


    //libs
    scripts.push("js/runtime/libs/jszip.js");
    scripts.push("js/runtime/libs/jszip-inflate.js");
    scripts.push("js/runtime/libs/jszip-load.js");
    scripts.push("js/runtime/libs/Matrix.js");
    scripts.push("js/runtime/libs/Matrix2D.js");
    scripts.push("js/runtime/libs/Box2D.js");

    //debug only libs

    //core stuff
    scripts.push("js/runtime/objects/CBoundingCache.js");

    //compile time
    scripts.push("js/Extensions.js");
    scripts.push("js/Movements.js");

    //services
    scripts.push("js/runtime/services/CServices.js");
    scripts.push("js/runtime/services/CArrayList.js");
    scripts.push("js/runtime/services/CBrowserDetect.js");
    scripts.push("js/runtime/services/CDisplayText.js");
    scripts.push("js/runtime/services/CFile.js");
    scripts.push("js/runtime/services/CFontInfo.js");
    scripts.push("js/runtime/services/CIni.js");
    scripts.push("js/runtime/services/CObjectSelection.js");
    scripts.push("js/runtime/services/CPoint.js");
    scripts.push("js/runtime/services/CRect.js");
    scripts.push("js/runtime/services/CReplaceColor.js");
    scripts.push("js/runtime/services/CTokeniser.js");
    scripts.push("js/runtime/services/CZone.js");
    scripts.push("js/runtime/services/CGraphicFont.js");

    //renderers
    scripts.push("js/runtime/renderers/CRenderer.js");
    scripts.push("js/runtime/renderers/CRendererImageBuffer.js");
    scripts.push("js/runtime/renderers/CRendererTextContainer.js");
    scripts.push("js/runtime/renderers/CRendererImageContainer.js");

    scripts.push("js/runtime/renderers/canvas/CCanvasRenderer.js");
    scripts.push("js/runtime/renderers/canvas/CCanvasRendererImageBuffer.js");
    scripts.push("js/runtime/renderers/canvas/CCanvasRendererTextContainer.js");
    scripts.push("js/runtime/renderers/canvas/CCanvasRendererImageContainer.js");

    scripts.push("js/runtime/renderers/webgl/CWebGLRenderer.js");
    scripts.push("js/runtime/renderers/webgl/CWebGLRendererTexture.js");
    scripts.push("js/runtime/renderers/webgl/CWebGLRendererShader.js");
    scripts.push("js/runtime/renderers/webgl/CWebGLRendererImageBuffer.js");
    scripts.push("js/runtime/renderers/webgl/CWebGLRendererTextContainer.js");
    scripts.push("js/runtime/renderers/webgl/CWebGLRendererImageContainer.js");

    //shaders  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderBasic.frag");  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderBasic.vert");  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderFilled.frag");  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderFilled.vert");  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderGradient.frag");  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderGradient.vert");  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderGradientEllipse.frag");  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderGradientEllipse.vert");  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderPattern.frag");
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderPattern.vert");
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderTextured.frag");
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderTextured.vert");
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderTexturedEllipse.frag");  
    //+scripts.push("js/runtime/renderers/webgl/shaders/shaderTexturedEllipse.vert");  

    //application
    scripts.push("js/runtime/application/CRunApp.js");
    scripts.push("js/runtime/application/CRunFrame.js");
    scripts.push("js/runtime/application/CSoundPlayer.js");
    scripts.push("js/runtime/application/CGamepad.js");
    scripts.push("js/runtime/application/CVirtualMouse.js");
    scripts.push("js/runtime/application/CVirtualJoystick.js");
    scripts.push("js/runtime/application/CVirtualJoystickTouch.js");
    scripts.push("js/runtime/application/CVirtualJoystickAccelerometer.js");
    scripts.push("js/runtime/application/CEmbeddedFile.js");
    scripts.push("js/runtime/application/CFakeTouchEvent.js");
    scripts.push("js/runtime/application/CFakePointerEvent.js");

    //events
    scripts.push("js/runtime/events/CEventProgram.js");
    scripts.push("js/runtime/events/CEventGroup.js");
    scripts.push("js/runtime/events/CEvent.js");
    scripts.push("js/runtime/events/CPushedEvent.js");
    scripts.push("js/runtime/events/CGroupFind.js");
    scripts.push("js/runtime/events/CLoadQualifiers.js");
    scripts.push("js/runtime/events/CPosOnLoop.js");
    scripts.push("js/runtime/events/CQualToOiList.js");
    scripts.push("js/runtime/events/CForEach.js");
    scripts.push("js/runtime/events/CTimerEvents.js");

    //animations
    scripts.push("js/runtime/animations/CAnim.js");
    scripts.push("js/runtime/animations/CAnimDir.js");
    scripts.push("js/runtime/animations/CAnimHeader.js");
    scripts.push("js/runtime/animations/CRAni.js");

    //params
    scripts.push("js/runtime/params/CParam.js");
    scripts.push("js/runtime/params/CPosition.js");
    scripts.push("js/runtime/params/CPositionInfo.js");
    scripts.push("js/runtime/params/PARAM_2SHORTS.js");
    scripts.push("js/runtime/params/PARAM_CMPTIME.js");
    scripts.push("js/runtime/params/PARAM_COLOUR.js");
    scripts.push("js/runtime/params/PARAM_CREATE.js");
    scripts.push("js/runtime/params/PARAM_EVERY.js");
    scripts.push("js/runtime/params/PARAM_EXPRESSION.js");
    scripts.push("js/runtime/params/PARAM_EXTENSION.js");
    scripts.push("js/runtime/params/PARAM_GROUP.js");
    scripts.push("js/runtime/params/PARAM_GROUPPOINTER.js");
    scripts.push("js/runtime/params/PARAM_INT.js");
    scripts.push("js/runtime/params/PARAM_KEY.js");
    scripts.push("js/runtime/params/PARAM_OBJECT.js");
    scripts.push("js/runtime/params/PARAM_POSITION.js");
    scripts.push("js/runtime/params/PARAM_SAMPLE.js");
    scripts.push("js/runtime/params/PARAM_SHOOT.js");
    scripts.push("js/runtime/params/PARAM_SHORT.js");
    scripts.push("js/runtime/params/PARAM_STRING.js");
    scripts.push("js/runtime/params/PARAM_TIME.js");
    scripts.push("js/runtime/params/PARAM_ZONE.js");

    //movements
    scripts.push("js/runtime/movements/CMove.js");
    scripts.push("js/runtime/movements/CMoveDef.js");
    scripts.push("js/runtime/movements/CMoveDefList.js");
    scripts.push("js/runtime/movements/CMoveDefExtension.js");
    scripts.push("js/runtime/movements/CMoveExtension.js");
    scripts.push("js/runtime/movements/CRunMvtExtension.js");
    scripts.push("js/runtime/movements/CRMvt.js");

    //runlooop
    scripts.push("js/runtime/runloop/CRun.js");
    scripts.push("js/runtime/runloop/CCreateObjectInfo.js");
    scripts.push("js/runtime/runloop/CObjInfo.js");
    scripts.push("js/runtime/runloop/CRunMBase.js");
    scripts.push("js/runtime/runloop/CSaveGlobal.js");
    scripts.push("js/runtime/runloop/CSaveGlobalCounter.js");
    scripts.push("js/runtime/runloop/CSaveGlobalText.js");
    scripts.push("js/runtime/runloop/CSaveGlobalValues.js");

    //extensions
    scripts.push("js/runtime/extensions/CExtLoader.js");
    scripts.push("js/runtime/extensions/CExtLoad.js");
    scripts.push("js/runtime/extensions/CRunExtension.js");
    scripts.push("js/runtime/extensions/CActExtension.js");
    scripts.push("js/runtime/extensions/CCndExtension.js");
    scripts.push("js/runtime/extensions/CExpExtension.js");
    scripts.push("js/runtime/extensions/CRunControl.js");

    //objects
    scripts.push("js/runtime/objects/CSceneNode.js");
    scripts.push("js/runtime/objects/CObject.js");
    scripts.push("js/runtime/objects/CActive.js");
    scripts.push("js/runtime/objects/CCCA.js");
    scripts.push("js/runtime/objects/CCounter.js");
    scripts.push("js/runtime/objects/CExtension.js");
    scripts.push("js/runtime/objects/CLives.js");
    scripts.push("js/runtime/objects/CQuestion.js");
    scripts.push("js/runtime/objects/CRCom.js");
    scripts.push("js/runtime/objects/CScore.js");
    scripts.push("js/runtime/objects/CText.js");

    //sprites
    scripts.push("js/runtime/sprites/CRSpr.js");
    scripts.push("js/runtime/sprites/CMask.js");
    scripts.push("js/runtime/sprites/CColMask.js");
    scripts.push("js/runtime/sprites/CRotatedMask.js");

    //frame
    scripts.push("js/runtime/frame/CLO.js");
    scripts.push("js/runtime/frame/CLOList.js");
    scripts.push("js/runtime/frame/CBackInstance.js");
    scripts.push("js/runtime/frame/CLayerPlane.js");
    scripts.push("js/runtime/frame/CLayer.js");

    //oi
    scripts.push("js/runtime/oi/COI.js");
    scripts.push("js/runtime/oi/COIList.js");
    scripts.push("js/runtime/oi/COC.js");
    scripts.push("js/runtime/oi/COCBackground.js");
    scripts.push("js/runtime/oi/COCQBackdrop.js");
    scripts.push("js/runtime/oi/CObjectCommon.js");
    scripts.push("js/runtime/oi/CDefCCA.js");
    scripts.push("js/runtime/oi/CDefCounter.js");
    scripts.push("js/runtime/oi/CDefCounters.js");
    scripts.push("js/runtime/oi/CDefRtf.js");
    scripts.push("js/runtime/oi/CDefText.js");
    scripts.push("js/runtime/oi/CDefTexts.js");

    //banks
    scripts.push("js/runtime/banks/CImageBank.js");
    scripts.push("js/runtime/banks/CImage.js");
    scripts.push("js/runtime/banks/CSoundBank.js");
    scripts.push("js/runtime/banks/CSound.js");
    scripts.push("js/runtime/banks/CFontBank.js");
    scripts.push("js/runtime/banks/CFont.js");
    scripts.push("js/runtime/banks/CMosaic.js");

    //values
    scripts.push("js/runtime/values/CDefStrings.js");
    scripts.push("js/runtime/values/CDefValues.js");
    scripts.push("js/runtime/values/CRVal.js");

    //transitions
    scripts.push("js/runtime/transitions/CTransitionData.js");
    scripts.push("js/runtime/transitions/CTransition.js");
    scripts.push("js/runtime/transitions/CTrans.js");
    scripts.push("js/runtime/transitions/CTransitionManager.js");

    //box2d
    scripts.push("js/runtime/box2d/CContactListener.js");
    scripts.push("js/runtime/box2d/CJoint.js");

    //preloaders
    scripts.push("js/runtime/preloaders/CPreloaderProgress.js");
    scripts.push("js/runtime/preloaders/CPreloaderBlank.js");
    scripts.push("js/runtime/preloaders/CPreloaderImage.js");
    scripts.push("js/runtime/preloaders/CPreloaderFrame.js");
    scripts.push("js/runtime/preloaders/CPreloaderLastFrameBuffer.js");

    //dialogs
    scripts.push("js/runtime/dialogs/CDialog.js");
    scripts.push("js/runtime/dialogs/CMessageDialog.js");
    scripts.push("js/runtime/dialogs/CInputDialog.js");

    //targets
    scripts.push("js/runtime/targets/w10/CW10Runtime.js");
    scripts.push("js/runtime/targets/w10/CW10Application.js");
    scripts.push("js/runtime/targets/w10/CW10Gamepad.js");
    scripts.push("js/runtime/targets/w10/CW10MessageDialog.js");
    scripts.push("js/runtime/targets/w10/CW10InputDialog.js");
    //scripts.push("js/runtime/targets/web/CWebPolyfill.js");
    //scripts.push("js/runtime/targets/web/CWebRuntime.js");
    //scripts.push("js/runtime/targets/web/CWebApplication.js");
    //scripts.push("js/runtime/targets/web/CWebGamepad.js");
    //scripts.push("js/runtime/targets/web/CWebMessageDialog.js");
    //scripts.push("js/runtime/targets/web/CWebInputDialog.js");


    //conditions
    scripts.push("js/runtime/conditions/CCnd.js");
    scripts.push("js/runtime/conditions/CND_NEVER.js");
    scripts.push("js/runtime/conditions/CND_ALWAYS.js");
    scripts.push("js/runtime/conditions/CND_COMPARE.js");
    scripts.push("js/runtime/conditions/CND_NOTALWAYS.js");
    scripts.push("js/runtime/conditions/CND_ONCE.js");
    scripts.push("js/runtime/conditions/CND_EXTCHOOSE.js");
    scripts.push("js/runtime/conditions/CND_START.js");
    scripts.push("js/runtime/conditions/CND_EVERY2.js");
    scripts.push("js/runtime/conditions/CND_TIMEREQUALS.js");
    scripts.push("js/runtime/conditions/CND_KBKEYDEPRESSED.js");
    scripts.push("js/runtime/conditions/CND_KBPRESSKEY.js");
    scripts.push("js/runtime/conditions/CND_MCLICK.js");
    scripts.push("js/runtime/conditions/CND_MCLICKONOBJECT.js");
    scripts.push("js/runtime/conditions/CND_MKEYDEPRESSED.js");
    scripts.push("js/runtime/conditions/CND_MONOBJECT.js");
    scripts.push("js/runtime/conditions/CND_CCOUNTER.js");
    scripts.push("js/runtime/conditions/CND_EXTANIMENDOF.js");
    scripts.push("js/runtime/conditions/CND_EXTCMPVAR.js");
    scripts.push("js/runtime/conditions/CND_EXTCMPVARCONST.js");
    scripts.push("js/runtime/conditions/CND_EXTCMPX.js");
    scripts.push("js/runtime/conditions/CND_EXTFLAGSET.js");
    scripts.push("js/runtime/conditions/CND_EXTISCOLBACK.js");
    scripts.push("js/runtime/conditions/CND_EXTISCOLLIDING.js");
    scripts.push("js/runtime/conditions/CND_EXTNEARBORDERS.js");
    scripts.push("js/runtime/conditions/CND_EXTNUMOFOBJECT.js");
    scripts.push("js/runtime/conditions/CND_EXTSHOWN.js");
    scripts.push("js/runtime/conditions/CND_EXTSTOPPED.js");
    //actions
    scripts.push("js/runtime/actions/CAct.js");
    scripts.push("js/runtime/actions/CLoop.js");
    scripts.push("js/runtime/actions/ACT_SKIP.js");
    scripts.push("js/runtime/actions/ACT_PLAYCHANNEL.js");
    scripts.push("js/runtime/actions/ACT_PLAYLOOPCHANNEL.js");
    scripts.push("js/runtime/actions/ACT_SETCHANNELVOL.js");
    scripts.push("js/runtime/actions/ACT_SETSAMPLEMAINVOL.js");
    scripts.push("js/runtime/actions/ACT_STOPSAMPLE.js");
    scripts.push("js/runtime/actions/ACT_STRSETSTRING.js");
    scripts.push("js/runtime/actions/ACT_CADDVALUE.js");
    scripts.push("js/runtime/actions/ACT_CSETCOLOR1.js");
    scripts.push("js/runtime/actions/ACT_CSETMAX.js");
    scripts.push("js/runtime/actions/ACT_CSETVALUE.js");
    scripts.push("js/runtime/actions/ACT_CSUBVALUE.js");
    scripts.push("js/runtime/actions/ACT_CDISPLAY.js");
    scripts.push("js/runtime/actions/ACT_CDISPLAYX.js");
    scripts.push("js/runtime/actions/ACT_ENDGAME.js");
    scripts.push("js/runtime/actions/ACT_GOLEVEL.js");
    scripts.push("js/runtime/actions/ACT_NEXTLEVEL.js");
    scripts.push("js/runtime/actions/ACT_CREATE.js");
    scripts.push("js/runtime/actions/ACT_EXTCHGFLAG.js");
    scripts.push("js/runtime/actions/ACT_EXTCHGFLAGCONST.js");
    scripts.push("js/runtime/actions/ACT_EXTDESTROY.js");
    scripts.push("js/runtime/actions/ACT_EXTDISPLAYDURING.js");
    scripts.push("js/runtime/actions/ACT_EXTFORCEANIM.js");
    scripts.push("js/runtime/actions/ACT_EXTFORCESPEED.js");
    scripts.push("js/runtime/actions/ACT_EXTHIDE.js");
    scripts.push("js/runtime/actions/ACT_EXTSELMOVE.js");
    scripts.push("js/runtime/actions/ACT_EXTSETALPHACOEF.js");
    scripts.push("js/runtime/actions/ACT_EXTSETDIR.js");
    scripts.push("js/runtime/actions/ACT_EXTSETPOS.js");
    scripts.push("js/runtime/actions/ACT_EXTSETVAR.js");
    scripts.push("js/runtime/actions/ACT_EXTSETVARCONST.js");
    scripts.push("js/runtime/actions/ACT_EXTSETX.js");
    scripts.push("js/runtime/actions/ACT_EXTSETY.js");
    scripts.push("js/runtime/actions/ACT_EXTSHOW.js");
    scripts.push("js/runtime/actions/ACT_EXTSPEED.js");
    scripts.push("js/runtime/actions/ACT_EXTSPRBACK.js");
    scripts.push("js/runtime/actions/ACT_EXTADDVAR.js");
    scripts.push("js/runtime/actions/ACT_EXTADDVARCONST.js");
    scripts.push("js/runtime/actions/ACT_EXTSUBVAR.js");
    scripts.push("js/runtime/actions/ACT_EXTSUBVARCONST.js");
    //expressions
    scripts.push("js/runtime/expressions/CExp.js");
    scripts.push("js/runtime/expressions/EXP_EMPTY.js");
    scripts.push("js/runtime/expressions/EXP_ZERO.js");
    scripts.push("js/runtime/expressions/EXP_LONG.js");
    scripts.push("js/runtime/expressions/EXP_DOUBLE.js");
    scripts.push("js/runtime/expressions/EXP_EXTVAR.js");
    scripts.push("js/runtime/expressions/EXP_EXTVARSTRING.js");
    scripts.push("js/runtime/expressions/EXP_STRINGGLONAMED.js");
    scripts.push("js/runtime/expressions/EXP_VARGLONAMED.js");
    scripts.push("js/runtime/expressions/EXP_STRING.js");
    scripts.push("js/runtime/expressions/EXP_EXTVARBYINDEX.js");
    scripts.push("js/runtime/expressions/EXP_EXTVARSTRINGBYINDEX.js");
    scripts.push("js/runtime/expressions/EXP_DIV.js");
    scripts.push("js/runtime/expressions/EXP_MINUS.js");
    scripts.push("js/runtime/expressions/EXP_MULT.js");
    scripts.push("js/runtime/expressions/EXP_PARENTH1.js");
    scripts.push("js/runtime/expressions/EXP_PARENTH2.js");
    scripts.push("js/runtime/expressions/EXP_PLUS.js");
    scripts.push("js/runtime/expressions/EXP_RANDOM.js");
    scripts.push("js/runtime/expressions/EXP_STR.js");
    scripts.push("js/runtime/expressions/EXP_CVALUE.js");
    scripts.push("js/runtime/expressions/EXP_EXTXSPR.js");
    scripts.push("js/runtime/expressions/EXP_EXTYSPR.js");
    scripts.push("js/runtime/expressions/EXP_XMOUSE.js");
    scripts.push("js/runtime/expressions/EXP_YMOUSE.js");
    //extensions_begin
    scripts.push("js/runtime/extensions/source/kcini.js");
    scripts.push("js/runtime/extensions/source/Perspective.js");
    scripts.push("js/runtime/extensions/source/KcButton.js");
    //extensions_end

	//movements
    scripts.push("js/runtime/movements/source/MoveBall.js");
    scripts.push("js/runtime/movements/source/MoveBullet.js");
    scripts.push("js/runtime/movements/source/MoveDisappear.js");
    scripts.push("js/runtime/movements/source/MoveGeneric.js");
    scripts.push("js/runtime/movements/source/MoveMouse.js");
    scripts.push("js/runtime/movements/source/MovePath.js");
    scripts.push("js/runtime/movements/source/MovePlatform.js");
    scripts.push("js/runtime/movements/source/MoveRace.js");
    scripts.push("js/runtime/movements/source/MoveStatic.js");

    //movement_extensions_begin
    scripts.push("js/runtime/movements/source/clickteam_dragdrop.js");
    //movement_extensions_end

    //transitions
    scripts.push("js/runtime/transitions/CTransition.js");
    scripts.push("js/runtime/transitions/CTransitionData.js");
    scripts.push("js/runtime/transitions/CTransitionCCTrans.js");
    scripts.push("js/runtime/transitions/CTransitionManager.js");
    scripts.push("js/runtime/transitions/CTrans.js");
    scripts.push("js/runtime/transitions/CTransAdvancedScrolling.js");
    scripts.push("js/runtime/transitions/CTransBack.js");
    scripts.push("js/runtime/transitions/CTransBand.js");
    scripts.push("js/runtime/transitions/CTransCell.js");
    scripts.push("js/runtime/transitions/CTransDoor.js");
    scripts.push("js/runtime/transitions/CTransFade.js");
    scripts.push("js/runtime/transitions/CTransLine.js");
    scripts.push("js/runtime/transitions/CTransMosaic.js");
    scripts.push("js/runtime/transitions/CTransOpen.js");
    scripts.push("js/runtime/transitions/CTransPush.js");
    scripts.push("js/runtime/transitions/CTransScroll.js");
    scripts.push("js/runtime/transitions/CTransSquare.js");
    scripts.push("js/runtime/transitions/CTransStretch.js");
    scripts.push("js/runtime/transitions/CTransStretch2.js");
    scripts.push("js/runtime/transitions/CTransTrame.js");
    scripts.push("js/runtime/transitions/CTransTurn.js");
    scripts.push("js/runtime/transitions/CTransTurn2.js");
    scripts.push("js/runtime/transitions/CTransZigZag.js");
    scripts.push("js/runtime/transitions/CTransZigZag2.js");
    scripts.push("js/runtime/transitions/CTransZoom.js");
    scripts.push("js/runtime/transitions/CTransZoom2.js");
	//next_script

    //load all of the scripts
    var now = Date.now();
    for (var index in scripts) {
        var script = scripts[index];
        document.write('<script src="' + script + '?' + now + '" type="text/javascript"></script>');
    }
    //multiple_source_code_end

    //create the winJS app
    var appWinJS = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var isFirstActivation = true;
    var _scope = appWinJS;

    //make sure tehre is an empty Runtime object
    var runtimeCreated = false;
    if (typeof window.Runtime == "undefined") {
        window.Runtime = {};
    }

    //add some app argss
    appWinJS.onactivated = function (args) {
        //what type of launch
        if (args.detail.kind == activation.ActivationKind.launch) {
            //check previous mode of execution
            switch(args.detail.previousExecutionState) {
                case activation.ApplicationExecutionState.running:
                    //still running so dont have to do anything
                    break;
                case activation.ApplicationExecutionState.suspended:
                    //resume app

                    //update timer details before
                    Runtime.application.timer = Date.now();

                    //now resume
                    Runtime.application.run.resume();

                    break;
            }
        }

        //add visibility handler and let the app process
        if (isFirstActivation) {
            // TODO: The app was activated and had not been running. Do general startup initialization here.
            document.addEventListener("visibilitychange", onVisibilityChanged);

            args.setPromise(WinJS.UI.processAll());
        }

        isFirstActivation = false;
    };

    appWinJS.onbackclick = function (evt) {
        if (Runtime.isConsole())
            return true;
        return false;
    };

    function onVisibilityChanged(args) {
        //check if app is showing or hiding
        if (!document.hidden && !runtimeCreated) {
            //check if this is for the first time
            if (!runtimeCreated) {
                //create the runtime
                window.Runtime = new CW10Runtime();
                runtimeCreated = true;

                //init
                window.Runtime.onSetupDevice();
                window.Runtime.onInit(document.getElementById('FusionRoot'), document.getElementById('FusionCanvas'), document.getElementById('FusionContainer'), '../resources/FNAF2UWP.cch', _scope);
                window.Runtime.onSetupEvents();
            }
        }
    }

    appWinJS.addEventListener("checkpoint", function (args) {
        //the app is "suspending" so we have teh oppertunity to save some data
        if (Runtime.application) {
            //save some stuff to the session state (this will be available if the app then terminates)
            //WinJS.Application.sessionState.fusionState = { blah: 123 };

            //set async task to let fusion update once!
            args.setPromise(new WinJS.Promise(function (complete, error) {
                //we should inform the app that it is suspending

                //we now call an update in the app
                Runtime.application.onUpdate();

                //finish the async task
                complete();

            }).then(function () {
                //so the async task has complete, so we should tell fusion to pause the app
                Runtime.application.run.pause(true);//true keeps sounds active
            }));
        }
    });

    //we have to add teh resuming event differently to activated/checkpoint, just because the SDK says so...
    Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", function (args) {
        //the app is resuming from a paused state, everything should be safe to continue without doing anything
        if (Runtime.application) {
            Runtime.application.run.resume(false);

            //trigger end of pause event, this is a bit hacky that we are doing it by hand, there should be a built in API in fusion rumtime...
            if (Runtime.application.appRunningState == CRunApp.SL_FRAMELOOPFIRST || Runtime.application.appRunningState == CRunApp.SL_FRAMELOOP) {
                //we only allow this if the frame was currently running in teh FRAMELOOP otherwise it will crash the runtime.. eg if it was in a frame transition

                //setup end of pause variable so teh condition returns true
                Runtime.application.run.rh4EndOfPause = this.rhLoopCount;

                //handle the condition: (-8 << 16) | 0xFFFD = CND_ENDOFPAUSE
                Runtime.application.run.rhEvtProg.handle_GlobalEvents((-8 << 16) | 0xFFFD);
            }
        }

    }, false);

    //bootup the app
    appWinJS.start();
})();
