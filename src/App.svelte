<script>
    import Uplot from "./uplot_v5.svelte";
    import Table from "./simple_table.svelte";
    import {fetch_ids, Timeout, get_sensor_list, load_calibrations, read_sensor} from "./load_cal.js";
    // import MyCollapse from "./MyCollapse.svelte";
    import {merge_data} from "./merge_v3.js";
    import Loader from "./Loader.svelte";
    // import {nipy_spectral}  from './js-colormaps-mod.js';
    // let colormap = nipy_spectral;
    import {colors} from "./colors.js";
    // calculate colors
    let data = [
        [1546300800, 1546387200],    // x-values (timestamps)
        [        35,         15],    // y-values (series 1)
        [        90,         15],    // y-values (series 2)
    ];
    let count = 0;
    let cursor_data = [];
    var repeat;

    /*
    let data_ready = true;
    let table_data = [0, 1, 2];
    let labels = ['TIME', 'a', 'b'];
    let loading_id = -1;
    */ 
    import { onMount } from 'svelte';
    import {linear} from 'everpolate';
    import * as lttb from 'downsample-lttb';
    import ky from 'ky';
    console.log(ky);
    
    // const module = import('got');
    // import * as got from 'got';
    // console.log('got');

    const downsample = lttb.default.processData;
    /*
    // test that lttb is working
    var dummyDataSeries = [[1,2],[2,2],[3,3],[4,3],[5,6],[6,3],[7,3],[8,5],[9,4],[10,4],[11,1],[12,2]];
    console.log(downsample(dummyDataSeries, 3));
    */
    // var data;
    var loading_id = -1;
    var last_ts = 0;
    var data_ready = false;
    var labels;
    var show_curves = [true]

    let host = '132.163.53.82:3200';  // database for loading initial data
    var loading_message = 'Loading';
    let fetchEvent = new Event('fetch');

    // let ids = [100];
    // let ids = [4, 5, 6, 7, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109];
    // let ids = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109];
    // let ids = [4, 5, 6, 7 ];
    // let ids = [4, 100, 200, 300, 301];
    // ids = [300, 301, 302, 303];
    let ids = [4, 5, 6, 7, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
        202,  206, 210, 214, 216, 217, 218, 219, 220, 300, 301,
        302, 303, 304, 305, 306];
    //     301, 302, 303, 304, 305, 306];
    // let ids = [4, 5, 6, 7, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
    //     200, 201, 204, 205, 208, 209, 212, 213, 216, 217, 218, 219, 220, 300,
    //    301, 302, 303, 304, 305, 306];
    // let ids = [ 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 200, 201, 204, 205, 208, 209, 212, 213, 216, 217, 218, 219, 220, 300, 301, 303, 304, 305, 306];
    var cals;
    var diode_list, compressor_list, heaters_list, lockins_list, sensor_list;
    var plot_ids;
    // var show_curves;
    var sensor_names;
    var table_data;

    $: { 
        console.log('change loading_message', loading_message);
    }
    // $: { console.log('show_curves', show_curves); }
    onMount( async() => {
        var loading_elt = document.getElementById('message'); 
        console.log(loading_elt);
        console.log('loading sensor lists and calibrations') 
        var ky_test = await ky(`http://${host}/database/log.db/compressor_list`).json()
        console.log(ky_test);
        loading_message = 'loading calibrations'
        cals = await load_calibrations(host);
        console.log('cals', cals, cals['DC2018'](0.5), cals['DT670'](0.5));
        console.log('cals RuOx', 
            cals['RuO2Mean'](1000), cals['RO600'](1000), cals['ROX6951'](1000));
        let url = `http://${host}/database/log.db/diode_list`;
        diode_list = (await get_sensor_list(url))['data'];
        console.log('after get diode_list', diode_list);
        url = `http://${host}/database/log.db/compressor_list`;
        compressor_list = (await get_sensor_list(url))['data'];
        console.log('after get compressor_list', compressor_list);
        sensor_list = [...diode_list, ... compressor_list];
        url = `http://${host}/database/log.db/heaters_list`;
        heaters_list = (await get_sensor_list(url))['data'];
        console.log('after get heaters_list', heaters_list);
        sensor_list = [...sensor_list, ...heaters_list];
        url = `http://${host}/database/log.db/lockins_list`;
        lockins_list = (await get_sensor_list(url))['data'];
        console.log('after get lockins_list', lockins_list);
        sensor_list = [...sensor_list, ...lockins_list];
        console.log('full sensor_list', sensor_list);
        let stop_ts = Math.floor(Date.now()/1000)
        // var start_ts = stop_ts - 60*60;
        var start_ts = stop_ts - 7*24*60*60;
        //start_ts = 0
        var earliest_ts = new Date("2023-07-12, 00:00:00 MDT").getTime()/1000
        console.log('start_ts', start_ts);
        console.log('stop_ts', stop_ts);
        console.log('earliest_ts', earliest_ts);
        start_ts = (earliest_ts > start_ts) ? earliest_ts : start_ts;
        var history_v2 = [];
        labels=['TIME'];        
        loading_message = 'loading data'

        var responses = await fetch_ids(host, ids, loading_elt, start_ts, stop_ts);
        loading_message = 'process json data'
        for (const response of responses) {
            var loading_elt = document.getElementById('message'); 
            console.log('loading_elt', loading_elt);
            console.log('loading_elt.innerHTML', loading_elt.innerHTML);
            console.log('process response', response);
            /* 
            // Code to timeout if json conversion fails.

            let timeout = new Timeout();
            console.time('json');
            var sensor_data = await timeout
                .wrap(response.json(), 2000, { reason: 'json timeout' })
                .then( async data => {return data['data']})
                .catch( (data)=> {console.log('catch json timeout', data.reason); })
                .finally ( ()=> {
                    timeout.clear(...timeout.ids);
                    console.timeEnd('json');
                });
            */
            // let sensor_data = (await response.json())['data'];
            
            var sensor_data = response['data'];
            // console.log('sensor_data length', sensor_data.length);
            let id = sensor_data[0][1];
            loading_id = id;
            let sensor_info = sensor_list.find(elt => elt[0]==id);
            // console.log('found id',id, sensor_info[3]);
            labels.push(sensor_info[1]);
            console.log('found id',id, sensor_info[1], sensor_info[3]);
            show_curves.push(true);
            // console.log(show_curves);
            var trace; 
            let use_lttb = false; //true;
            loading_elt.innerHTML = "Processing "+sensor_info[1]
            console.log('loading_message', loading_message);
            if (use_lttb) { 
                var points = sensor_data.map(x=>[x[0], 
                    cals[sensor_info[3]](x[2])]);
                var trace_small = downsample(points, 35000);
                trace = [trace_small.map(x=>x[0]), trace_small.map(x=>x[1])]
            } else {  
                trace = [
                    sensor_data.map(x=>x[0]),
                    cals[sensor_info[3]](sensor_data.map(x=>x[2])) 
                ];
            } 
            console.time('merge');
            if (history_v2.length==0) {
                // console.log('start history_v2');
                history_v2 = trace;
            } else {
                // console.log('merge history_v2');
                history_v2 = merge_data(history_v2, trace);
            }
            console.timeEnd('merge');
            console.log('merging done for',id, sensor_info[1], sensor_info[3]);
        }

        plot_ids = [...labels];
        plot_ids.shift();
        sensor_names = [...plot_ids];
        console.log('labels', labels);
        console.log('show_curves', show_curves);
        console.log('v2', history_v2);
        data_ready = true;

        last_ts = history_v2[0][history_v2[0].length-1];
        console.log('latest ts',last_ts);
        data = history_v2;
        console.log('data', data);
        var last_data = history_v2.map(x=>x[x.length-1]);
        console.log('last_data', last_data);
        last_data = last_data.map( (x,i) => Array.isArray(x) ? Number(x[0].toFixed(2)): ((x==null) ? -1 : Number(x.toFixed(2))))
        console.log('last_data', last_data);
        table_data = last_data.map(
            (x,i)=>  (i>0) ? (Array.isArray(x) ? x[0].toFixed(2): x.toFixed(2)): (new Date(x.toFixed(0)*1000)).toLocaleString()
        );
        
        repeat = setInterval( append, 10000);

    });
    $: { 
        console.log('App.svelte ' + 'plot_ids', plot_ids);
        // console.log('App.svelte ' + 'show_curves', show_curves);
        if (plot_ids !== undefined) {
            for (const label of plot_ids) {
                let id_list = sensor_list.find(elt => elt[1]==label)
                // console.log(id_list);
            }
        }
    }
    $: {
        // update table with cursor_data
        // console.log('cursor_data', cursor_data);
        if (cursor_data.length > 0) { 
            table_data = cursor_data.map(
                // (x,i)=>  (i>0) ? x[0].toFixed(2) : (new Date(x.toFixed(0)*1000)).toLocaleString()
                (x,i)=>  (x == null) ? -1 : ((i>0) ? (Array.isArray(x) ?
                    x[0].toFixed(2): x.toFixed(2)): (new Date(x.toFixed(0)*1000)).toLocaleString())
            );
            /*
            table_data[0] = (new Date(cursor_data[0].toFixed(0)*1000)).toLocaleString()
            for (let i=1; i<table_data.length; i++) {
                table_data[i] = cursor_data[i];
            }
            */
        }
    }
    var appending = false;
    async function bulk_download(start, stop=null) {
        let bulk_data = [];
        let new_data = [];
        let bulk_url;
        let url_prefix ='http://132.163.53.82:3201/database/log.db/'
        let query = '';
        query = (stop===null) ?  `data?start=${start}`:`start=${start}&stop=${stop}`;
        bulk_url = url_prefix + query;
        console.log('bulk_url', bulk_url);
        var bulk_json = await fetch(bulk_url).then(response => response.json())
        if (bulk_json !== undefined) { 
            bulk_json = bulk_json['data'];
            if (bulk_json !== undefined) { 
                var bulk_ts = Array.from(new Set(bulk_json.map(x=>x[0])));
                console.log('bulk download', bulk_json.length, bulk_ts);
                for (const ts of bulk_ts) {
                    var one_ts = bulk_json.filter(x => x[0]==ts);
                    last_ts = ts;
                    // console.log('ts of bulk_ts:', ts)
                    // console.log(ts, one_ts);
                    //console.log(ids.every(x=>one_ts.map(x=>x[1]))); // .includes(x)));
                    // console.log(ids)
                    // console.log('one_ts map to ids', one_ts.map(x=>x[1]));
                    if(ids.every(x => one_ts.map(x=>x[1]).includes(x))) {
                        new_data = [ts];
                        for (const id of ids) {
                            let sensor_info = sensor_list.find(elt => elt[0]==id);
                            var reading = one_ts.filter(x => x[1] == id);
                            reading = reading[0][2];
                            // console.log(id, reading);
                            reading = Array.isArray(reading) ? reading[0]: reading;
                            var converted = cals[sensor_info[3]](reading);
                            converted = Array.isArray(converted) ? converted[0]: converted;
                            new_data.push(converted);
                        }
                        bulk_data.push(new_data);
                        console.log('bulk new_data', new_data);
                    }
                }
            }
        }
        console.log('bulk_data', bulk_data);
        return bulk_data;
    }
    async function append() {
        clearInterval(repeat);
        // var catchup = true;
        // while (catchup & (appending==false) ) {
        if (true) {
            // console.log('on catchup appending', appending);
            appending = true;
            if (last_ts>0) {
                console.log('append, last_ts: ', last_ts);
                let new_ts = 0;

                last_ts = data[0][data[0].length-1];
                let new_data = [];
                let bulk_data = await bulk_download(last_ts + 1)
                for (var j=0; j<bulk_data.length; j++) {
                    new_data = bulk_data[j];
                    for(var i=0; i<new_data.length; i++) {
                        // console.log('push to data', new_data[i], data[i]);
                        // console.log('data[i] is view?', data[i].isView());
                        if (Array.isArray(data[i])) {
                            data[i].push(new_data[i])
                        } else {  // typedArray Float64Array
                            // console.log('new_data', i, new_data[i]);
                            if (Array.isArray(new_data[i])) {
                                data[i] = new Float64Array([...data[i], ...new_data[i]])
                            } else {
                                data[i] = new Float64Array([...data[i], new_data[i]])
                            }
                        }

                    }
                }
                data = data;
                // table_data = new_data; 
                if (new_data.length>0) {
                    table_data = new_data.map(
                        // (x,i)=>  (i>0) ? x[0].toFixed(2) : (new Date(x.toFixed(0)*1000)).toLocaleString()
                        (x,i)=>  (x == null) ? -1 : ((i>0) ? (Array.isArray(x) ? x[0].toFixed(2): x.toFixed(2)): (new Date(x.toFixed(0)*1000)).toLocaleString())
                );
                console.log('update table_data:', table_data); 
                }
                // console.log('data size', data.length, data[0].length);
            } 
            // appending = false;
            // catchup = false;
        }
        repeat = setInterval( append, 10000);
    }
    function tableClick(e) {
        console.log('tableClick', e.detail);
        console.log('labels', labels);
        console.log('show_curves', show_curves);
        let idx =  labels.findIndex((elt)=>elt==e.detail.label);
        console.log(e.detail['label'], idx); // labels.findIndex((elt)=>elt==e.detail.label) );
        console.log('before tableClick changes ',show_curves);
        console.log(show_curves[idx]);
        show_curves[idx] = !show_curves[idx];
        console.log(show_curves[idx]);
        console.log('after tableClick changes ',show_curves);
        // just_finished_toggle_logy = true;
    }
    // setInterval( append, 10000);
     
    /* function append() { */
    /*     data_ready = true; */
    /*     //apppend value to end of each array via push */
    /*     for(var i=0; i<data.length; i++) { */
    /*         if(i==0) { */
    /*             /1* data[i].push(1546387200 + 1000*count); *1/ */
    /*             data[i].push(new Date().getTime()/1000 ); */
    /*             count++; */
    /*         } else { */
    /*             data[i].push(100*Math.random()) */	
    /*         } */
    /*     } */
    /*     data=data; */
    /* } */

    /* setInterval( append, 10000); */ 
</script>

        <body>
<style>

    .sidebar {
        height: 90vh;
        width: 250px;
        position: fixed;
        top: 0;
        left: 0;
        padding-top: 40px;
        font-size: 12px;
        overflow-y: scroll;
        /* background-color: lightblue; */
    }

    .sidebar div {
        padding: 8px;
        font-size: 12px;
        display: block;
    }
    .body-text {
        margin-left: 250px;
        font-size: 16px;
    }
    /* table thead {display: block;} */
    /* table tbody {height:300px; overflow-y:scroll; display:block;} */

</style>
<div class="sidebar">
    {#if data_ready}
        <Table table_data={table_data} labels={labels} show={show_curves}
            colors={colors} on:click={tableClick}/>
    <!--
    <MyCollapse label={'plot'} bind:choices={plot_ids} menu={sensor_names}/>
    -->
    {/if}
</div>

<div class="body-text">
    {#if data_ready}
        <Uplot data={data} labels={labels} show={show_curves} colors={colors} bind:cursor_data={cursor_data} />
    {:else}
        <p id="message"> {loading_message} </p>
        <!--
        <Loader loading={!data_ready}/>
        -->
    {/if}
</div>

        </body>
