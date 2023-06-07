function merge_ts(a, b) {
  var unique_ts = [...new Set([...a[0], ...b[0]])];
  var ts = Float64Array.from(unique_ts);
  ts.sort()
  return ts;
}

function mergeNull(ts, a) {
  var out = [ts]
  for (let i=1; i<a.length; i++) {
    let hash = {}  // create lookup table/dictionary
    a[0].forEach((elt, idx) => hash[elt] = a[i][idx])
    // console.log(hash)
    var newTSArray = Array.from(ts)
    var d = newTSArray.map(elt => hash[elt] !== undefined ? hash[elt] : null)
    // console.log(d)
    out.push(d)
  }
  return out
}

function merge_data(a, b) {
  /*
  // first elements are timestamps... construct merged timestamps
  var unique_ts = [...new Set([...a[0], ...b[0]])];
  var ts = Float64Array.from(unique_ts);
  ts.sort();
  */
  console.time('merge.js')
  var ts = merge_ts(a,b);
  
  console.log('a[0] length and ts length:', a[0].length, ts.length)
  console.time('merge a');
  if ( a[0].length != ts.length ) {
    console.log('mergeNull ts, a')
    a = mergeNull(ts, a)
  }
  console.timeEnd('merge a');
  console.time('merge b');
  if ( b[0].length != ts.length ) {
    console.log('mergeNull ts, b')
    b = mergeNull(ts, b)
  }
  console.timeEnd('merge b');
  var merged =  [ts, ...a.slice(1), ...b.slice(1)]
  console.timeEnd('merge.js')
  return merged
}

exports.merge_data = merge_data
exports.merge_ts = merge_ts