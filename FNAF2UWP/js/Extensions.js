//this file gets generated at compile time and are referenced by the runtime

CCompiledExtensions = {};

CCompiledExtensions.createList = function () {
    //must be called via blah.call(this);

    var extMaxHandle = 4;
    if (extMaxHandle) {
        this.extensions = new Array(extMaxHandle);
        this.numOfConditions = new Array(extMaxHandle);
        var n;
        for (n = 0; n < extMaxHandle; n++) {
            this.extensions[n] = null;
            this.numOfConditions[n] = 0;
        }

        var e;

        // START_ADDEXT
            e = new CExtLoad();
            e.handle = 0;
            this.addExt(e);
            e = new CExtLoad();
            e.handle = 2;
            this.addExt(e);
            e = new CExtLoad();
            e.handle = 3;
            this.addExt(e);
        // INCLUDE_ADDEXT
    }
};

CCompiledExtensions.loadRunObject = function () {
    //must be called via blah.call(this);
    switch (this.handle) {
        // START_NEWEXT
        case 0:
            return new CRunkcini();
        case 2:
            return new CRunPerspective();
        case 3:
            return new CRunKcButton();
        // INCLUDE_NEWEXT
    }

    return null;
};
