//this file gets generated at compile time and are referenced by the runtime

CCompiledMovements = {};

CCompiledMovements.loadMvtExtension = function (extName) {
    //must be called via blah.call(this);

    var object = null;

    
    if (extName=="clickteam-dragdrop") object=new CRunMvtclickteam_dragdrop();

    return object;
};
