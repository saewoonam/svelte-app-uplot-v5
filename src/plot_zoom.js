/*
 * Originally from 
 * https://github.com/dukelec/cdbus_gui/tree/master/html
 *
 * Software License Agreement (MIT License)
 *
 * Author: Duke Fong <d@d-l.io>
 *
 *
 * Modified for use by SaeWoo
 *   Fixed a bug in the wheel zoom.  Some mice alter deltaX on wheel when shift key is pressed 
 */

let shift_key = false;
let ctrl_key = false;

window.addEventListener('keydown', function(e) {
    if (e.keyCode == 16)
        shift_key = true;
    if (e.keyCode == 17)
        ctrl_key = true;
});
window.addEventListener('keyup', function(e) {
    if (e.keyCode == 16)
        shift_key = false;
    if (e.keyCode == 17)
        ctrl_key = false;
});


function wheelZoomPlugin(opts) {
    let factor = opts.factor || 0.75;
    let uPlot = opts.uPlot || null; 
    let xMin, xMax, yMin, yMax, xRange, yRange;

    function clamp(nRange, nMin, nMax, fRange, fMin, fMax) {
        if (nRange > fRange) {
            nMin = fMin;
            nMax = fMax;
        }
        else if (nMin < fMin) {
            nMin = fMin;
            nMax = fMin + nRange;
        }
        else if (nMax > fMax) {
            nMax = fMax;
            nMin = fMax - nRange;
        }

        return [nMin, nMax];
    }

    return {
        hooks: {
            ready: u => {
                /*
                xMin = u.scales.x.min;
                xMax = u.scales.x.max;
                yMin = u.scales.y.min;
                yMax = u.scales.y.max;

                xRange = xMax - xMin;
                yRange = yMax - yMin;
                */
                let plot = u.root.querySelector(".u-over");
                let rect = plot.getBoundingClientRect();
                // wheel drag pan
                plot.addEventListener("mousedown", e => {
                    console.log('mousedown:(u, plot, e)', u, plot, e);
                    //if ((e.button == 0) && (e.shiftKey)) {
                    if ((e.button == 1)||(e.button==0))  {
                        plot.style.cursor = "drag";
                        e.preventDefault();

                        let left0 = e.clientX;
                        let top0 = e.clientY;
                        let {left, top} = u.cursor;
                        console.log('u.cursor:',u.cursor);
                        left0 = left;
                        top0 = top;
                        // let left0 = e.screenX;
                        // let top0 = e.screenY;
                        console.log('left0, top0', left0, top0);
                        console.log(
                            'plot left0, top0', 
                            // u.posToVal(left0,'x', true),
                            u.posToVal(left0,'x', false),
                            // u.posToVal(top0, 'y', true),
                            u.posToVal(top0, 'y', false));
                        console.log(' cursor left, top', left, top);
                        console.log('plot left, top', 
                            u.posToVal(left,'x', false),
                            u.posToVal(top, 'y', false));
                        let scXMin0 = u.scales.x.min;
                        let scXMax0 = u.scales.x.max;
                        let scYMin0 = u.scales.y.min;
                        let scYMax0 = u.scales.y.max;
                        /*
                        console.log('compare xmin', scXMin0 - xMin);
                        console.log('compare ymin', scYMin0 - yMin);
                        console.log('compare ymax', scYMax0 - yMax);
                        console.log('compare ymin', scYMin0 - yMin);
                        */
                        /*
                        let xUnitsPerPx = u.posToVal(1, 'x') - u.posToVal(0, 'x');
                        let yUnitsPerPx = u.posToVal(1, 'y') - u.posToVal(0, 'y');
                        console.log('xUnitsPerPx', xUnitsPerPx);
                        console.log('yUnitsPerPx', yUnitsPerPx);
                        console.log('u.PosToVal(1,y)', u.posToVal(1, 'y'),
                            u.posToVal(0, 'y'));
                        console.log('u.PosToVal(1,x)',u.posToVal(1, 'x'),
                            u.posToVal(0, 'x'));
                        */
                        console.log('scXMin0', scXMin0, 'scXMax0', scXMax0)
                        console.log('scYMin0', scYMin0, 'scYMax0', scYMax0)

                        // if ((scYMin0==null) | isNaN(scYMin0)) scYMin0 = 0.01
                        // if ((scYMax0==null) | isNaN(scYMax0)) scYMax0 = 1000
                        function onmove(e) {
                            e.preventDefault();

                            let left1 = e.clientX;
                            let top1 = e.clientY;
                            let {left, top} = u.cursor;
                            left1 = left;
                            top1 = top;
                            console.log('onmove');
                            console.log('left0, top0', left0, top0);
                            console.log('left1, top1', left1, top1);
                            console.log('u.cursor', u.cursor);
                            // let {left, top} = u.cursor;
                            console.log('mousemove cursor left, top', left, top);
                            console.log('plot left0, top0', u.posToVal(left0, 'x'),
                                                       u.posToVal(top0, 'y'));
                            console.log('plot left1, top1', u.posToVal(left1, 'x'),
                                                       u.posToVal(top1, 'y'));
                            
                            /*
                            let dx = xUnitsPerPx * (left1 - left0);
                            let dy = yUnitsPerPx * (top1 - top0);
                            */
                            let dx = u.posToVal(left1, 'x') - 
                                     u.posToVal(left0, 'x');
                            let dy = u.posToVal(top1, 'y') - 
                                     u.posToVal(top0, 'y');

                            console.log('dx,dy', dx, dy);
                            console.log('u ymin ymax', u.scales.y.min, u.scales.y.max)
                            let logy = u.scales.y.distr ;
                            let newscYMin0 = scYMin0 - dy
                            let newscYMax0 = scYMax0 - dy
                            if ((u.scales.y.min < 0) && (logy==3))
                              u.scales.y.min = 0.01;
                            if (logy==3) {
                                newscYMin0 = (scYMin0-dy>0) ? scYMin0 -dy : 0.01;
                                newscYMax0 = isNaN(scYMax0-dy) ? 1000: (scYMax0-dy);
                                let rangeLog = uPlot.rangeLog(newscYMin0,
                                    newscYMax0, 10, false);
                                // let rangeLog = uPlot.rangeLog(u.scales.y.min,
                                //     u.scales.y.max, 10, false);
                                console.log('rangeLog', rangeLog);
                                let rangeLog2 = (u.scales.y.min,
                                    u.scales.y.max, 10);
                                console.log('y.scales.range', rangeLog2);
                                // console.log('y.range', u.scales.y.range);
                                console.log((u.scales.y.min, 
                                    u.scales.y.max, 10));
                                newscYMin0 = rangeLog[0]
                                newscYMax0 = rangeLog[1]
                            }
                            u.batch(() => {
                                u.setScale("x", {
                                    min: scXMin0 - dx,
                                    max: scXMax0 - dx,
                                });

                                u.setScale("y", {
                                    min: newscYMin0,
                                    // min: scYMin0 - dy,
                                    max: newscYMax0,
                                    // max: scYMax0 - dy,
                                });
                                u.syncRect();
                            });
                            console.log('end of mousemove u.scales', u.scales.x.min,
                                u.scales.x.max,
                                u.scales.y.min,
                                u.scales.y.max
                            );
                        }

                        function onup(e) {
                            document.removeEventListener("mousemove", onmove);
                            document.removeEventListener("mouseup", onup);
                        }

                        document.addEventListener("mousemove", onmove);
                        document.addEventListener("mouseup", onup);
                    }
                });

                // wheel scroll zoom
                plot.addEventListener("wheel", e => {
                    e.preventDefault();
                    console.log('wheel zoom');
                    console.log('wheel u:', u);
                    let cursor = u.cursor
                    console.log('wheel u.cursor:', cursor);
                    console.log('wheel e:', e);
                    let left0 = e.clientX;
                    let top0 = e.clientY;
                    let {left, top} = u.cursor;
                    console.log('left, top from cursor', left, top);
                    let rect = plot.getBoundingClientRect();
                    console.log('rect', rect);
                    
                    let leftPct = left/rect.width;
                    let btmPct = 1 - top/rect.height;
                    let xVal = u.posToVal(left, "x");
                    let yVal = u.posToVal(top, "y");
                    console.log('xVal, yVal', xVal, yVal);
                    let scYMin0 = u.scales.y.min
                    let scYMax0 = u.scales.y.max
                    console.log('leftPCT, btmPct:', left, rect.width, leftPct, btmPct);
                    console.log('prezoom y', u.scales.y.min, u.scales.y.max)
                    if ((u.scales.y.min==null) | isNaN(u.scales.y.min)) scYMin0 = 0.01
                    if ((u.scales.y.max==null) | isNaN(u.scales.y.max)) scYMax0 = 500

                    let oxRange = u.scales.x.max - u.scales.x.min;
                    let oyRange;
                    let logy = u.scales.y.distr ;
                    if (logy==3) {
                        oyRange = Math.log10(scYMax0) - Math.log10(scYMin0);
                    } else {
                        oyRange = scYMax0 - scYMin0;
                    }
                    // let oyRange = u.scales.y.max - u.scales.y.min;
                    console.log('u.scales', u.scales.x.min,
                        u.scales.x.max,
                        u.scales.y.min,
                        u.scales.y.max
                    );
                    
                    let factor_x = shift_key ? 1.0 : factor;
                    let factor_y = ctrl_key ? 1.0 : factor;
                    console.log('shift', shift_key, 'ctrl', ctrl_key);
                    // console.log('deltaX', e.deltaX, 'deltaY', e.deltaY);
                    let nxRange = e.deltaY < 0 ? oxRange * factor_x : oxRange / factor_x;
                    let nxMin = xVal - leftPct * nxRange;
                    let nxMax = nxMin + nxRange;
                    console.log('deltaX', e.deltaX, 'deltaY', e.deltaY, 'nxMin', nxMin,
                    'nxMax', nxMax, 'oyRange', oyRange);
                    //[nxMin, nxMax] = clamp(nxRange, nxMin, nxMax, xRange, xMin, xMax);
                    // console.log(shift_key, ctrl_key);
                    let nyRange;
                    /*
                    if (shift_key) { // press shift key to only zoom y
                        nyRange = e.deltaX < 0 ? oyRange * factor_y : oyRange / factor_y;
                    } else {  // zoom y if no shift key is pressed and just wheel
                        nyRange = e.deltaY < 0 ? oyRange * factor_y : oyRange / factor_y;
                    }
                    */
                    nyRange = e.deltaY < 0 ? oyRange * factor_y : oyRange / factor_y;
                    if (e.deltaY==0) nyRange = e.deltaX < 0 ? oyRange * factor_y : oyRange / factor_y;
                    let nyMin = yVal - btmPct * nyRange;
                    let nyMax = nyMin + nyRange;
                    // console.log('factor', factor_x, factor_y);
                    // console.log('range', nxRange, nyRange);
                    //[nyMin, nyMax] = clamp(nyRange, nyMin, nyMax, yRange, yMin, yMax);
                    console.log('nxRange', nxRange, 'nxMin', nxMin, 'nxMax', nxMax);
                    console.log('nyRange', nyRange, 'nyMin', nyMin, 'nyMax', nyMax);
                    if (logy==3) {
                        let rangeLog = uPlot.rangeLog(nyMin, nyMax, 10, false);
                        nyMin = rangeLog[0];
                        nyMax = rangeLog[1];
                        console.log('adjust because of logy nyRange', nyRange, 'nyMin', nyMin, 'nyMax', nyMax);
                    }
                    u.batch(() => {
                        u.setScale("x", {
                            min: nxMin,
                            max: nxMax,
                        });

                        u.setScale("y", {
                            // min: 0.01,
                            // max: 400,
                            min: nyMin,
                            max: nyMax,
                        });
                    });
                });
            }
        }
    };
}

