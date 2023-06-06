<script>
    import uPlot from 'uplot';
    import { onMount, afterUpdate } from 'svelte';
    import {data_config, opts_config} from './uplot_v5_config.js'
    // import {data_config, opts_config, colors} from './uplot_v3_config.js'
    import {downloadBlob} from './download.js'
    import SvgIcon from './SvgIcon.svelte'
    import LogIcon from './LogIcon.svelte'
    import LinIcon from './LinIcon.svelte'
    import {bellIcon, download, home, png} from './AppIcons.js'
    import { wheelZoomPlugin, touchZoomPlugin } from './plot_zoom.js';
    // import {legendAsTooltipPlugin} from ./'legendTooltip.js';
    import {tab20c} from './js-colormaps-mod.js';

    import filesaver from 'file-saver';
    export let data = data_config;
    export let opts = opts_config;
    export let labels = ['y0', 'y1']
    export let show = [true, true]
    export let colors = ['red', 'blue'];
    export let cursor_data = [];
    let plotDiv;
    // let uPlot;
    let uplot;
    let html2canvas;
    let autox = true;
    let autoy = true;
    let logy = 1;
    let just_finished_toggle_logy = false;  // This is a terrible global variable hack to get toggle linear/log scale to work
    // console.log(opts)
    let y_range;
    let x_range;

    opts.scales.y.distr = logy;
    opts.scales.x.auto = ()=> {return autox}
    opts.scales.y.auto = ()=> {return autoy}
    //console.log(opts.scales.y.range);
    opts.scales.x.range = (self, min, max) => {
        console.log('******************* x.range function');
        console.log('called with min, max:', min, max);
        min = min==null ? min : parseFloat(min);
        max = max==null ? max : parseFloat(max);
        x_range = [min, max];
        console.log('returned x_range: ', x_range);
        // console.trace()
        return x_range
    }
    opts.scales.y.range = (self, min, max) => {
        console.log('******************* y.range function');
        console.log('called with min, max:', min, max);
        // min = min==null ? min : parseFloat(min);
        // max = max==null ? max : parseFloat(max);
        y_range = [min, max];
        if ((min==null) || (max==null)) {
            console.log(`${'*'.repeat(20)} something is null`);
            let max_calc=[];
            let min_calc=[];
            for (let i=1; i<data.length; i++) {
                max_calc.push(Math.max(...data[i]))
                min_calc.push(Math.min(...data[i]))
            }
            max = Math.max(...max_calc);
            min = Math.min(...min_calc);
            console.log('self calc min max', min,max);
            if (logy==1) {
                y_range = uPlot.rangeNum(min, max, 0.1, true);
            } else if (logy==3) {
                y_range = uPlot.rangeLog(min, max, 1, false);
            }

        } else y_range = [min, max];
        console.log('returned y_range: ', y_range);
        // console.trace()
        return y_range
    }
    /*
    opts.scales.y.range = (self, min, max) => {
        console.log('before', min, max);
        if (!autoy) {
            console.log('autoy: ', autoy);
            let max_calc=[];
            let min_calc=[];
            for (let i=1; i<data.length; i++) {
                max_calc.push(Math.max(...data[i]))
                min_calc.push(Math.min(...data[i]))
            }
            max = Math.max(...max_calc);
            min = Math.min(...min_calc);
            console.log(min,max);
            min = 0.1
            max = 3
            y_range = uPlot.rangeNum(min, max, 0.1, true);;
        } else {
            y_range = uPlot.rangeNum(0.01, 400, 0.1, true);;
        }
        console.log('y:', y_range)
        return y_range;
    }
    opts.scales.y.range = null;
    */
    /*
    opts['plugins'] =  [ 
       legendAsTooltipPlugin(),
     ]
    */
    opts['plugins'] =  [ 
        wheelZoomPlugin({factor: 0.80, uPlot:uPlot}),
        // touchZoomPlugin()
    ];
    opts.cursor.bind.dblclick = (u, targ, handler) => {
        return e => {
            console.log(`${'*'.repeat(20)} in dblclick`)
            autox = true;
            autoy = true;
            const { left, top } = u.cursor;
            console.log('dblclick: left, top', left, top);
            let xVal = u.posToVal(left, "x");
            let yVal = u.posToVal(top, "y");
            console.log('dblclick: xVal, yVal', xVal, yVal);

            handler(e)              
        } 
    }
    opts.cursor.bind.mousedown = (u, targ, handler) => {
        return e => {
            console.log('mousedown', e);
            handler(e)
        }
    }
    opts.cursor.bind.mouseup = (u, targ, handler) => {
        return e => {
            console.log('mouseup', e);
            handler(e)
        }
    }
     
    opts.cursor.bind.mousemove = (u, targ, handler) => {
        return e => {
            if (e.buttons==1) {
                autox = false;
                autoy = false;
                // console.log(e)
                if (e.shiftKey) {
                    autox = false;
                    autoy = false;
                }
                console.log('mousemove button', e.button, 'buttons', e.buttons, 'shiftKey', e.shiftKey);
                consoleLogScales(uplot.scales, 'in mouse move uplot.scales');
                const { left, top } = u.cursor;
                console.log('mousemove: left, top', left, top);
                let xVal = u.posToVal(left, "x");
                let yVal = u.posToVal(top, "y");
                console.log('mousemove: xVal, yVal', xVal, yVal);
                console.log('uplot_v5.svelte: u.curosr', u.cursor); 
                console.log('uplot_v5.svelte: u', u); 
            } else {
                console.log('no click on mouse move');
                const { left, top } = u.cursor;
                const idx = u.posToIdx(left);
                cursor_data = u.data.map((element) => element[idx]);
                // console.log('u.posToIdx', idx, cursor_data);
            }
            handler(e)
        }
    }
     
    let s = [{}]
    for (let i=0; i<data.length-1; i++) {
        s.push({
            spanGaps: true,
            label: "y"+i,
            /* stroke: colors[9-i], */
            /*stroke: colors[(9-i)%15],*/
            stroke: colors[i], 
            width: 2,
            dash: [10, 3, 3, 3, 3, 3],
        })
    }
    opts.series = s;
    opts.series[0].value = "{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}";
    labels.forEach((item, index) => {
        if (index>0) {
            opts.series[index].label = item; // offset index by 1, index 0: time
            opts.series[index].show = show[index];
            if (item.includes('HEATER')) {
                // make fill partially transparent
                opts.series[index].fill = opts.series[index].stroke + '20'
                console.log(opts.series[index])
                console.log('item', item)
            }
        }
    });
    console.log('opts', opts)
    console.log('opts.series', opts.series)
    console.log('labels', labels);
    console.log('show', show);

    let mounted = false;
    onMount(async () => {
        /*
        const module = await import ('uplot');
        uPlot = module.default;
        console.log("uplot onMount")
        uplot = new uPlot(opts,data,plotDiv); 
        mounted = true;
        */
        // opts.series[4].show=false;  # this hides the series on the plot
        uplot = uPlot(opts,data,plotDiv); 
        console.log('mounting uplot_v3', show, labels);
        mounted = true;
        plotDiv.addEventListener("wheel", e => {
            // console.log('wheel in uplot_v3',e);
            autox = false;
            autoy = false;
        })

        /*
        const m = await import ('html2canvas');
        html2canvas = m.default;
        console.log(html2canvas)
         */
    });
    /*
    $: {console.log('data changed into uPlot, data.length', data.length);}
    $: {console.log('labels changed into uPlot, label.length', labels.length);}
    $: {
        console.log('uplot_v3 show updated', show); 
    }
    */
    $: {
        console.log('uplot_v3 show update, try to update plot');
        console.log(show, uplot, opts);
        
        /*
        show.forEach((item, index) => {
            if (index>0) {
                opts.series[index].show = show[index]; // offset index by 1, index 0: time
            }
        });
        */ 
        if (mounted) {
            
            show.forEach((item, index) => {
                // opts.series[index].show = show[index]; // offset index by 1, index 0: time
                // console.log('mounted', index, uplot.series[index].show);
                let local_opts = {show: show[index]}
                // console.log('opts for setSeries', local_opts);
                uplot.setSeries(index, local_opts) 
            });
            console.log(uplot.series);
            console.log('autox', autox);
            /*
            if (autox) {
              console.log('trying to do auto version');
              deleteAndCreateUplot();
            }
            */
        }
    }

    function setManualAxis(box) {
        //  uplot is a global object for the uPlot element
        //  box is what the new axis will be set to [xmin, xmax, ymin, ymax]

        //  This doesn't update the plot properly when zoomed in
        // uplot.setData(data, false);
        // -----------
        //  Using "batch" more reliably updates the plot
        // updates plot data and scale correctly
        console.log('*************** setManualAxis');
        // console.log('box: ', box);
        uplot.batch(() => {
            uplot.setData(data); // this auto zooms and so we need the setScale to undo
            // uplot.setData(data, false); // this does not update as reliably
            // x doesn't need to be done if using setData with false  
            uplot.setScale("x", {
                min: box[0],
                max: box[1],
                // min: scXMin0,
                // max: scXMax0,
            });
            uplot.setScale("y", {
                min: box[2],
                max: box[3],
                // min: scYMin0,
                // max: scYMax0,
            });

        });
        // console.log('box after', box);
    } 
    function consoleLogScales(scales, header) {
        console.log(header, scales.x, scales.y, scales.x.min);
        console.log(header + ' xmin, xmax', scales.x.min, scales.x.max);
        console.log(header + ' ymin, ymax', scales.y.min, scales.y.max);
    }
    afterUpdate( ()=> {
        console.log('afterUpdate data[0].length', data[0].length)
        console.log('just_finished_toggle_logy', just_finished_toggle_logy);
        if(uplot && autox && autoy) { 
            // console.log('no setData here, commented out');
            console.log('afterUpdate: setData with auto');
            uplot.setData(data);
        } else if (uplot && !just_finished_toggle_logy) {
            // consoleLogScales( uplot.scales, 'uplot.scales after update');
            // consoleLogScales( opts.scales, 'opt.scales after update');
            let u = uplot;
            if (u.scales.x.min==null) u.scales = opts.scales;
            let scXMin0 = u.scales.x.min;
            let scXMax0 = u.scales.x.max;
            let scYMin0 = u.scales.y.min;
            let scYMax0 = u.scales.y.max;
            let box = [scXMin0, scXMax0, scYMin0, scYMax0];
            setManualAxis(box);
        }

        if (just_finished_toggle_logy) { 
            console.log('At the end of afterUpdate: just_finished_toggle_logy', just_finished_toggle_logy);
            
            just_finished_toggle_logy = false;
        }

    });
    /*
    afterUpdate( ()=> {
        console.log('afterUpdate data[0].length', data[0].length)
        console.log('show', show);
        console.log('just_finished_toggle_logy', just_finished_toggle_logy);
        if (mounted) {
            // console.log('scales before', uplot.scales);
            if(uplot && autox && autoy) { 
                console.log('no setData here, commented out');
                // console.log('setData with auto');
                // uplot.setData(data);
            } else if (uplot && !just_finished_toggle_logy) {
                console.log('setData with no auto');
                console.log(uplot.scales.x, uplot.scales.y);
                console.log(uplot.scales.x.min, uplot.scales.x.max);
                console.log(uplot.scales.y.min, uplot.scales.y.max);
                console.log(opts.scales.x.min, opts.scales.x.max);
                console.log(opts.scales.y.min, opts.scales.y.max);
                
                let u = uplot;
                if (u.scales.x.min==null) u.scales = opts.scales;
                let scXMin0 = u.scales.x.min;
                let scXMax0 = u.scales.x.max;
                let scYMin0 = u.scales.y.min;
                let scYMax0 = u.scales.y.max;
                let box = [scXMin0, scXMax0, scYMin0, scYMax0];
                console.log('box before', box);
                console.log('opts', opts.scales.x, opts.scales.y);
                console.log(opts.scales.x.min, opts.scales.x.max);
                console.log(opts.scales.y.min, opts.scales.y.max);
                // uplot.setData(data); // this auto zooms and so we need the setScale to undo
                uplot.setData(data, false); // this does not update as reliably
                setManualAxis(box);
            }
            // console.log('uplot.scales after update');
            // console.log(uplot.scales.x.min, uplot.scales.x.max);
            // console.log(uplot.scales.y.min, uplot.scales.y.max);
            consoleLogScales( uplot.scales, 'uplot.scales after update');
            consoleLogScales( opts.scales, 'opt.scales after update');
            console.log('opts.scales after update');
            // console.log(opts.scales.x.min, opts.scales.x.max);
            // console.log(opts.scales.y.min, opts.scales.y.max);
            
            if (just_finished_toggle_logy) { 
                console.log('just_finished_toggle_logy', just_finished_toggle_logy);
                just_finished_toggle_logy = false;
            }
        }
    })
    */
    function toggle_autox() {
        autox = !autox;
    }
    function toggle_autoy() {
        autoy = !autoy;
    }
    function resetAxis() {
        autox = true;
        autoy = true;
        uplot.setData(data)
    }
    function toggle_logy() {
        if (logy==3) {
            logy = 1;
        } else {
            logy = 3;
        }
        console.log('************'+'toggle y', logy);
        console.log('uplot.scales before toggle update', uplot.scales.x, uplot.scales.y);
        let prevscales = uplot.scales
        console.log('prevscales', prevscales);
        console.log('opts', opts.scales.x, opts.scales.y);
        opts.scales = prevscales
        opts.scales.y.distr = logy;
        uplot.setScale("x", {
            distr: logy
        });
        console.log('tried to set uplot scale to ylog', uplot.scales);
        if ((logy==3) && (opts.scales.y.min<=0)) {
            console.log('fix ymin on logscale');
            opts.scales.y.min = 0.01;
        }
        if (logy==3) {
            let rangeLog = uPlot.rangeLog(opts.scales.y.min,
                 opts.scales.y.max, 10, false);
            console.log('rangeLog', rangeLog);
            opts.scales.y.min = rangeLog[0];
            opts.scales.y.max = rangeLog[1];
            // opts.scales.y._min = rangeLog[0];
            // opts.scales.y._max = rangeLog[1];
        }
        console.log('opts', logy, opts.scales.x, opts.scales.y);
        let auto = autox;
        console.log('auto', auto)
        console.log('************  inside toggly lin/log ');
        if (auto) {
            console.log('************  inside toggly lin/log with autoscale ');
            // console.log('auto is true, but we are not updating the plot');
            console.log('update uplot with setData');
            uplot.setData(data);
        } else {
            console.log('************  inside toggly lin/log with no auto ');

            // console.log('reset axis with auto')
            resetAxis();
            // console.log('finished reset')
        
            autox = false
            autoy = false
        
            let box = [
                opts.scales.x.min,
                opts.scales.x.max,
                opts.scales.y.min,
                opts.scales.y.max,
            ];
            console.log('box to undo auto', box);
            setManualAxis(box);
            console.log('finished manual setting of the axis limits');
        }
        just_finished_toggle_logy = true;
        /* 
        if (true) {
            uplot.batch(() => {
                uplot.setScale("x", {
                    min: opts.scales.x.min,
                    max: opts.scales.x.max,
                });

                uplot.setScale("y", {
                    // min: 0.01,
                    // max: 400,
                    min: opts.scales.y.min,
                    max: opts.scales.y.max
                });
            });
            just_finished_toggle_logy = true;
        } else {
            uplot.scales.x.min = opts.scales.x.min;
            uplot.scales.x.max = opts.scales.x.max;
            uplot.scales.y.min = opts.scales.y.min;
            uplot.scales.y.max = opts.scales.y.max;
        };
        */
        // deleteAndCreateUplot();
        console.log('scales after toggle_log update', uplot.scales.x, uplot.scales.y);
        // just_finished_toggle_logy = true;
    }
    function deleteAndCreateUplot() {
        // Not sure which way is better...
        // plotDiv.innerHTML = '';
        plotDiv.removeChild(plotDiv.firstChild)
        // console.log('toggle_logy', data.length);
        uplot = new uPlot(opts,data,plotDiv); 
    }

    function saveCanvas()  {
        var canvas = document.querySelector(".u-wrap > canvas:nth-child(2)");
        console.log("canvas", canvas)
        canvas.toBlob(function(blob) {
            filesaver.saveAs(blob, "uplot.png");
        });
    }
    function saveCanvas2() {
            html2canvas(plotDiv).then(canvas => {
                    document.body.appendChild(canvas)
            });
    }
    function downloadData() {
        console.log("Download file");
        const filename = 'fridge.json';
        const blob = new Blob([JSON.stringify(data)], {type : 'application/json'});
        downloadBlob(blob, filename);
    }


</script>
<style>
/* @import "https://leeoniya.github.io/uPlot/dist/uPlot.min.css"; */
button {
    font-size: 18px;
    }
</style>
    <link rel="stylesheet" href="https://leeoniya.github.io/uPlot/dist/uPlot.min.css">
    <div>
        <button on:click={resetAxis}>
            <SvgIcon d={home} />
        </button>
        <button on:click={toggle_logy}>
            {#if logy==3}
                <LinIcon />
            {:else}
                <LogIcon />
            {/if}
        </button>
        <button on:click={saveCanvas}>
            <SvgIcon d={png} />
        </button>
        <button on:click={downloadData}>
            <SvgIcon d={download} />
        </button>
        <table>
            <tr>
                <td>
                    zoom x and y: mousewheel
                </td>
                <td>
                    zoom x only: ctrl + mousewheel
                </td>
                <td>
                    zoom y only: shift + mousewheel
                </td>
            </tr>
        </table>

    </div>
    <div bind:this={plotDiv}></div>


