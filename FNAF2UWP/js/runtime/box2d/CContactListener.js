// CContactListener : objet Physics - Engine
// -----------------------------------------------------------------
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

CContactListener.CNDL_EXTCOLLISION = (-14 << 16);
CContactListener.CNDL_EXTCOLBACK = (-13 << 16);
CContactListener.BORDER_LEFT = 1;
CContactListener.BORDER_RIGHT = 2;
CContactListener.BORDER_TOP = 4;
CContactListener.BORDER_BOTTOM = 8;
CContactListener.CNDL_EXTOUTPLAYFIELD = (-12 << 16);
CContactListener.MAGIC = 0x12345678;
CContactListener.CND_PARTICULECOLLISION = 1;
CContactListener.CND_PARTICULEOUTLEFT = 2;
CContactListener.CND_PARTICULEOUTRIGHT = 3;
CContactListener.CND_PARTICULEOUTTOP = 4;
CContactListener.CND_PARTICULEOUTBOTTOM = 5;
CContactListener.CND_PARTICULESCOLLISION = 6;
CContactListener.CND_PARTICULECOLLISIONBACKDROP = 7;
CContactListener.CND_ELEMENTSCOLLISION = 1;

function CContactListener() {
    this.bWorking = false;
}

CContactListener.prototype = {
    PreSolve: function (contact, oldManifold) {
        this.bWorking = true;

        var worldManifold = new Box2D.Collision.b2WorldManifold();
        contact.GetWorldManifold(worldManifold);
        var bodyA = contact.GetFixtureA().GetBody();
        var bodyB = contact.GetFixtureB().GetBody();
        var rdPtr = contact.GetFixtureA().GetUserData();
        var rhPtr = rdPtr.ho.hoAdRunHeader;

        var movement1 = bodyA.GetUserData();
        var movement2 = bodyB.GetUserData();
        var movement;
        var movementB;

        var pHo;
        var particule, element, parent, rope;
        if (movement1 == null || movement2 == null) {
            contact.SetEnabled(false);
        }
        else if (movement1.m_type == CRunMBase.MTYPE_BORDERLEFT || movement2.m_type == CRunMBase.MTYPE_BORDERLEFT) {
            if (movement1.m_type == CRunMBase.MTYPE_BORDERLEFT) {
                movement = movement2;
                movementB = movement1;
            }
            else {
                movement = movement1;
                movementB = movement2;
            }
            pHo = movement.m_pHo;
            switch (movement.m_type) {
                case CRunMBase.MTYPE_OBJECT:
                    movement.PrepareCondition();
                    movement.SetCollidingObject(movementB);
                    pHo = movement.m_pHo;
                    rhPtr.rhEvtProg.rhCurParam0 = CContactListener.BORDER_LEFT;
                    rhPtr.rhEvtProg.handle_Event(pHo, CContactListener.CNDL_EXTOUTPLAYFIELD);
                    if (!movement.IsStop()) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_FAKEOBJECT:
                    contact.SetEnabled(false);
                    break;
                case CRunMBase.MTYPE_PARTICULE:
                    particule = movement;
                    parent = particule.parent;
                    parent.currentParticule1 = particule;
                    parent.currentParticule2 = null;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULEOUTLEFT, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_ELEMENT:
                    element = movement;
                    parent = element.parent;
                    parent.currentElement = element;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULEOUTLEFT, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
            }
        }
        else if (movement1.m_type == CRunMBase.MTYPE_BORDERRIGHT || movement2.m_type == CRunMBase.MTYPE_BORDERRIGHT) {
            if (movement1.m_type == CRunMBase.MTYPE_BORDERRIGHT) {
                movement = movement2;
                movementB = movement1;
            }
            else {
                movement = movement1;
                movementB = movement2;
            }
            pHo = movement.m_pHo;
            switch (movement.m_type) {
                case CRunMBase.MTYPE_OBJECT:
                    movement.PrepareCondition();
                    movement.SetCollidingObject(movementB);
                    pHo = movement.m_pHo;
                    rhPtr.rhEvtProg.rhCurParam0 = CContactListener.BORDER_RIGHT;
                    rhPtr.rhEvtProg.handle_Event(pHo, CContactListener.CNDL_EXTOUTPLAYFIELD);
                    if (!movement.IsStop()) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_FAKEOBJECT:
                    contact.SetEnabled(false);
                    break;
                case CRunMBase.MTYPE_PARTICULE:
                    particule = movement;
                    parent = particule.parent;
                    parent.currentParticule1 = particule;
                    parent.currentParticule2 = null;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULEOUTRIGHT, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_ELEMENT:
                    element = movement;
                    parent = element.parent;
                    parent.currentElement = element;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULEOUTRIGHT, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
            }
        }
        else if (movement1.m_type == CRunMBase.MTYPE_BORDERTOP || movement2.m_type == CRunMBase.MTYPE_BORDERTOP) {
            if (movement1.m_type == CRunMBase.MTYPE_BORDERTOP) {
                movement = movement2;
                movementB = movement1;
            }
            else {
                movement = movement1;
                movementB = movement2;
            }
            pHo = movement.m_pHo;
            switch (movement.m_type) {
                case CRunMBase.MTYPE_OBJECT:
                    movement.PrepareCondition();
                    movement.SetCollidingObject(movementB);
                    pHo = movement.m_pHo;
                    rhPtr.rhEvtProg.rhCurParam0 = CContactListener.BORDER_TOP;
                    rhPtr.rhEvtProg.handle_Event(pHo, CContactListener.CNDL_EXTOUTPLAYFIELD);
                    if (!movement.IsStop()) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_FAKEOBJECT:
                    contact.SetEnabled(false);
                    break;
                case CRunMBase.MTYPE_PARTICULE:
                    particule = movement;
                    parent = particule.parent;
                    parent.currentParticule1 = particule;
                    parent.currentParticule2 = null;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULEOUTTOP, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_ELEMENT:
                    element = movement;
                    parent = element.parent;
                    parent.currentElement = element;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULEOUTTOP, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
            }
        }
        else if (movement1.m_type == CRunMBase.MTYPE_BORDERBOTTOM || movement2.m_type == CRunMBase.MTYPE_BORDERBOTTOM) {
            if (movement1.m_type == CRunMBase.MTYPE_BORDERBOTTOM) {
                movement = movement2;
                movementB = movement1;
            }
            else {
                movement = movement1;
                movementB = movement2;
            }
            pHo = movement.m_pHo;
            switch (movement.m_type) {
                case CRunMBase.MTYPE_OBJECT:
                    movement.PrepareCondition();
                    movement.SetCollidingObject(movementB);
                    pHo = movement.m_pHo;
                    rhPtr.rhEvtProg.rhCurParam0 = CContactListener.BORDER_BOTTOM;
                    rhPtr.rhEvtProg.handle_Event(pHo, CContactListener.CNDL_EXTOUTPLAYFIELD);
                    if (!movement.IsStop()) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_FAKEOBJECT:
                    contact.SetEnabled(false);
                    break;
                case CRunMBase.MTYPE_PARTICULE:
                    particule = movement;
                    parent = particule.parent;
                    parent.currentParticule1 = particule;
                    parent.currentParticule2 = null;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULEOUTBOTTOM, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_ELEMENT:
                    element = movement;
                    parent = element.parent;
                    parent.currentElement = element;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULEOUTBOTTOM, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
            }
        }
        else if (movement1.m_type == CRunMBase.MTYPE_OBSTACLE || movement2.m_type == CRunMBase.MTYPE_OBSTACLE) {
            if (movement1.m_type == CRunMBase.MTYPE_OBSTACLE) {
                movement = movement2;
                movementB = movement1;
            }
            else {
                movement = movement1;
                movementB = movement2;
            }
            pHo = movement.m_pHo;
            switch (movement.m_type) {
                case CRunMBase.MTYPE_OBJECT:
                    movement.PrepareCondition();
                    movement.SetCollidingObject(movementB);
                    pHo = movement.m_pHo;
                    rhPtr.rhEvtProg.handle_Event(pHo, CContactListener.CNDL_EXTCOLBACK);
                    if (!movement.IsStop()) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_FAKEOBJECT:
                    contact.SetEnabled(false);
                    break;
                case CRunMBase.MTYPE_PARTICULE:
                    particule = movement;
                    parent = particule.parent;
                    parent.currentParticule1 = particule;
                    parent.currentParticule2 = null;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULECOLLISIONBACKDROP, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
                case CRunMBase.MTYPE_ELEMENT:
                    element = movement;
                    parent = element.parent;
                    parent.currentElement = element;
                    parent.stopped = false;
                    pHo.generateEvent(CContactListener.CND_PARTICULECOLLISIONBACKDROP, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    }
                    break;
            }
        }
        else if (movement1.m_type == CRunMBase.MTYPE_PLATFORM || movement2.m_type == CRunMBase.MTYPE_PLATFORM) {
            var velocity;
            if (movement1.m_type == CRunMBase.MTYPE_PLATFORM) {
                movement = movement2;
                movementB = movement1;
                velocity = bodyB.GetLinearVelocity();
            }
            else {
                movement = movement1;
                movementB = movement2;
                velocity = bodyA.GetLinearVelocity();
            }
            pHo = movement.m_pHo;
            switch (movement.m_type) {
                case CRunMBase.MTYPE_OBJECT:
                    movement.PrepareCondition();
                    movement.SetCollidingObject(movementB);
                    rhPtr.rhEvtProg.handle_Event(pHo, CContactListener.CNDL_EXTCOLBACK);
                    if (!movement.IsStop()) {
                        contact.SetEnabled(false);
                    }
                    else {
                        // Build 286.0: don't disable the contact if the platform is under the feet of the object
                        var bPlatformUnder = false;
                        if (movement.m_base != null) {
                            var o = {};
                            movement.m_base.rGetBodyPosition(movementB.m_body, o);
                            var left = o.x + movementB.rc.left;
                            var right = o.x + movementB.rc.right;
                            var top = o.y + movementB.rc.top;
                            var bottom = o.y + movementB.rc.bottom;
                            if (pHo.hoX >= left && pHo.hoX <= right && pHo.hoY <= bottom)	// platform under the feet of the object?
                            {
                                bPlatformUnder = true;
                            }
                        }
                        if (!bPlatformUnder) {
                            if (velocity.y >= 0) {
                                contact.SetEnabled(false);
                            }
                        }
                    }
                    break;
                case CRunMBase.MTYPE_FAKEOBJECT:
                    contact.SetEnabled(false);
                    break;
                case CRunMBase.MTYPE_PARTICULE:
                    particule = movement;
                    parent = particule.parent;
                    parent.currentParticule1 = particule;
                    parent.currentParticule2 = null;
                    parent.stopped = false;
                    velocity = particule.m_body.GetLinearVelocity();
                    pHo.generateEvent(CContactListener.CND_PARTICULECOLLISIONBACKDROP, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    } else {
                        if (velocity.y >= 0) {
                            contact.SetEnabled(false);
                        }
                    }
                    break;
                case CRunMBase.MTYPE_ELEMENT:
                    element = movement;
                    parent = element.parent;
                    parent.currentElement = element;
                    parent.stopped = false;
                    velocity = element.m_body.GetLinearVelocity();
                    pHo.generateEvent(CContactListener.CND_PARTICULECOLLISIONBACKDROP, 0);
                    if (!parent.stopped) {
                        contact.SetEnabled(false);
                    } else {
                        if (velocity.y >= 0) {
                            contact.SetEnabled(false);
                        }
                    }
                    break;
            }
        }
        else {
            movement = movement1;
            obstacle = movement;
            switch (movement.m_type) {
                case CRunMBase.MTYPE_OBJECT:
                    switch (movement2.m_type) {
                        case CRunMBase.MTYPE_OBJECT:
                            if (movement.m_background) {
                                var temp = movement;
                                movement = movement2;
                                movement2 = temp;
                            }
                            movement.SetCollidingObject(movement2);
                            movement2.SetCollidingObject(movement);
                            movement.PrepareCondition();
                            movement2.PrepareCondition();
                            pHo = movement.m_pHo;
                            var pHo2 = movement2.m_pHo;
                            rhPtr.rhEvtProg.rh1stObjectNumber = pHo2.hoNumber;
                            rhPtr.rhEvtProg.handle_Event(pHo, CContactListener.CNDL_EXTCOLLISION);
                            if (!movement.IsStop() && !movement2.IsStop()) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_FAKEOBJECT:
                            movement.PrepareCondition();
                            movement.SetCollidingObject(movement2);
                            pHo = movement.m_pHo;
                            var pHo2 = movement2.m_pHo;
                            rhPtr.rhEvtProg.rh1stObjectNumber = pHo2.hoNumber;
                            rhPtr.rhEvtProg.handle_Event(pHo, CContactListener.CNDL_EXTCOLLISION);
                            if (!movement.IsStop()) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_PARTICULE:
                            particule = movement2;
                            parent = particule.parent;
                            parent.currentParticule1 = particule;
                            parent.currentParticule2 = null;
                            parent.stopped = false;
                            parent.collidingHO = movement.m_pHo;
                            movement.PrepareCondition();
                            movement.SetCollidingObject(movement2);
                            particule.m_pHo.generateEvent(CContactListener.CND_PARTICULECOLLISION, obstacle.m_pHo.hoOi);
                            if (!parent.stopped) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_ELEMENT:
                            element = movement2;
                            rope = element.parent;
                            rope.currentObject = obstacle;
                            rope.currentElement = element;
                            rope.stopped = false;
                            rope.collidingHO = movement.m_pHo;
                            movement.PrepareCondition();
                            movement.SetCollidingObject(movement2);
                            element.m_pHo.generateEvent(CContactListener.CND_ELEMENTSCOLLISION, obstacle.m_pHo.hoOi);
                            if (!movement.IsStop() && !rope.stopped) {
                                contact.SetEnabled(false);
                            }
                            break;
                    }
                    break;
                case CRunMBase.MTYPE_FAKEOBJECT:
                    switch (movement2.m_type) {
                        case CRunMBase.MTYPE_OBJECT:
                            movement2.PrepareCondition();
                            movement2.SetCollidingObject(movement);
                            rhPtr.rhEvtProg.rh1stObjectNumber = movement.m_pHo.hoNumber;
                            rhPtr.rhEvtProg.handle_Event(movement2.m_pHo, CContactListener.CNDL_EXTCOLLISION);
                            if (!movement2.IsStop()) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_FAKEOBJECT:
                            //                          rhPtr.rhEvtProg.rh1stObjectNumber = movement2.m_pHo.hoNumber;
                            //                          rhPtr.rhEvtProg.handle_Event(movement.m_pHo, CContactListener.CNDL_EXTCOLLISION);
                            contact.SetEnabled(false);
                            break;
                        case CRunMBase.MTYPE_PARTICULE:
                            particule = movement2;
                            parent = particule.parent;
                            parent.currentParticule1 = particule;
                            parent.currentParticule2 = null;
                            parent.stopped = false;
                            parent.collidingHO = movement.m_pHo;
                            movement.PrepareCondition();
                            particule.m_pHo.generateEvent(CContactListener.CND_PARTICULECOLLISION, obstacle.m_pHo.hoOi);
                            if (!parent.stopped) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_ELEMENT:
                            element = movement2;
                            rope = element.parent;
                            rope.currentObject = obstacle;
                            rope.currentElement = element;
                            rope.stopped = false;
                            rope.collidingHO = movement.m_pHo;
                            movement.PrepareCondition();
                            element.m_pHo.generateEvent(CContactListener.CND_ELEMENTSCOLLISION, obstacle.m_pHo.hoOi);
                            if (!rope.stopped) {
                                contact.SetEnabled(false);
                            }
                            break;
                    }
                    break;
                case CRunMBase.MTYPE_PARTICULE:
                    switch (movement2.m_type) {
                        case CRunMBase.MTYPE_OBJECT:
                            particule = movement;
                            parent = particule.parent;
                            parent.currentParticule1 = particule;
                            parent.currentParticule2 = null;
                            parent.stopped = false;
                            parent.collidingHO = movement2.m_pHo;
                            movement2.PrepareCondition();
                            movement2.SetCollidingObject(movement);
                            movement.m_pHo.generateEvent(CContactListener.CND_PARTICULECOLLISION, movement2.m_pHo.hoOi);
                            if (!parent.stopped) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_FAKEOBJECT:
                            particule = movement;
                            parent = particule.parent;
                            parent.currentParticule1 = particule;
                            parent.currentParticule2 = null;
                            parent.stopped = false;
                            movement2.PrepareCondition();
                            movement.m_pHo.generateEvent(CContactListener.CND_PARTICULECOLLISION, movement2.m_pHo.hoOi);
                            if (!parent.stopped) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_PARTICULE:
                            var parent = movement.parent;
                            parent.currentParticule1 = movement1;
                            parent.currentParticule2 = movement2;
                            parent.stopped = false;
                            movement.m_pHo.generateEvent(CContactListener.CND_PARTICULESCOLLISION, 0);
                            if (!parent.stopped) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_ELEMENT:
                            contact.SetEnabled(false);
                            break;
                        /*                          particule = movement;
                         parent = particule.parent;
                         parent.currentParticule1 = particule;
                         parent.currentParticule2 = null;
                         parent.stopped = false;
                         var rope = movement2.parent;
                         rope.currentElement = movement2;
                         rope.stopped = false;
                         movement.m_pHo.generateEvent(CContactListener.CND_PARTICULESCOLLISION, 0);
                         movement2.m_pHo.generateEvent(CContactListener.CND_ELEMENTSCOLLISION, 0);
                         if (!parent.stopped && !rope.stopped)
                         contact.SetEnabled(false);
                         break;
                         */
                    }
                    break;
                case CRunMBase.MTYPE_ELEMENT:
                    switch (movement2.m_type) {
                        case CRunMBase.MTYPE_OBJECT:
                            element = movement;
                            parent = element.parent;
                            parent.currentElement = element;
                            parent.stopped = false;
                            parent.collidingHO = movement2.m_pHo;
                            movement2.PrepareCondition();
                            movement2.SetCollidingObject(movement);
                            movement1.m_pHo.generateEvent(CContactListener.CND_ELEMENTSCOLLISION, movement2.m_pHo.hoOi);
                            if (!movement2.IsStop() && !parent.stopped) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_FAKEOBJECT:
                            element = movement;
                            parent = element.parent;
                            parent.currentElement = element;
                            parent.stopped = false;
                            movement2.PrepareCondition();
                            movement1.m_pHo.generateEvent(CContactListener.CND_ELEMENTSCOLLISION, movement2.m_pHo.hoOi);
                            if (!movement2.IsStop() && !parent.stopped) {
                                contact.SetEnabled(false);
                            }
                            break;
                        case CRunMBase.MTYPE_PARTICULE:
                            contact.SetEnabled(false);
                            break;
                        /*                          particule = movement2;
                         parent = particule.parent;
                         parent.currentParticule1 = particule;
                         parent.currentParticule2 = null;
                         parent.stopped = false;
                         var rope = movement1.parent;
                         rope.currentElement = movement1;
                         rope.stopped = false;
                         movement2.m_pHo.generateEvent(CContactListener.CND_PARTICULESCOLLISION, 0);
                         movement1.m_pHo.generateEvent(CContactListener.CND_ELEMENTSCOLLISION, 0);
                         if (!parent.stopped && !rope.stopped)
                         contact.SetEnabled(false);
                         break;
                         */
                        case CRunMBase.MTYPE_ELEMENT:
                            contact.SetEnabled(false);
                            break;
                    }
                    break;
            }
        }
        this.bWorking = false;
    },

    BeginContact: function () {
    },

    EndContact: function () {
    },

    PostSolve: function () {
    }
}