function touchZoomPlugin(opts) {
    function init(u, opts, data) {
        let plot = u.root.querySelector(".u-over");
        let rect, oxRange, oyRange, xVal, yVal;
        let fr = {x: 0, y: 0, dx: 0, dy: 0};
        let to = {x: 0, y: 0, dx: 0, dy: 0};

        function storePos(t, e) {
            let ts = e.touches;

            let t0 = ts[0];
            let t0x = t0.clientX - rect.left;
            let t0y = t0.clientY - rect.top;

            if (ts.length == 1) {
                t.x = t0x;
                t.y = t0y;
                t.d = t.dx = t.dy = 1;
            }
            else {
                let t1 = e.touches[1];
                let t1x = t1.clientX - rect.left;
                let t1y = t1.clientY - rect.top;

                let xMin = Math.min(t0x, t1x);
                let yMin = Math.min(t0y, t1y);
                let xMax = Math.max(t0x, t1x);
                let yMax = Math.max(t0y, t1y);

                // midpts
                t.y = (yMin+yMax)/2;
                t.x = (xMin+xMax)/2;

                t.dx = xMax - xMin;
                t.dy = yMax - yMin;

                // dist
                t.d = Math.sqrt(t.dx * t.dx + t.dy * t.dy);
            }
        }

        let rafPending = false;

        function zoom() {
            rafPending = false;

            let left = to.x;
            let top = to.y;

            // non-uniform scaling
            let xFactor = fr.dx / to.dx;
            let yFactor = fr.dy / to.dy;

            // uniform x/y scaling
            //let xFactor = fr.d / to.d;
            //let yFactor = fr.d / to.d;

            let leftPct = left/rect.width;
            let btmPct = 1 - top/rect.height;

            let nxRange = oxRange * xFactor;
            let nxMin = xVal - leftPct * nxRange;
            let nxMax = nxMin + nxRange;

            let nyRange = oyRange * yFactor;
            let nyMin = yVal - btmPct * nyRange;
            let nyMax = nyMin + nyRange;

            u.batch(() => {
                u.setScale("x", {
                    min: nxMin,
                    max: nxMax,
                });

                u.setScale("y", {
                    min: nyMin,
                    max: nyMax,
                });
            });
        }

        function touchmove(e) {
            storePos(to, e);

            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(zoom);
            }
        }

        plot.addEventListener("touchstart", function(e) {
            e.preventDefault();
            rect = plot.getBoundingClientRect();

            storePos(fr, e);

            oxRange = u.scales.x.max - u.scales.x.min;
            oyRange = u.scales.y.max - u.scales.y.min;

            let left = fr.x;
            let top = fr.y;

            xVal = u.posToVal(left, "x");
            yVal = u.posToVal(top, "y");

            document.addEventListener("touchmove", touchmove, {passive: true});
        });

        plot.addEventListener("touchend", function(e) {
            document.removeEventListener("touchmove", touchmove, {passive: true});
        });
    }

    return {
        hooks: {
            init
        }
    };
}


export {
    wheelZoomPlugin, touchZoomPlugin
};
